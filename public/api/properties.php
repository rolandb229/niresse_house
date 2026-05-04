<?php
// ============================================================
// API Biens Immobiliers - GET avec filtres / POST pour ajouter
// ============================================================
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $db = getDB();

    // Construction de la requete avec filtres
    $where = ['1=1'];
    $params = [];

    // Filtre par type
    if (!empty($_GET['type'])) {
        $where[] = 'p.type = :type';
        $params[':type'] = $_GET['type'];
    }

    // Filtre par ville
    if (!empty($_GET['ville'])) {
        $where[] = 'l.ville = :ville';
        $params[':ville'] = $_GET['ville'];
    }

    // Filtre par département
    if (!empty($_GET['departement'])) {
        $where[] = 'l.departement = :departement';
        $params[':departement'] = $_GET['departement'];
    }

    // Filtre par prix
    if (!empty($_GET['prix_min'])) {
        $where[] = 'p.prix >= :prix_min';
        $params[':prix_min'] = (int)$_GET['prix_min'];
    }

    if (!empty($_GET['prix_max'])) {
        $where[] = 'p.prix <= :prix_max';
        $params[':prix_max'] = (int)$_GET['prix_max'];
    }

    // Filtre par nombre de chambres
    if (!empty($_GET['chambres_min'])) {
        $where[] = 'p.nombre_chambres >= :chambres_min';
        $params[':chambres_min'] = (int)$_GET['chambres_min'];
    }

    // Filtre par surface
    if (!empty($_GET['surface_min'])) {
        $where[] = 'p.surface >= :surface_min';
        $params[':surface_min'] = (int)$_GET['surface_min'];
    }

    // Recherche par mots-clés (titre, description, amenities)
    if (!empty($_GET['search'])) {
        $search = '%' . $_GET['search'] . '%';
        $where[] = '(p.titre LIKE :search OR p.description LIKE :search OR p.amenities LIKE :search)';
        $params[':search'] = $search;
    }

    // Filtre promotions
    if (!empty($_GET['promo_only'])) {
        $where[] = 'p.is_promotion = 1';
    }

    $whereClause = implode(' AND ', $where);

    // Pagination
    $page = max(1, (int)($_GET['page'] ?? 1));
    $limit = 12;
    $offset = ($page - 1) * $limit;

    // Total count
    $countSql = "SELECT COUNT(*) as total FROM properties p LEFT JOIN locations l ON p.ville_id = l.id WHERE $whereClause";
    $countStmt = $db->prepare($countSql);
    $countStmt->execute($params);
    $total = $countStmt->fetch()['total'];

    // Requete principale
    $sql = "SELECT p.*, l.ville, l.quartier, l.departement
            FROM properties p
            LEFT JOIN locations l ON p.ville_id = l.id
            WHERE $whereClause
            ORDER BY p.is_promotion DESC, p.premium DESC, p.date_creation DESC
            LIMIT $limit OFFSET $offset";

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $properties = $stmt->fetchAll();

    // Ajouter les images pour chaque bien
    foreach ($properties as &$prop) {
        $imgStmt = $db->prepare('SELECT image_url FROM property_images WHERE property_id = :pid LIMIT 3');
        $imgStmt->execute([':pid' => $prop['id']]);
        $prop['images'] = array_map(function($img) { return $img['image_url']; }, $imgStmt->fetchAll());
        
        // Récupérer les avis
        $reviewStmt = $db->prepare('SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE property_id = :pid AND approved = 1');
        $reviewStmt->execute([':pid' => $prop['id']]);
        $reviews = $reviewStmt->fetch();
        $prop['rating'] = round($reviews['avg_rating'] ?? 0, 1);
        $prop['review_count'] = (int)($reviews['count'] ?? 0);
        
        $prop['verifie'] = (bool)$prop['verifie'];
        $prop['premium'] = (bool)$prop['premium'];
        $prop['is_promotion'] = (bool)$prop['is_promotion'];
    }

    jsonResponse([
        'properties' => $properties,
        'total' => (int)$total,
        'page' => $page,
        'total_pages' => ceil($total / $limit),
    ]);

} elseif ($method === 'POST') {
    // Verifier la session admin
    if (empty($_SESSION['user']) || !in_array($_SESSION['user']['role'], ['super_admin', 'admin', 'commercial'])) {
        jsonResponse(['error' => 'Acces non autorise.'], 403);
    }

    $db = getDB();
    $data = getInput();

    $required = ['titre', 'type', 'prix', 'ville_id'];
    foreach ($required as $field) {
        if (empty($data[$field])) {
            jsonResponse(['error' => "Le champ $field est requis."], 400);
        }
    }

    $code = strtoupper(substr($data['type'], 0, 3)) . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);

    $stmt = $db->prepare('INSERT INTO properties (titre, description, type, prix, nombre_chambres, nombre_douches, surface, statut, ville_id, proprietaire_id, code_unique, verifie, premium, amenities, is_promotion) VALUES (:titre, :description, :type, :prix, :chambres, :douches, :surface, :statut, :ville_id, :proprio, :code, :verifie, :premium, :amenities, :is_promotion)');

    $stmt->execute([
        ':titre' => $data['titre'],
        ':description' => $data['description'] ?? '',
        ':type' => $data['type'],
        ':prix' => (int)$data['prix'],
        ':chambres' => (int)($data['nombre_chambres'] ?? 0),
        ':douches' => (int)($data['nombre_douches'] ?? 0),
        ':surface' => (int)($data['surface'] ?? 0),
        ':statut' => $data['statut'] ?? 'disponible',
        ':ville_id' => (int)$data['ville_id'],
        ':proprio' => $_SESSION['user']['id'],
        ':code' => $code,
        ':verifie' => (int)($data['verifie'] ?? 0),
        ':premium' => (int)($data['premium'] ?? 0),
        ':amenities' => $data['amenities'] ?? '',
        ':is_promotion' => (int)($data['is_promotion'] ?? 0),
    ]);

    $id = $db->lastInsertId();

    jsonResponse(['success' => true, 'id' => $id, 'code_unique' => $code], 201);

} else {
    jsonResponse(['error' => 'Methode non autorisee.'], 405);
}
?>

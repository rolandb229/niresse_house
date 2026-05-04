<?php
// ============================================================
// API Localites - GET liste / POST ajouter / DELETE supprimer
// ============================================================
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

if ($method === 'GET') {
    $stmt = $db->query('SELECT * FROM locations ORDER BY ville, quartier');
    jsonResponse(['locations' => $stmt->fetchAll()]);

} elseif ($method === 'POST') {
    if (empty($_SESSION['user']) || !in_array($_SESSION['user']['role'], ['super_admin', 'admin'])) {
        jsonResponse(['error' => 'Acces non autorise.'], 403);
    }

    $data = getInput();
    if (empty($data['departement']) || empty($data['ville']) || empty($data['quartier'])) {
        jsonResponse(['error' => 'Tous les champs sont requis.'], 400);
    }

    $stmt = $db->prepare('INSERT INTO locations (departement, ville, quartier) VALUES (:dep, :ville, :quartier)');
    $stmt->execute([
        ':dep' => htmlspecialchars($data['departement']),
        ':ville' => htmlspecialchars($data['ville']),
        ':quartier' => htmlspecialchars($data['quartier']),
    ]);

    jsonResponse(['success' => true, 'id' => $db->lastInsertId()], 201);

} elseif ($method === 'DELETE') {
    if (empty($_SESSION['user']) || $_SESSION['user']['role'] !== 'super_admin') {
        jsonResponse(['error' => 'Acces non autorise.'], 403);
    }

    $data = getInput();
    if (empty($data['id'])) {
        jsonResponse(['error' => 'ID requis.'], 400);
    }

    $stmt = $db->prepare('DELETE FROM locations WHERE id = :id');
    $stmt->execute([':id' => (int)$data['id']]);

    jsonResponse(['success' => true]);

} else {
    jsonResponse(['error' => 'Methode non autorisee.'], 405);
}

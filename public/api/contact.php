<?php
// ============================================================
// API Contact - Enregistrer les demandes de contact
// ============================================================
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Liste des messages (admin seulement)
    if (empty($_SESSION['user']) || !in_array($_SESSION['user']['role'], ['super_admin', 'admin'])) {
        jsonResponse(['error' => 'Acces non autorise.'], 403);
    }

    $db = getDB();
    $stmt = $db->query('SELECT cr.*, p.titre as property_titre FROM contact_requests cr LEFT JOIN properties p ON cr.property_id = p.id ORDER BY cr.date_creation DESC');
    $messages = $stmt->fetchAll();

    jsonResponse(['messages' => $messages]);

} elseif ($method === 'POST') {
    $data = getInput();

    if (empty($data['property_id']) || empty($data['nom']) || empty($data['telephone']) || empty($data['message'])) {
        jsonResponse(['error' => 'Tous les champs sont requis.'], 400);
    }

    if (strlen($data['telephone']) < 8) {
        jsonResponse(['error' => 'Numero de telephone invalide.'], 400);
    }

    $db = getDB();
    $stmt = $db->prepare('INSERT INTO contact_requests (property_id, nom, telephone, message, statut) VALUES (:pid, :nom, :tel, :msg, :statut)');
    $stmt->execute([
        ':pid' => (int)$data['property_id'],
        ':nom' => htmlspecialchars($data['nom']),
        ':tel' => htmlspecialchars($data['telephone']),
        ':msg' => htmlspecialchars($data['message']),
        ':statut' => 'nouveau',
    ]);

    jsonResponse(['success' => true, 'message' => 'Votre demande a ete enregistree avec succes.'], 201);

} elseif ($method === 'PUT') {
    // Mettre a jour le statut (admin)
    if (empty($_SESSION['user']) || !in_array($_SESSION['user']['role'], ['super_admin', 'admin'])) {
        jsonResponse(['error' => 'Acces non autorise.'], 403);
    }

    $data = getInput();
    if (empty($data['id']) || empty($data['statut'])) {
        jsonResponse(['error' => 'ID et statut requis.'], 400);
    }

    $db = getDB();
    $stmt = $db->prepare('UPDATE contact_requests SET statut = :statut WHERE id = :id');
    $stmt->execute([':statut' => $data['statut'], ':id' => (int)$data['id']]);

    jsonResponse(['success' => true]);

} else {
    jsonResponse(['error' => 'Methode non autorisee.'], 405);
}

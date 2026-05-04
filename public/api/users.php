<?php
// ============================================================
// API Utilisateurs - CRUD (admin seulement)
// ============================================================
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

// Verifier acces admin
if (empty($_SESSION['user']) || !in_array($_SESSION['user']['role'], ['super_admin', 'admin'])) {
    jsonResponse(['error' => 'Acces non autorise.'], 403);
}

$db = getDB();

if ($method === 'GET') {
    $stmt = $db->query('SELECT id, nom, email, telephone, role, date_creation FROM users ORDER BY date_creation DESC');
    jsonResponse(['users' => $stmt->fetchAll()]);

} elseif ($method === 'POST') {
    $data = getInput();

    if (empty($data['nom']) || empty($data['email']) || empty($data['password']) || empty($data['role'])) {
        jsonResponse(['error' => 'Tous les champs sont requis.'], 400);
    }

    // Verifier email unique
    $check = $db->prepare('SELECT id FROM users WHERE email = :email');
    $check->execute([':email' => $data['email']]);
    if ($check->fetch()) {
        jsonResponse(['error' => 'Cet email est deja utilise.'], 400);
    }

    $hash = password_hash($data['password'], PASSWORD_BCRYPT);

    $stmt = $db->prepare('INSERT INTO users (nom, email, telephone, role, mot_de_passe) VALUES (:nom, :email, :tel, :role, :mdp)');
    $stmt->execute([
        ':nom' => htmlspecialchars($data['nom']),
        ':email' => $data['email'],
        ':tel' => $data['telephone'] ?? '',
        ':role' => $data['role'],
        ':mdp' => $hash,
    ]);

    jsonResponse(['success' => true, 'id' => $db->lastInsertId()], 201);

} elseif ($method === 'DELETE') {
    $data = getInput();
    if (empty($data['id'])) {
        jsonResponse(['error' => 'ID requis.'], 400);
    }

    // Empecher la suppression de soi-meme
    if ((int)$data['id'] === $_SESSION['user']['id']) {
        jsonResponse(['error' => 'Vous ne pouvez pas supprimer votre propre compte.'], 400);
    }

    $stmt = $db->prepare('DELETE FROM users WHERE id = :id');
    $stmt->execute([':id' => (int)$data['id']]);

    jsonResponse(['success' => true]);

} else {
    jsonResponse(['error' => 'Methode non autorisee.'], 405);
}

<?php
// ============================================================
// API Authentification - Login / Logout / Session
// ============================================================
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// POST /api/auth.php?action=login
if ($method === 'POST' && $action === 'login') {
    $data = getInput();

    if (empty($data['email']) || empty($data['password'])) {
        jsonResponse(['error' => 'Email et mot de passe requis.'], 400);
    }

    $db = getDB();
    $stmt = $db->prepare('SELECT * FROM users WHERE email = :email');
    $stmt->execute([':email' => $data['email']]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($data['password'], $user['mot_de_passe'])) {
        jsonResponse(['error' => 'Email ou mot de passe incorrect.'], 401);
    }

    // Creer la session
    $_SESSION['user'] = [
        'id' => $user['id'],
        'nom' => $user['nom'],
        'email' => $user['email'],
        'role' => $user['role'],
    ];

    jsonResponse([
        'success' => true,
        'user' => $_SESSION['user'],
    ]);
}

// POST /api/auth.php?action=logout
if ($method === 'POST' && $action === 'logout') {
    session_destroy();
    jsonResponse(['success' => true]);
}

// GET /api/auth.php?action=session
if ($method === 'GET' && $action === 'session') {
    if (!empty($_SESSION['user'])) {
        jsonResponse(['user' => $_SESSION['user']]);
    } else {
        jsonResponse(['user' => null]);
    }
}

jsonResponse(['error' => 'Action non reconnue.'], 400);

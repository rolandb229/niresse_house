<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'config.php';

try {
    // Nombre total de biens
    $stmt = $pdo->query('SELECT COUNT(*) as count FROM properties');
    $total_properties = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    // Nombre d'utilisateurs
    $stmt = $pdo->query('SELECT COUNT(*) as count FROM users');
    $total_users = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    // Nombre de réservations
    $stmt = $pdo->query('SELECT COUNT(*) as count FROM reservations');
    $total_reservations = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    // Nombre de messages
    $stmt = $pdo->query('SELECT COUNT(*) as count FROM contact_requests');
    $total_messages = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    // Répartition par type
    $stmt = $pdo->query('SELECT type, COUNT(*) as count FROM properties GROUP BY type');
    $by_type = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Répartition par ville
    $stmt = $pdo->query('SELECT ville, COUNT(*) as count FROM properties GROUP BY ville ORDER BY count DESC');
    $by_city = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Prix moyen
    $stmt = $pdo->query('SELECT AVG(prix) as avg_price FROM properties');
    $avg_price = $stmt->fetch(PDO::FETCH_ASSOC)['avg_price'];

    // Visites du mois (simulé)
    $stmt = $pdo->query('SELECT COUNT(*) as count FROM reservations WHERE MONTH(created_at) = MONTH(NOW())');
    $monthly_visits = $stmt->fetch(PDO::FETCH_ASSOC)['count'] * 5;

    echo json_encode([
        'success' => true,
        'data' => [
            'total_properties' => intval($total_properties),
            'total_users' => intval($total_users),
            'total_reservations' => intval($total_reservations),
            'total_messages' => intval($total_messages),
            'by_type' => $by_type,
            'by_city' => $by_city,
            'avg_price' => round($avg_price, 2),
            'monthly_visits' => intval($monthly_visits)
        ]
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>

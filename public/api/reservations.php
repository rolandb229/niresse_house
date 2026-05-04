<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

try {
    switch ($method) {
        case 'GET':
            if ($action === 'by_property') {
                $property_id = isset($_GET['property_id']) ? intval($_GET['property_id']) : 0;
                $stmt = $pdo->prepare('
                    SELECT r.*, p.titre, p.prix FROM reservations r 
                    JOIN properties p ON r.property_id = p.id 
                    WHERE r.property_id = ? 
                    ORDER BY r.check_in DESC
                ');
                $stmt->execute([$property_id]);
                echo json_encode(['success' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
            } else {
                $stmt = $pdo->prepare('
                    SELECT r.*, p.titre FROM reservations r 
                    JOIN properties p ON r.property_id = p.id 
                    ORDER BY r.check_in DESC LIMIT 100
                ');
                $stmt->execute();
                echo json_encode(['success' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
            }
            break;

        case 'POST':
            if ($action === 'add') {
                $data = json_decode(file_get_contents('php://input'), true);
                
                $stmt = $pdo->prepare('
                    INSERT INTO reservations (property_id, guest_name, guest_email, guest_phone, check_in, check_out, number_of_guests, total_price, status) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ');
                $stmt->execute([
                    $data['property_id'],
                    $data['guest_name'],
                    $data['guest_email'],
                    $data['guest_phone'],
                    $data['check_in'],
                    $data['check_out'],
                    $data['number_of_guests'],
                    $data['total_price'],
                    'pending'
                ]);
                
                echo json_encode(['success' => true, 'message' => 'Réservation créée']);
            }
            break;

        case 'PUT':
            if ($action === 'update_status') {
                $data = json_decode(file_get_contents('php://input'), true);
                
                $stmt = $pdo->prepare('UPDATE reservations SET status = ? WHERE id = ?');
                $stmt->execute([$data['status'], $data['id']]);
                
                echo json_encode(['success' => true, 'message' => 'Statut mis à jour']);
            }
            break;

        case 'DELETE':
            if ($action === 'cancel') {
                $reservation_id = isset($_GET['id']) ? intval($_GET['id']) : 0;
                
                $stmt = $pdo->prepare('UPDATE reservations SET status = ? WHERE id = ?');
                $stmt->execute(['cancelled', $reservation_id]);
                
                echo json_encode(['success' => true, 'message' => 'Réservation annulée']);
            }
            break;

        default:
            echo json_encode(['success' => false, 'error' => 'Méthode non supportée']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>

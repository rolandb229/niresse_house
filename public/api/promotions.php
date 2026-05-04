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
            if ($action === 'active') {
                $stmt = $pdo->prepare('
                    SELECT p.*, pr.titre, pr.ville FROM promotions p 
                    JOIN properties pr ON p.property_id = pr.id 
                    WHERE p.active = 1 AND p.end_date >= NOW() 
                    ORDER BY p.created_at DESC
                ');
                $stmt->execute();
                echo json_encode(['success' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
            } else {
                $stmt = $pdo->prepare('
                    SELECT p.*, pr.titre, pr.ville FROM promotions p 
                    JOIN properties pr ON p.property_id = pr.id 
                    ORDER BY p.created_at DESC LIMIT 100
                ');
                $stmt->execute();
                echo json_encode(['success' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
            }
            break;

        case 'POST':
            if ($action === 'add') {
                $data = json_decode(file_get_contents('php://input'), true);
                
                $stmt = $pdo->prepare('
                    INSERT INTO promotions (property_id, description, discount_percent, start_date, end_date, active) 
                    VALUES (?, ?, ?, ?, ?, ?)
                ');
                $stmt->execute([
                    $data['property_id'],
                    $data['description'],
                    $data['discount_percent'],
                    $data['start_date'],
                    $data['end_date'],
                    1
                ]);
                
                echo json_encode(['success' => true, 'message' => 'Promotion créée']);
            }
            break;

        case 'PUT':
            if ($action === 'update') {
                $data = json_decode(file_get_contents('php://input'), true);
                
                $stmt = $pdo->prepare('
                    UPDATE promotions SET description = ?, discount_percent = ?, start_date = ?, end_date = ?, active = ? 
                    WHERE id = ?
                ');
                $stmt->execute([
                    $data['description'],
                    $data['discount_percent'],
                    $data['start_date'],
                    $data['end_date'],
                    $data['active'],
                    $data['id']
                ]);
                
                echo json_encode(['success' => true, 'message' => 'Promotion mise à jour']);
            }
            break;

        case 'DELETE':
            if ($action === 'delete') {
                $promotion_id = isset($_GET['id']) ? intval($_GET['id']) : 0;
                
                $stmt = $pdo->prepare('DELETE FROM promotions WHERE id = ?');
                $stmt->execute([$promotion_id]);
                
                echo json_encode(['success' => true, 'message' => 'Promotion supprimée']);
            }
            break;

        default:
            echo json_encode(['success' => false, 'error' => 'Méthode non supportée']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>

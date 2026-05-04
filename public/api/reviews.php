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
            if ($action === 'get_by_property') {
                $property_id = isset($_GET['property_id']) ? intval($_GET['property_id']) : 0;
                $stmt = $pdo->prepare('SELECT * FROM reviews WHERE property_id = ? AND approved = 1 ORDER BY created_at DESC');
                $stmt->execute([$property_id]);
                echo json_encode(['success' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
            } else {
                $stmt = $pdo->query('SELECT r.*, p.titre FROM reviews r JOIN properties p ON r.property_id = p.id ORDER BY r.created_at DESC LIMIT 100');
                echo json_encode(['success' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
            }
            break;

        case 'POST':
            if ($action === 'add') {
                $data = json_decode(file_get_contents('php://input'), true);
                
                $stmt = $pdo->prepare('INSERT INTO reviews (property_id, author_name, author_email, rating, comment, approved) VALUES (?, ?, ?, ?, ?, ?)');
                $stmt->execute([
                    $data['property_id'],
                    $data['author_name'],
                    $data['author_email'],
                    $data['rating'],
                    $data['comment'],
                    0 // Non approuvé par défaut
                ]);
                
                echo json_encode(['success' => true, 'message' => 'Avis soumis avec succès']);
            }
            break;

        case 'PUT':
            if ($action === 'approve') {
                $data = json_decode(file_get_contents('php://input'), true);
                $review_id = $data['id'];
                
                $stmt = $pdo->prepare('UPDATE reviews SET approved = 1 WHERE id = ?');
                $stmt->execute([$review_id]);
                
                echo json_encode(['success' => true, 'message' => 'Avis approuvé']);
            }
            break;

        case 'DELETE':
            if ($action === 'delete') {
                $review_id = isset($_GET['id']) ? intval($_GET['id']) : 0;
                
                $stmt = $pdo->prepare('DELETE FROM reviews WHERE id = ?');
                $stmt->execute([$review_id]);
                
                echo json_encode(['success' => true, 'message' => 'Avis supprimé']);
            }
            break;

        default:
            echo json_encode(['success' => false, 'error' => 'Méthode non supportée']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>

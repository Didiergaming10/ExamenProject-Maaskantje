<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
$conn = include __DIR__ . '/connection.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Alleen POST toegestaan']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$id = intval($data['id'] ?? 0);

if (!$id) {
    http_response_code(400);
    echo json_encode(['error' => 'Geen geldig ID']);
    exit;
}

// Eerst gezinsleden en dieetwensen verwijderen (ivm foreign keys)
$conn->query("DELETE FROM gezinsleden WHERE klanten_id = $id");
$conn->query("DELETE FROM dieëtwensen WHERE klanten_id = $id");

// Daarna klant zelf verwijderen
if ($conn->query("DELETE FROM klanten WHERE id = $id")) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Verwijderen mislukt: ' . $conn->error]);
}
?>
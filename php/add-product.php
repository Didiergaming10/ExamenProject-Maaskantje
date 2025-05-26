<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

$conn = include __DIR__ . '/connection.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Ongeldige invoer']);
    exit;
}

$id = isset($data['id']) ? intval($data['id']) : null;
$naam = $conn->real_escape_string($data['naam']);
$categorie = $conn->real_escape_string($data['categorie']);
$ean = $conn->real_escape_string($data['ean']);
$voorraad = intval($data['voorraad']);

if ($id) {
    // Update bestaand product
    $sql = "UPDATE producten SET naam='$naam', categorie='$categorie', ean='$ean', op_voorraad=$voorraad WHERE id=$id";
} else {
    // Nieuw product toevoegen
    $sql = "INSERT INTO producten (naam, categorie, ean, op_voorraad) VALUES ('$naam', '$categorie', '$ean', $voorraad)";
}

if ($conn->query($sql)) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => $conn->error]);
}
?>
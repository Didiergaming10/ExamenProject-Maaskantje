<?php
// api/get-products.php

header('Content-Type: application/json');

// DB credentials
$host = 'localhost';
$user = 'YOUR_DB_USERNAME';
$pass = 'YOUR_DB_PASSWORD';
$dbname = 'YOUR_DB_NAME';

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

$sql = "SELECT id, naam, categorie, ean, voorraad, dieetwensen FROM producten";
$result = $conn->query($sql);

$products = [];
while ($row = $result->fetch_assoc()) {
    // Split dieetwensen into array
    $row['dieetwensen'] = array_map('trim', explode(',', $row['dieetwensen']));
    $products[] = $row;
}

echo json_encode($products);
?>

<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
$conn = include __DIR__ . '/connection.php';

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

// Fetch all klanten
$sql = "SELECT id, naam, postcode, email, telefoonnummer FROM klanten";
$result = $conn->query($sql);

$klanten = [];
while ($row = $result->fetch_assoc()) {
    $row['gezinsleden'] = [];
    $row['dieetwensen'] = [];
    $row['allergenen'] = ""; // Add allergenen if you want to support it later
    $klanten[$row['id']] = $row;
}

// Fetch all gezinsleden and group by klanten_id
$gezinsleden_sql = "SELECT klanten_id, geboortedatum FROM gezinsleden";
$gezinsleden_result = $conn->query($gezinsleden_sql);

if ($gezinsleden_result) {
    while ($gezinslid = $gezinsleden_result->fetch_assoc()) {
        $klant_id = $gezinslid['klanten_id'];
        if (isset($klanten[$klant_id])) {
            // Format as DD/MM/YYYY for the modal
            $date = date('d/m/Y', strtotime($gezinslid['geboortedatum']));
            $klanten[$klant_id]['gezinsleden'][] = $date;
        }
    }
}

// Fetch all dieetwensen and group by klanten_id
$dieetwensen_sql = "SELECT klanten_id, dieëtwensen FROM dieëtwensen";
$dieetwensen_result = $conn->query($dieetwensen_sql);

if ($dieetwensen_result) {
    while ($dieet = $dieetwensen_result->fetch_assoc()) {
        $klant_id = $dieet['klanten_id'];
        if (isset($klanten[$klant_id])) {
            $klanten[$klant_id]['dieetwensen'][] = $dieet['dieëtwensen'];
        }
    }
}

// Return as indexed array
echo json_encode(array_values($klanten));
?>
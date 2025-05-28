<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
$conn = include __DIR__ . '/connection.php';

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'DB connectie fout: ' . $conn->connect_error]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Alleen POST toegestaan']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$naam = $conn->real_escape_string($data['naam'] ?? '');
$postcode = $conn->real_escape_string($data['postcode'] ?? '');
$email = $conn->real_escape_string($data['email'] ?? '');
$telefoon = $conn->real_escape_string($data['telefoon'] ?? '');
$allergenen = $conn->real_escape_string($data['allergenen'] ?? '');
$gezinsleden = $data['gezinsleden'] ?? [];
$dieetwensen = $data['dieetwensen'] ?? [];

// Voeg allergenen toe als losse dieetwensen
if (!empty($allergenen)) {
    // splits op komma, trim spaties
    $allergieArray = array_map('trim', explode(',', $allergenen));
    foreach ($allergieArray as $allergeen) {
        if ($allergeen !== '') {
            $dieetwensen[] = $allergeen;
        }
    }
}

if (!$naam || !$postcode || !$email || !$telefoon) {
    http_response_code(400);
    echo json_encode(['error' => 'Vul alle verplichte velden in.']);
    exit;
}

// Insert into klanten
$sql = "INSERT INTO klanten (naam, postcode, email, telefoonnummer)
        VALUES ('$naam', '$postcode', '$email', '$telefoon')";
if ($conn->query($sql)) {
    $klant_id = $conn->insert_id;

    // Insert dieetwensen
    if (!empty($dieetwensen) && is_array($dieetwensen)) {
        $stmtDieet = $conn->prepare("INSERT INTO dieëtwensen (klanten_id, dieëtwensen) VALUES (?, ?)");
        foreach ($dieetwensen as $dieet) {
            $stmtDieet->bind_param('is', $klant_id, $dieet);
            if (!$stmtDieet->execute()) {
                echo json_encode(['error' => 'Dieetwens fout: ' . $stmtDieet->error]);
                exit;
            }
        }
        $stmtDieet->close();
    }

    // Insert gezinsleden
    if (!empty($gezinsleden) && is_array($gezinsleden)) {
        $stmtGezin = $conn->prepare("INSERT INTO gezinsleden (geboortedatum, klanten_id) VALUES (?, ?)");
        foreach ($gezinsleden as $geboortedatum) {
            $date = date('Y-m-d', strtotime($geboortedatum));
            $stmtGezin->bind_param('si', $date, $klant_id);
            if (!$stmtGezin->execute()) {
                echo json_encode(['error' => 'Gezinslid fout: ' . $stmtGezin->error]);
                exit;
            }
        }
        $stmtGezin->close();
    }

    echo json_encode(['success' => true, 'id' => $klant_id]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Opslaan mislukt: ' . $conn->error]);
}
?>
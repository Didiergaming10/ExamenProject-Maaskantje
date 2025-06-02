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

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? $_POST['action'] ?? null;

// GET: alle klanten ophalen
if ($method === 'GET' && !$action) {
    // Fetch all klanten
    $sql = "SELECT id, naam, postcode, email, telefoonnummer FROM klanten";
    $result = $conn->query($sql);

    $klanten = [];
    while ($row = $result->fetch_assoc()) {
        $row['gezinsleden'] = [];
        $row['dieetwensen'] = [];
        $row['allergenen'] = [];
        $klanten[$row['id']] = $row;
    }

    // Fetch all gezinsleden and group by klanten_id
    $gezinsleden_sql = "SELECT klanten_id, geboortedatum FROM gezinsleden";
    $gezinsleden_result = $conn->query($gezinsleden_sql);

    if ($gezinsleden_result) {
        while ($gezinslid = $gezinsleden_result->fetch_assoc()) {
            $klant_id = $gezinslid['klanten_id'];
            if (isset($klanten[$klant_id])) {
                $date = date('d/m/Y', strtotime($gezinslid['geboortedatum']));
                $klanten[$klant_id]['gezinsleden'][] = $date;
            }
        }
    }

    // Fetch all dieetwensen and group by klanten_id
    $dieetwensen_sql = "SELECT klanten_id, dieëtwensen FROM dieëtwensen";
    $dieetwensen_result = $conn->query($dieetwensen_sql);

    $allergenenLijst = ['lactose', 'gluten', "pinda's", 'noten', 'schaaldieren', 'ei', 'soja', 'vis', 'mosterd', 'selderij', 'sesam', 'sulfiet', 'weekdieren'];
    if ($dieetwensen_result) {
        while ($dieet = $dieetwensen_result->fetch_assoc()) {
            $klant_id = $dieet['klanten_id'];
            if (isset($klanten[$klant_id])) {
                $value = $dieet['dieëtwensen'];
                if (in_array(strtolower($value), $allergenenLijst)) {
                    $klanten[$klant_id]['allergenen'][] = $value;
                } else {
                    $klanten[$klant_id]['dieetwensen'][] = $value;
                }
            }
        }
    }

    echo json_encode(array_values($klanten));
    exit;
}

// POST: klant opslaan
if ($method === 'POST' && ($action === 'save' || !$action)) {
    $data = json_decode(file_get_contents('php://input'), true);

    $klant_id = isset($data['id']) && $data['id'] ? intval($data['id']) : null;
    $naam = $conn->real_escape_string($data['naam'] ?? '');
    $postcode = $conn->real_escape_string($data['postcode'] ?? '');
    $email = $conn->real_escape_string($data['email'] ?? '');
    $telefoon = $conn->real_escape_string($data['telefoon'] ?? '');
    $allergenen = $conn->real_escape_string($data['allergenen'] ?? '');
    $gezinsleden = $data['gezinsleden'] ?? [];
    $dieetwensen = $data['dieetwensen'] ?? [];

    // Voeg allergenen toe als losse dieetwensen
    if (!empty($allergenen)) {
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

    if ($klant_id) {
        // UPDATE bestaande klant
        $sql = "UPDATE klanten SET naam='$naam', postcode='$postcode', email='$email', telefoonnummer='$telefoon' WHERE id=$klant_id";
        if ($conn->query($sql)) {
            // Verwijder oude dieetwensen en gezinsleden
            $conn->query("DELETE FROM dieëtwensen WHERE klanten_id = $klant_id");
            $conn->query("DELETE FROM gezinsleden WHERE klanten_id = $klant_id");
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Bijwerken mislukt: ' . $conn->error]);
            exit;
        }
    } else {
        // INSERT nieuwe klant
        $sql = "INSERT INTO klanten (naam, postcode, email, telefoonnummer)
                VALUES ('$naam', '$postcode', '$email', '$telefoon')";
        if ($conn->query($sql)) {
            $klant_id = $conn->insert_id;
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Opslaan mislukt: ' . $conn->error]);
            exit;
        }
    }

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
    exit;
}

// DELETE: klant verwijderen
if (($method === 'POST' && $action === 'delete') || $method === 'DELETE') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = intval($data['id'] ?? 0);

    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Geen geldig ID']);
        exit;
    }

    $conn->query("DELETE FROM gezinsleden WHERE klanten_id = $id");
    $conn->query("DELETE FROM dieëtwensen WHERE klanten_id = $id");

    if ($conn->query("DELETE FROM klanten WHERE id = $id")) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Verwijderen mislukt: ' . $conn->error]);
    }
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Ongeldige actie of methode.']);
exit;
?>
<?php
session_start();
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
$conn = include __DIR__ . '/connection.php';


$role = $_SESSION['role'] ?? null;

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit;
}

if (isset($_GET['categories'])) {
    // Haal alle categorieën op
    $sql = "SELECT naam FROM categorieen ORDER BY naam";
    $result = $conn->query($sql);
    $categories = [];
    while ($row = $result->fetch_assoc()) {
        $categories[] = $row['naam'];
    }
    echo json_encode($categories);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['addCategory'])) {
    $data = json_decode(file_get_contents('php://input'), true);
    $naam = $conn->real_escape_string(strtolower($data['naam'] ?? ''));    if (!$naam) {
        http_response_code(400);
        echo json_encode(['error' => 'Geen categorienaam opgegeven']);
        exit;
    }
    $sql = "INSERT IGNORE INTO categorieen (naam) VALUES ('$naam')";
    if ($conn->query($sql)) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => $conn->error]);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['editCategory'])) {
    // Alleen directie mag dit
    if ($role !== 'directie') {
        http_response_code(403);
        echo json_encode(['error' => 'Geen toestemming om te bewerken']);
        exit;
    }
    $data = json_decode(file_get_contents('php://input'), true);
    $oldNaam = $conn->real_escape_string(strtolower($data['oldNaam'] ?? ''));
    $newNaam = $conn->real_escape_string(strtolower($data['newNaam'] ?? ''));
    if (!$oldNaam || !$newNaam) {
        http_response_code(400);
        echo json_encode(['error' => 'Ongeldige categorienaam']);
        exit;
    }
    // Update categorie naam
    $sql = "UPDATE categorieen SET naam='$newNaam' WHERE naam='$oldNaam'";
    if ($conn->query($sql)) {
        // Update ook producten die deze categorie hadden
        $conn->query("UPDATE producten SET categorie='$newNaam' WHERE categorie='$oldNaam'");
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => $conn->error]);
    }
    exit;
}

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        // Get all active products
        $sql = "SELECT id, naam, categorie, ean, op_voorraad AS voorraad FROM producten WHERE actief = 1";
        $result = $conn->query($sql);
        $products = [];
        while ($row = $result->fetch_assoc()) {
            $products[] = $row;
        }
        echo json_encode($products);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);

        // Handle delete action
        if (isset($_GET['action']) && $_GET['action'] === 'delete') {
            if ($role !== 'directie') {
                http_response_code(403);
                echo json_encode(['error' => 'Geen toestemming om te verwijderen']);
                exit;
            }
            if (!isset($data['ids']) || !is_array($data['ids'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Geen IDs opgegeven']);
                exit;
            }
            $ids = array_map('intval', $data['ids']);
            $idList = implode(',', $ids);
            // Soft delete: zet actief op 0
            $sql = "UPDATE producten SET actief = 0 WHERE id IN ($idList)";
            if ($conn->query($sql)) {
                echo json_encode(['success' => true]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => $conn->error]);
            }
            break;
        }

        // Add or update product
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
            $sql = "UPDATE producten SET naam='$naam', categorie='$categorie', ean='$ean', op_voorraad=$voorraad WHERE id=$id";
        } else {
            $sql = "INSERT INTO producten (naam, categorie, ean, op_voorraad) VALUES ('$naam', '$categorie', '$ean', $voorraad)";
        }

        if ($conn->query($sql)) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => $conn->error]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Methode niet toegestaan']);
        break;
}
?>
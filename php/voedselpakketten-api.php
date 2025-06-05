<?php
header('Content-Type: application/json');
$conn = include __DIR__ . '/connection.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

if ($method === 'GET' && $action === 'list') {
    // Get all pakketten for active klanten only
    $sql = "SELECT v.id, v.datum, v.klanten_id, v.datum_uitgifte, k.naam as gezinNaam
            FROM voedselpakket v
            LEFT JOIN klanten k ON v.klanten_id = k.id
            WHERE k.actief = 1";
    $result = $conn->query($sql);
    $pakketten = [];
    while ($row = $result->fetch_assoc()) {
        $row['items'] = [];
        $pakketten[] = $row;
    }
    echo json_encode($pakketten);
    exit;
}

if ($method === 'GET' && $action === 'items') {
    // Get items for a pakket
    $pakket_id = intval($_GET['pakket_id'] ?? 0);
    $sql = "SELECT fpp.products_id AS product_id, p.naam as productNaam, p.categorie, fpp.aantal
            FROM food_packages_has_products fpp
            JOIN producten p ON fpp.products_id = p.id
            WHERE fpp.food_packages_id = $pakket_id";
    $result = $conn->query($sql);
    $items = [];
    while ($row = $result->fetch_assoc()) {
        $items[] = $row;
    }
    echo json_encode($items);
    exit;
}

if ($method === 'GET' && $action === 'gezinnen') {
    // Get all active families
    $result = $conn->query("SELECT id, naam FROM klanten WHERE actief = 1");
    $gezinnen = [];
    while ($row = $result->fetch_assoc()) {
        $gezinnen[] = $row;
    }
    echo json_encode($gezinnen);
    exit;
}

if ($method === 'GET' && $action === 'producten') {
    // Search products by name or EAN
    $q = $conn->real_escape_string($_GET['q'] ?? '');
    $result = $conn->query("SELECT id, naam, ean, categorie, op_voorraad AS voorraad FROM producten WHERE naam LIKE '%$q%' OR ean LIKE '%$q%' LIMIT 20");
    $producten = [];
    while ($row = $result->fetch_assoc()) {
        $producten[] = $row;
    }
    echo json_encode($producten);
    exit;
}

if ($method === 'POST' && $action === 'add') {
    // Add a new pakket
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data || !isset($data['klanten_id']) || !isset($data['datum']) || !isset($data['items'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Ongeldige invoer']);
        exit;
    }
    $stmt = $conn->prepare("INSERT INTO voedselpakket (datum, klanten_id) VALUES (?, ?)");
    $stmt->bind_param("si", $data['datum'], $data['klanten_id']);
    if (!$stmt->execute()) {
        http_response_code(500);
        echo json_encode(['error' => $conn->error]);
        exit;
    }
    $pakket_id = $conn->insert_id;
    foreach ($data['items'] as $item) {
        $stmt2 = $conn->prepare("INSERT INTO food_packages_has_products (food_packages_id, products_id, aantal) VALUES (?, ?, ?)");
        $stmt2->bind_param("iii", $pakket_id, $item['product_id'], $item['aantal']);
        $stmt2->execute();

        // Update voorraad for this product
        $stmt3 = $conn->prepare("UPDATE producten SET op_voorraad = op_voorraad - ? WHERE id = ?");
        $stmt3->bind_param("ii", $item['aantal'], $item['product_id']);
        $stmt3->execute();
    }
    echo json_encode(['success' => true]);
    exit;
}

if ($method === 'GET' && $action === 'dieetwensen') {
    $klanten_id = intval($_GET['gezin_id'] ?? $_GET['klanten_id'] ?? 0);
    $result = $conn->query("SELECT dieëtwensen FROM dieëtwensen WHERE klanten_id = $klanten_id");
    $dieetwensen = [];
    while ($row = $result->fetch_assoc()) {
        if (!empty($row['dieëtwensen'])) {
            $dieetwensen[] = $row['dieëtwensen'];
        }
    }
    echo json_encode(['dieetwensen' => $dieetwensen]);
    exit;
}

if ($method === 'POST' && $action === 'opgehaald') {
    $input = json_decode(file_get_contents('php://input'), true);
    $pakket_id = intval($input['pakket_id']);
    $datum_uitgifte = $input['datum_uitgifte'];
    $stmt = $conn->prepare("UPDATE voedselpakket SET datum_uitgifte = ? WHERE id = ?");
    if ($stmt->execute([$datum_uitgifte, $pakket_id])) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Database update failed']);
    }
    exit;
}

echo json_encode(['error' => 'Ongeldige actie']);
?>
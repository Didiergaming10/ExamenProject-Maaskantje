<?php
<?php
header('Content-Type: application/json');
$conn = include __DIR__ . '/connection.php';
$klanten_id = intval($_GET['klanten_id'] ?? 0);

$result = $conn->query("SELECT dieëtwensen FROM dieëtwensen WHERE klanten_id = $klanten_id");
$dieetwensen = [];
while ($row = $result->fetch_assoc()) {
    if (!empty($row['dieëtwensen'])) {
        $dieetwensen[] = $row['dieëtwensen'];
    }
}
echo json_encode(['dieetwensen' => $dieetwensen]);
?>
<?php
header('Content-Type: application/json');
$conn = include __DIR__ . '/connection.php';

try {
    $sql = "
        SELECT 
            k.id,
            k.naam,
            k.postcode,
            COUNT(CASE WHEN gl.geboortedatum IS NOT NULL AND gl.geboortedatum <> '' THEN 1 END) as aantal_leden
        FROM klanten k
        LEFT JOIN gezinsleden gl ON gl.klanten_id = k.id
        GROUP BY k.id, k.naam, k.postcode
        ORDER BY k.naam
    ";
    $result = $conn->query($sql);
    $gezinnen = [];
    while ($row = $result->fetch_assoc()) {
        $gezinnen[] = $row;
    }
    echo json_encode([
        'success' => true,
        'data' => $gezinnen
    ]);
} catch(Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
}
?>
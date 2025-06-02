<?php
header('Content-Type: application/json');
include 'connection.php';

$type = $_GET['type'] ?? '';
$maand = isset($_GET['maand']) && $_GET['maand'] !== '' ? intval($_GET['maand']) : null;
$jaar = isset($_GET['jaar']) && $_GET['jaar'] !== '' ? intval($_GET['jaar']) : null;

if ($type === 'categorie') {
    // Bouw WHERE dynamisch op basis van maand/jaar
    $where = [];
    if ($maand) $where[] = "MONTH(lv.datum) = $maand";
    if ($jaar) $where[] = "YEAR(lv.datum) = $jaar";
    $whereSql = $where ? "WHERE " . implode(' AND ', $where) : "";

    $sql = "SELECT p.categorie AS categorie, SUM(phl.aantal) AS aantal
            FROM producten_has_leveringen phl
            JOIN producten p ON phl.producten_id = p.id
            JOIN leveringen lv ON phl.leveringen_leveringenid = lv.leveringenid
            $whereSql
            GROUP BY p.categorie
            ORDER BY p.categorie";
    $res = $conn->query($sql);
    $data = [];
    while ($row = $res->fetch_assoc()) $data[] = $row;
    echo json_encode($data);
    exit;
}

if ($type === 'postcode') {
    // Bouw WHERE dynamisch op basis van maand/jaar
    $where = [];
    if ($maand) $where[] = "MONTH(lv.datum) = $maand";
    if ($jaar) $where[] = "YEAR(lv.datum) = $jaar";
    $whereSql = $where ? "WHERE " . implode(' AND ', $where) : "";

    $sql = "SELECT l.postcode, SUM(phl.aantal) AS aantal
            FROM producten_has_leveringen phl
            JOIN leveringen lv ON phl.leveringen_leveringenid = lv.leveringenid
            JOIN leveranciers l ON lv.leveranciers_id = l.id
            $whereSql
            GROUP BY l.postcode
            ORDER BY l.postcode";
    $res = $conn->query($sql);
    $data = [];
    while ($row = $res->fetch_assoc()) $data[] = $row;
    echo json_encode($data);
    exit;
}

echo json_encode([]);
<?php
session_start();
include 'connection.php';

header('Content-Type: application/json');

if (!isset($_SESSION['valid']) || $_SESSION['valid'] !== true) {
    http_response_code(401);
    echo json_encode(['error' => 'Niet ingelogd']);
    exit;
}

$result = $conn->query("
    SELECT 
        g.id, g.voornaam, g.achternaam, g.email, g.telefoon, g.status,
        r.directie, r.magazijnmedewerker, r.vrijwilliger
    FROM gebruikers g
    LEFT JOIN rollen r ON g.rollen_idrollen = r.idrollen
");

$medewerkers = [];
while ($row = $result->fetch_assoc()) {
    // Rol bepalen
    $rol = 'onbekend';
    if ($row['directie'] == 1) $rol = 'admin';
    elseif ($row['magazijnmedewerker'] == 1) $rol = 'magazijn';
    elseif ($row['vrijwilliger'] == 1) $rol = 'vrijwilliger';

    $medewerkers[] = [
        'id' => $row['id'],
        'naam' => trim(($row['voornaam'] ?? '') . ' ' . ($row['achternaam'] ?? '')),
        'email' => $row['email'],
        'telefoon' => $row['telefoon'],
        'rol' => $rol,
        'status' => $row['status'],
        'voornaam' => $row['voornaam'],
        'achternaam' => $row['achternaam'],
    ];
}
echo json_encode($medewerkers);
<?php
session_start();
include 'connection.php';
include '../auth.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Alleen POST requests toegestaan.']);
    exit;
}

$action = $_POST['action'] ?? '';

if ($action === 'create') {
    // Medewerker aanmaken
    $voornaam = trim($_POST['voornaam'] ?? '');
    $achternaam = trim($_POST['achternaam'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $telefoon = $_POST['telefoon'] ?? '';
    $password = $_POST['password'] ?? '';
    $role = $_POST['role'] ?? '';
    $status = $_POST['status'] ?? 'actief';

    // Validatie
    if (!$voornaam || !$achternaam || !$email || !$password || !$role) {
        echo json_encode(['error' => 'Vul alle verplichte velden in.']);
        exit;
    }

    // Zoek juiste rollen_idrollen
    $kolom = $role === 'admin' ? 'directie' : ($role === 'magazijn' ? 'magazijnmedewerker' : ($role === 'vrijwilliger' ? 'vrijwilliger' : ''));
    if (!$kolom) {
        echo json_encode(['error' => 'Ongeldige rol.']);
        exit;
    }
    $result = $conn->query("SELECT idrollen FROM rollen WHERE `$kolom` = 1 LIMIT 1");
    if (!$result || $result->num_rows === 0) {
        echo json_encode(['error' => 'Rol niet gevonden.']);
        exit;
    }
    $rollen_idrollen = $result->fetch_assoc()['idrollen'];

    // Check of email al bestaat
    $checkStmt = $conn->prepare("SELECT id FROM gebruikers WHERE email = ?");
    $checkStmt->bind_param("s", $email);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();
    if ($checkResult->num_rows > 0) {
        echo json_encode(['error' => 'Email is al in gebruik.']);
        exit;
    }

    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("INSERT INTO gebruikers (voornaam, achternaam, email, telefoon, wachtwoord, rollen_idrollen, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssis", $voornaam, $achternaam, $email, $telefoon, $hashed_password, $rollen_idrollen, $status);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => $stmt->error]);
    }
    exit;
}

if ($action === 'edit') {
    // Medewerker bewerken
    $id = (int)($_POST['id'] ?? 0);
    $voornaam = trim($_POST['voornaam'] ?? '');
    $achternaam = trim($_POST['achternaam'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $telefoon = $_POST['telefoon'] ?? '';
    $role = $_POST['role'] ?? '';
    $status = $_POST['status'] ?? 'actief';

    if (!$id || !$voornaam || !$achternaam || !$email || !$role) {
        echo json_encode(['error' => 'Vul alle verplichte velden in.']);
        exit;
    }

    $kolom = $role === 'admin' ? 'directie' : ($role === 'magazijn' ? 'magazijnmedewerker' : ($role === 'vrijwilliger' ? 'vrijwilliger' : ''));
    if (!$kolom) {
        echo json_encode(['error' => 'Ongeldige rol.']);
        exit;
    }
    $result = $conn->query("SELECT idrollen FROM rollen WHERE `$kolom` = 1 LIMIT 1");
    if (!$result || $result->num_rows === 0) {
        echo json_encode(['error' => 'Rol niet gevonden.']);
        exit;
    }
    $rollen_idrollen = $result->fetch_assoc()['idrollen'];

    $stmt = $conn->prepare("UPDATE gebruikers SET voornaam=?, achternaam=?, email=?, telefoon=?, rollen_idrollen=?, status=? WHERE id=?");
    $stmt->bind_param("ssssisi", $voornaam, $achternaam, $email, $telefoon, $rollen_idrollen, $status, $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => $stmt->error]);
    }
    exit;
}

if ($action === 'delete') {
    // Medewerker verwijderen
    $id = (int)($_POST['id'] ?? 0);
    if (!$id) {
        echo json_encode(['error' => 'Geen ID opgegeven.']);
        exit;
    }
    $stmt = $conn->prepare("DELETE FROM gebruikers WHERE id = ?");
    $stmt->bind_param("i", $id);
    if ($stmt->execute()) {
        // Log de gebruiker uit als hij zichzelf verwijdert
        if (isset($_SESSION['user_id']) && $_SESSION['user_id'] == $id) {
            session_unset();
            session_destroy();
        }
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => $stmt->error]);
    }
    exit;
}

echo json_encode(['error' => 'Ongeldige actie.']);
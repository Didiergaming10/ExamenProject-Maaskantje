<?php
session_start();
include 'php/connection.php';
include 'auth.php';


$conn = new mysqli("mysql", "root", "password", "Eindproject");
if ($conn->connect_error) die("Verbinding mislukt: " . $conn->connect_error);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'];
    $voornaam = $_POST['voornaam'];
    $achternaam = $_POST['achternaam'];
    $email = $_POST['email'];
    $telefoon = $_POST['telefoon'];
    $status = $_POST['status'];
    $rol = $_POST['rol'];

    // Telefoon max 10 tekens
    if (strlen($telefoon) > 10) {
        echo "Telefoonnummer mag maximaal 10 tekens bevatten.";
        exit();
    }

    // Zoek juiste rollen_idrollen op basis van gekozen rol
    $kolom = '';
    if ($rol === 'Admin') {
        $kolom = 'directie';
    } elseif ($rol === 'magazijn') {
        $kolom = 'magazijnmedewerker';
    } elseif ($rol === 'vrijwilliger') {
        $kolom = 'vrijwilliger';
    }

    $rollen_idrollen = null;
    if ($kolom) {
        $res = $conn->query("SELECT idrollen FROM rollen WHERE `$kolom` = 1 LIMIT 1");
        if ($res && $res->num_rows > 0) {
            $rollen_idrollen = $res->fetch_assoc()['idrollen'];
        }
    }

    if ($rollen_idrollen !== null) {
        $stmt = $conn->prepare("UPDATE gebruikers SET voornaam=?, achternaam=?, email=?, telefoon=?, rollen_idrollen=?, status=? WHERE id=?");
$stmt->bind_param("ssssisi", $voornaam, $achternaam, $email, $telefoon, $rollen_idrollen, $status, $id);

        if ($stmt->execute()) {
            header("Location: medewerkers.php");
            exit();
        } else {
            echo "Fout bij bijwerken: " . $stmt->error;
        }

        $stmt->close();
    } else {
        echo "Ongeldige rol.";
        exit();
    }
} else {
    if (!isset($_GET['id'])) {
        echo "Geen ID meegegeven.";
        exit;
    }

    $id = (int) $_GET['id'];
    $result = $conn->query("
        SELECT 
            g.*, 
            r.directie, r.magazijnmedewerker, r.vrijwilliger 
        FROM gebruikers g 
        LEFT JOIN rollen r ON g.rollen_idrollen = r.idrollen 
        WHERE g.id = $id
    ");

    if ($result->num_rows !== 1) {
        echo "Medewerker niet gevonden.";
        exit;
    }

    $row = $result->fetch_assoc();

    // Bepaal leesbare rol op basis van 1 in kolommen
    if ($row['directie'] == 1) {
        $huidigeRol = 'Admin';
    } elseif ($row['magazijnmedewerker'] == 1) {
        $huidigeRol = 'magazijn';
    } elseif ($row['vrijwilliger'] == 1) {
        $huidigeRol = 'vrijwilliger';
    } else {
        $huidigeRol = '';
    }
}
?>

<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <title>Bewerk Medewerker</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100 min-h-screen">
<?php include 'header.php'; ?>
<div class="container mx-auto px-4 py-8">
    <div class="max-w-md mx-auto bg-white p-6 rounded shadow">
        <h2 class="text-xl font-bold mb-4">Bewerk Medewerker</h2>
        <form method="POST" action="edit-medewerker.php">
            <input type="hidden" name="id" value="<?= htmlspecialchars($row['id']) ?>">

            <label class="block mb-2 text-sm font-medium">Voornaam</label>
            <input type="text" name="voornaam" value="<?= htmlspecialchars($row['voornaam']) ?>" required class="w-full mb-4 p-2 border rounded">

            <label class="block mb-2 text-sm font-medium">Achternaam</label>
            <input type="text" name="achternaam" value="<?= htmlspecialchars($row['achternaam']) ?>" class="w-full mb-4 p-2 border rounded">

            <label class="block mb-2 text-sm font-medium">Email</label>
            <input type="email" name="email" value="<?= htmlspecialchars($row['email']) ?>" required class="w-full mb-4 p-2 border rounded">

            <label class="block mb-2 text-sm font-medium">Telefoon</label>
            <input type="text" name="telefoon" value="<?= htmlspecialchars($row['telefoon']) ?>" maxlength="10" class="w-full mb-4 p-2 border rounded">

            <label class="block mb-2 text-sm font-medium">Rol</label>
            <select name="rol" class="w-full mb-4 p-2 border rounded">
                <option value="vrijwilliger" <?= $huidigeRol === 'vrijwilliger' ? 'selected' : '' ?>>Vrijwilliger</option>
                <option value="magazijn" <?= $huidigeRol === 'magazijn' ? 'selected' : '' ?>>Magazijn</option>
                <option value="Admin" <?= $huidigeRol === 'Admin' ? 'selected' : '' ?>>Admin</option>
            </select>

            <label class="block mb-2 text-sm font-medium">Status</label>
            <select name="status" class="w-full mb-4 p-2 border rounded">
                <option value="actief" <?= $row['status'] === 'actief' ? 'selected' : '' ?>>Actief</option>
                <option value="geblokkeerd" <?= $row['status'] === 'geblokkeerd' ? 'selected' : '' ?>>Geblokkeerd</option>
            </select>

            <button type="submit" class="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">Opslaan</button>
        </form>
    </div>
</div>
</body>
</html>

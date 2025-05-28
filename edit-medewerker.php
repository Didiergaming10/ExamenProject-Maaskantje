<?php
session_start();
include 'php/connection.php';
include 'auth.php';


$conn = new mysqli("mysql", "root", "password", "Eindproject");
if ($conn->connect_error) die("Verbinding mislukt: " . $conn->connect_error);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Gegevens updaten
    $id = $_POST['id'];
    $voornaam = $_POST['voornaam'];
    $achternaam = $_POST['achternaam'];
    $email = $_POST['email'];
    $telefoon = $_POST['telefoon'];
    $rol = $_POST['rol'];
    $status = $_POST['status'];

    $stmt = $conn->prepare("UPDATE gebruikers SET voornaam=?, achternaam=?, email=?, telefoon=?, rol=?, status=? WHERE id=?");
    $stmt->bind_param("ssssssi", $voornaam, $achternaam, $email, $telefoon, $rol, $status, $id);
    
    if ($stmt->execute()) {
        header("Location: medewerkers.php");
        exit();
    } else {
        echo "Fout bij bijwerken: " . $stmt->error;
    }

    $stmt->close();
} else {
    // Formulier tonen met bestaande data
    if (!isset($_GET['id'])) {
        echo "Geen ID meegegeven.";
        exit;
    }

    $id = (int) $_GET['id'];
    $result = $conn->query("SELECT * FROM gebruikers WHERE id = $id");
    if ($result->num_rows !== 1) {
        echo "Medewerker niet gevonden.";
        exit;
    }

    $row = $result->fetch_assoc();
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
            <input type="text" name="telefoon" value="<?= htmlspecialchars($row['telefoon']) ?>" class="w-full mb-4 p-2 border rounded">

            <label class="block mb-2 text-sm font-medium">Rol</label>
            <select name="rol" class="w-full mb-4 p-2 border rounded">
                <option value="vrijwilliger" <?= $row['rol'] === 'vrijwilliger' ? 'selected' : '' ?>>Vrijwilliger</option>
                <option value="magazijn" <?= $row['rol'] === 'magazijn' ? 'selected' : '' ?>>Magazijn</option>
                <option value="Admin" <?= $row['rol'] === 'Admin' ? 'selected' : '' ?>>Admin</option>
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

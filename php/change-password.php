<?php
session_start();
include 'connection.php'; // Remove 'php/' prefix
include '../auth.php';    // Go up one level to include auth.php

if (!isset($_SESSION['user_id'])) {
    header("Location: ../login.php");
    exit();
}

$userId = $_SESSION['user_id'];
$message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $old = $_POST['old_password'] ?? '';
    $new = $_POST['new_password'] ?? '';
    $repeat = $_POST['repeat_password'] ?? '';

    if ($new !== $repeat) {
        $message = "Nieuwe wachtwoorden komen niet overeen.";
    } else {
        $stmt = $conn->prepare("SELECT wachtwoord FROM gebruikers WHERE id=?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $stmt->bind_result($hash);
        $stmt->fetch();
        $stmt->close();

        if (!password_verify($old, $hash)) {
            $message = "Oud wachtwoord is onjuist.";
        } else {
            $newHash = password_hash($new, PASSWORD_DEFAULT);
            $stmt = $conn->prepare("UPDATE gebruikers SET wachtwoord=? WHERE id=?");
            $stmt->bind_param("si", $newHash, $userId);
            if ($stmt->execute()) {
                $message = "Wachtwoord succesvol gewijzigd.";
            } else {
                $message = "Fout bij wijzigen wachtwoord.";
            }
            $stmt->close();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <title>Wachtwoord wijzigen</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100 min-h-screen">
<?php include '../header.php'; ?> <!-- Go up one level to include header.php -->
<div class="container mx-auto px-4 py-8">
    <div class="max-w-md mx-auto bg-white p-6 rounded shadow">
        <h2 class="text-xl font-bold mb-4">Wachtwoord wijzigen</h2>
        <?php if ($message): ?>
            <div class="mb-4 text-red-600"><?= htmlspecialchars($message) ?></div>
        <?php endif; ?>
        <form method="POST">
            <label class="block mb-2 text-sm font-medium">Oud wachtwoord</label>
            <input type="password" name="old_password" required class="w-full mb-4 p-2 border rounded">

            <label class="block mb-2 text-sm font-medium">Nieuw wachtwoord</label>
            <input type="password" name="new_password" required class="w-full mb-4 p-2 border rounded">

            <label class="block mb-2 text-sm font-medium">Herhaal nieuw wachtwoord</label>
            <input type="password" name="repeat_password" required class="w-full mb-4 p-2 border rounded">

            <button type="submit" class="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">Wijzigen</button>
        </form>
    </div>
</div>
</body>
</html>
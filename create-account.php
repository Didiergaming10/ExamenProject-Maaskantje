<?php
session_start();
include 'php/connection.php';
include 'auth.php';

$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $voornaam = trim($_POST['firstname'] ?? '');
    $achternaam = trim($_POST['lastname'] ?? '');
    $naam = $voornaam . ' ' . $achternaam;
    $email = trim($_POST['email'] ?? '');
    $telefoon = $_POST['telefoon'] ?? '';
    $password = $_POST['password'] ?? '';
    $confirm_password = $_POST['confirm-password'] ?? '';
    $role = $_POST['role'] ?? 'admin';
    

    if (empty($voornaam) || empty($achternaam) || empty($email) || empty($password) || empty($confirm_password)) {
        $errors[] = "Vul alle velden in.";
    }

    if ($password !== $confirm_password) {
        $errors[] = "Wachtwoorden komen niet overeen.";
    }

    $roleMap = [
        'admin' => 1,
        'magazijn' => 2,
        'vrijwilliger' => 3
    ];

    if (!isset($roleMap[$role])) {
        $errors[] = "Ongeldige rol geselecteerd.";
    }

    if (empty($errors)) {
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        $rollen_idrollen = $roleMap[$role];

        $checkStmt = $conn->prepare("SELECT id FROM gebruikers WHERE email = ?");
        $checkStmt->bind_param("s", $email);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();

        if ($checkResult->num_rows > 0) {
            $errors[] = "Email is al in gebruik.";
        } else {
            $stmt = $conn->prepare("INSERT INTO gebruikers (voornaam, achternaam, email, telefoon, wachtwoord, rollen_idrollen) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("sssssi", $voornaam, $achternaam, $email, $telefoon, $hashed_password, $rollen_idrollen);

            if ($stmt->execute()) {
                $_SESSION['success'] = "Account succesvol aangemaakt. Je kunt nu inloggen.";
                exit();
            } else {
                $errors[] = "Er is een fout opgetreden bij het aanmaken van het account.";
            }
            $stmt->close();
        }
        $checkStmt->close();
    }
}
?>

<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Maak Account - Voedselbank Maaskantje</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/styles.css">
</head>
<body class="bg-gray-100 min-h-screen">
    <?php include 'header.php'; ?>
    <div class="container mx-auto px-4 py-8">
        <div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
            <h1 class="text-2xl font-bold text-center mb-6">Voedselbank Maaskantje</h1>
            <h2 class="text-xl font-semibold mb-4">Maak account</h2>

            <?php if (!empty($errors)): ?>
                <div class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    <ul class="list-disc pl-5">
                        <?php foreach ($errors as $error): ?>
                            <li><?= htmlspecialchars($error) ?></li>
                        <?php endforeach; ?>
                    </ul>
                </div>
            <?php endif; ?>

            <form id="create-account-form" method="POST" action="create-account.php" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label for="firstname" class="block text-sm font-medium text-gray-700">Voornaam</label>
                        <input type="text" id="firstname" name="firstname" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                    </div>
                    <div>
                        <label for="lastname" class="block text-sm font-medium text-gray-700">Achternaam</label>
                        <input type="text" id="lastname" name="lastname" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                    </div>
                </div>
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" name="email" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                </div>

                <div>
    <label for="telefoon" class="block text-sm font-medium text-gray-700">Telefoon</label>
    <input type="text" id="telefoon" name="telefoon" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
</div>

                
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">Wachtwoord</label>
                    <input type="password" id="password" name="password" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                </div>
                <div>
                    <label for="confirm-password" class="block text-sm font-medium text-gray-700">Bevestig wachtwoord</label>
                    <input type="password" id="confirm-password" name="confirm-password" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Rol</label>
                    <div class="space-y-2">
                        <div class="flex items-center">
                            <input type="radio" id="role-admin" name="role" value="admin" checked class="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300">
                            <label for="role-admin" class="ml-2 block text-sm text-gray-700">Admin</label>
                        </div>
                        <div class="flex items-center">
                            <input type="radio" id="role-magazijn" name="role" value="magazijn" class="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300">
                            <label for="role-magazijn" class="ml-2 block text-sm text-gray-700">Magazijn medewerker</label>
                        </div>
                        <div class="flex items-center">
                            <input type="radio" id="role-vrijwilliger" name="role" value="vrijwilliger" class="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300">
                            <label for="role-vrijwilliger" class="ml-2 block text-sm text-gray-700">Vrijwilliger</label>
                        </div>
                    </div>
                </div>
                <div>
                    <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Maak account
                    </button>
                </div>
            </form>
        </div>
    </div>
</body>
</html>

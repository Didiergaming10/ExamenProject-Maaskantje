<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $firstname = $_POST['firstname'];
    $lastname  = $_POST['lastname'];
    $email     = $_POST['email'];
    $password  = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $role      = $_POST['role'];
    $telefoon  = $_POST['telefoon'] ?? '';
    
    // Mapping rol naar rollen_idrollen (voorbeeld)
    $rollenMap = [
        'magazijn'     => 1,
        'vrijwilliger' => 2,
    ];
    $rollen_idrollen = $rollenMap[$role] ?? 0; // fallback

    $conn = new mysqli("mysql", "root", "password", "Eindproject");

    if ($conn->connect_error) {
        die("Verbinding mislukt: " . $conn->connect_error);
    }

    $stmt = $conn->prepare("INSERT INTO gebruikers (voornaam, achternaam, email, wachtwoord, telefoon, rol, status, rollen_idrollen)
                            VALUES (?, ?, ?, ?, ?, ?, 'actief', ?)");
    $stmt->bind_param("ssssssi", $firstname, $lastname, $email, $password, $telefoon, $role, $rollen_idrollen);

    if ($stmt->execute()) {
        header("Location: medewerkers.php");
        exit();
    } else {
        echo "Fout bij opslaan: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
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
    <div class="container mx-auto px-4 py-8">
        <div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
            <h1 class="text-2xl font-bold text-center mb-6">Voedselbank Maaskantje</h1>
            <h2 class="text-xl font-semibold mb-4">Maak account</h2>
            <form method="POST" action="create-account.php" id="create-account-form" class="space-y-4">

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
                            <input type="radio" id="role-magazijn" name="role" value="magazijn" class="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300">
                            <label for="role-magazijn" class="ml-2 block text-sm text-gray-700">Magazijn medewerker</label>
                        </div>
                        <div class="flex items-center">
                            <input type="radio" id="role-vrijwilliger" name="role" value="vrijwilliger" class="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300">
                            <label for="role-vrijwilliger" class="ml-2 block text-sm text-gray-700">Vrijwilliger</label>
                        </div>

                        <div class="flex items-center">
                            <input type="radio" id="role-Admin" name="role" value="Admin" class="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300">
                            <label for="role-Admin" class="ml-2 block text-sm text-gray-700">Admin</label>
                        </div>
                    </div>
                </div>
                <div>
                    <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Maak account
                    </button>
                </div>
                <div class="text-center">
                    <a href="index.html" class="text-sm text-green-600 hover:text-green-500">Terug naar inloggen</a>
                </div>
            </form>
        </div>
    </div>

    
</body>
</html>

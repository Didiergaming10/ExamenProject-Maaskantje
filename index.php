<?php
session_start();
include 'php/connection.php';

$msg = '';

// Check of gebruiker al ingelogd is
if (isset($_SESSION['valid']) && $_SESSION['valid'] === true) {
    switch ($_SESSION['role']) {
        case 1:
            header('Location: directie-home.php');
            exit;
        case 2:
            header('Location: producten.php');
            exit;
        case 3:
            header('Location: voedselpakketten.php');
            exit;
        default:
            header('Location: index.php');
            exit;
    }
}

// Verwerk login formulier
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if (!empty($email) && !empty($password)) {
        $stmt = $conn->prepare("SELECT id, voornaam, achternaam, wachtwoord, rollen_idrollen, status FROM gebruikers WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();
            $fullName = $user['voornaam'] . ' ' . $user['achternaam'];

            if ($user['status'] === 'geblokkeerd') {
    $msg = "Je account is geblokkeerd. Neem contact op met de beheerder.";
} elseif (password_verify($password, $user['wachtwoord'])) {
    // Login succesvol, sessie variabelen zetten
    $_SESSION['valid'] = true;
    $_SESSION['timeout'] = time();
    $_SESSION['username'] = $user['voornaam'] . ' ' . $user['achternaam'];
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['role'] = $user['rollen_idrollen'];

    // Redirect op basis van rol
    switch ($user['rollen_idrollen']) {
        case 1:
            header('Location: directie-home.php');
            exit;
        case 2:
            header('Location: producten.php');
            exit;
        case 3:
            header('Location: voedselpakketten.php');
            exit;
        default:
            $msg = "Onbekende rol. Neem contact op met de beheerder.";
    }
} else {
    $msg = "Ongeldig wachtwoord.";
}

        } else {
            $msg = "Gebruiker niet gevonden.";
        }
        $stmt->close();
    } else {
        $msg = "Voer zowel email als wachtwoord in.";
    }
}
?>



<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Voedselbank Maaskantje - Inloggen</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/styles.css">
</head>
<body class="bg-gray-100 min-h-screen">
    <div class="container mx-auto px-4 py-8">
        <div id="login-container" class="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
            <h1 class="text-2xl font-bold text-center mb-6">Voedselbank Maaskantje</h1>
            <h2 class="text-xl font-semibold mb-4">Inloggen</h2>

            <?php if (!empty($msg)): ?>
                <div class="mb-4 text-red-600 font-medium text-center">
                    <?php echo htmlspecialchars($msg); ?>
                </div>
            <?php endif; ?>

            <form id="login-form" method="POST" action="index.php" class="space-y-4">
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" name="email" required
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                        focus:outline-none focus:ring-green-500 focus:border-green-500">
                </div>
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">Wachtwoord</label>
                    <div class="relative">
                        <input type="password" id="password" name="password" required
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                            focus:outline-none focus:ring-green-500 focus:border-green-500">
                        <button type="button" id="toggle-password"
                            class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-600">
                            wachtwoord tonen
                        </button>
                    </div>
                </div>
                <div>
                    <button type="submit"
                        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm 
                        text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none 
                        focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Inloggen
                    </button>
                </div>
            </form>
        </div>
        
    </div>


    <script>
        document.getElementById('toggle-password').addEventListener('click', function () {
            const passwordInput = document.getElementById('password');
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.textContent = type === 'password' ? 'wachtwoord tonen' : 'verberg wachtwoord';
        });
    </script>
</body>
</html>

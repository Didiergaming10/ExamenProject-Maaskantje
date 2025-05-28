<?php
include 'php/connection.php';
include 'auth.php';
require_role([1]);
include 'header.php';
?>

<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Voedselbank Maaskantje</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body class="bg-gray-100 min-h-screen">

    <main class="container mx-auto px-4 py-8">
        <div id="dashboard-content">
            <!-- Dashboard content will be loaded here based on user role -->
        </div>
        
    </main>

    <script src="js/auth.js"></script>
    <script src="js/dashboard.js"></script>
</body>
</html>

<?php
session_start();
include 'php/connection.php';
include 'auth.php';
?>

<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Voedselpakketten - Voedselbank Maaskantje</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body class="bg-gray-100 min-h-screen">
<?php include 'header.php'; ?>
    <main class="container mx-auto px-4 py-8">
        <div class="bg-white p-4 rounded-lg shadow mb-6">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold">Voedselpakketten</h2>
            </div>
            <div class="flex items-center mb-4">
  <label for="sort-pakketten" class="mr-2">Sorteer op:</label>
  <select id="sort-pakketten" class="border rounded px-2 py-1">
    <option value="datum_desc">Datum (nieuwste eerst)</option>
    <option value="datum_asc">Datum (oudste eerst)</option>
    <option value="gezin_asc">Gezin (A-Z)</option>
    <option value="gezin_desc">Gezin (Z-A)</option>
  </select>
</div>
            <div id="pakketten-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Voedselpakketten will be loaded here dynamically -->
            </div>
        </div>
    </main>

    <script src="js/auth.js"></script>
    <script src="js/voedselpakketten.js"></script>
</body>
</html>

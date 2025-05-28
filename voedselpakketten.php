<?php

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
    <header class="bg-white shadow">
        <div class="container mx-auto px-4 py-4">
            <div class="flex justify-between items-center">
                <h1 class="text-2xl font-bold">Voedselbank Maaskantje</h1>
                <div class="flex items-center">
                    <div class="relative mr-4">
                        <input type="text" id="search-pakketten" placeholder="Zoeken..." class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500">
                        <i class="fas fa-search absolute right-3 top-3 text-gray-400"></i>
                    </div>
                    <nav id="main-nav" class="hidden md:flex space-x-4">
                        <!-- Navigation links will be dynamically inserted based on user role -->
                    </nav>
                    <div class="md:hidden">
                        <button id="mobile-menu-button" class="text-gray-500 hover:text-gray-700 focus:outline-none">
                            <i class="fas fa-bars text-xl"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div id="mobile-menu" class="hidden md:hidden mt-4">
                <nav class="flex flex-col space-y-2">
                    <!-- Mobile navigation links will be dynamically inserted based on user role -->
                </nav>
            </div>
        </div>
    </header>

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

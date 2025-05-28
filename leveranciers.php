<?php
include 'php/connection.php';

?>

<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Leveranciers - Voedselbank Maaskantje</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body class="bg-gray-100 min-h-screen">
  

    <main class="container mx-auto px-4 py-8">
        <div class="bg-white p-4 rounded-lg shadow mb-6">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold">Leveranciers</h2>
                <button id="add-leverancier" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                    <i class="fas fa-plus mr-2"></i>Toevoegen
                </button>
            </div>
            
            <div id="leveranciers-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Leveranciers will be loaded here dynamically -->
            </div>
        </div>
    </main>

    <!-- Add/Edit Leverancier Modal -->
    <div id="leverancier-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 hidden flex items-center justify-center">
        <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div class="flex justify-between items-center mb-4">
                <h2 id="modal-title" class="text-xl font-semibold">Leverancier toevoegen</h2>
                <button id="close-modal" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form id="leverancier-form" class="space-y-4">
                <input type="hidden" id="leverancier-id">
                <div>
                    <label for="leverancier-naam" class="block text-sm font-medium text-gray-700">Leverancier naam</label>
                    <input type="text" id="leverancier-naam" name="leverancier-naam" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                </div>
                <div>
                    <label for="leverancier-adres" class="block text-sm font-medium text-gray-700">Adres</label>
                    <input type="text" id="leverancier-adres" name="leverancier-adres" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                </div>
                
                <div class="border-t pt-4">
                    <h3 class="text-md font-medium mb-2">Contact</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label for="contact-voornaam" class="block text-sm font-medium text-gray-700">Voornaam</label>
                            <input type="text" id="contact-voornaam" name="contact-voornaam" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                        </div>
                        <div>
                            <label for="contact-achternaam" class="block text-sm font-medium text-gray-700">Achternaam</label>
                            <input type="text" id="contact-achternaam" name="contact-achternaam" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                        </div>
                    </div>
                    <div class="mt-4">
                        <label for="contact-email" class="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" id="contact-email" name="contact-email" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                    </div>
                    <div class="mt-4">
                        <label for="contact-telefoon" class="block text-sm font-medium text-gray-700">Telefoonnummer</label>
                        <input type="tel" id="contact-telefoon" name="contact-telefoon" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                    </div>
                </div>
                
                <div class="border-t pt-4">
                    <h3 class="text-md font-medium mb-2">Volgende levering</h3>
                    <div>
                        <label for="levering-datum" class="block text-sm font-medium text-gray-700">Datum</label>
                        <input type="date" id="levering-datum" name="levering-datum" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                    </div>
                    <div class="mt-4">
                        <label for="levering-tijd" class="block text-sm font-medium text-gray-700">Tijd</label>
                        <input type="time" id="levering-tijd" name="levering-tijd" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                    </div>
                </div>
                
                <div class="flex justify-end space-x-2">
                    <button type="button" id="cancel-leverancier" class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Annuleren
                    </button>
                    <button type="submit" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Opslaan
                    </button>
                </div>
            </form>
        </div>
    </div>

    <script src="js/auth.js"></script>
    <script src="js/leveranciers.js"></script>
</body>
</html>

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
    <title>Voedselpakketten - Voedselbank Maaskantje</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body class="bg-gray-100 min-h-screen">

    <main class="container mx-auto px-4 py-8">
        <div class="bg-white p-4 rounded-lg shadow mb-6">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold">Voedselpakketten</h2>
                <button id="create-pakket" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                    <i class="fas fa-plus mr-2"></i>Nieuw pakket
                </button>
            </div>
            
            <div id="pakketten-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Voedselpakketten will be loaded here dynamically -->
            </div>
        </div>
    </main>

    <!-- Create/Edit Voedselpakket Modal -->
    <div id="pakket-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 hidden flex items-center justify-center">
        <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
            <div class="flex justify-between items-center mb-4">
                <h2 id="modal-title" class="text-xl font-semibold">Voedselpakket samenstellen</h2>
                <button id="close-modal" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form id="pakket-form" class="space-y-4">
                <input type="hidden" id="pakket-id">
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label for="gezin-select" class="block text-sm font-medium text-gray-700 mb-2">Selecteer gezin</label>
                        <select id="gezin-select" name="gezin-select" required class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                            <option value="">Selecteer een gezin</option>
                            <!-- Gezinnen will be loaded here dynamically -->
                        </select>
                        
                        <div id="gezin-info" class="mt-4 p-4 border rounded-md hidden">
                            <h3 class="font-medium mb-2">Gezinsinformatie</h3>
                            <p id="gezin-naam"></p>
                            <p id="gezin-leden"></p>
                            <div class="mt-2">
                                <h4 class="font-medium">Dieetwensen:</h4>
                                <ul id="gezin-dieetwensen" class="list-disc pl-5">
                                    <!-- Dieetwensen will be loaded here dynamically -->
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <div class="flex justify-between items-center mb-2">
                            <label for="product-search" class="block text-sm font-medium text-gray-700">Zoek producten</label>
                        </div>
                        <div class="relative">
                            <input type="text" id="product-search" name="product-search" placeholder="Zoek op naam of EAN" class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                            <i class="fas fa-search absolute right-3 top-3 text-gray-400"></i>
                        </div>
                        
                        <div id="product-search-results" class="mt-2 max-h-60 overflow-y-auto border rounded-md hidden">
                            <ul class="divide-y divide-gray-200">
                                <!-- Search results will be loaded here dynamically -->
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="border-t pt-4">
                    <h3 class="text-lg font-medium mb-4">Inhoud van pakket:</h3>
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Product naam
                                    </th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Categorie
                                    </th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aantal
                                    </th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acties
                                    </th>
                                </tr>
                            </thead>
                            <tbody id="pakket-items" class="bg-white divide-y divide-gray-200">
                                <!-- Pakket items will be loaded here dynamically -->
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div class="flex justify-end space-x-2">
                    <button type="button" id="cancel-pakket" class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Annuleren
                    </button>
                    <button type="submit" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Verstuur
                    </button>
                </div>
            </form>
        </div>
    </div>

    <script src="js/auth.js"></script>
    <script src="js/voedselpakketten.js"></script>
</body>
</html>

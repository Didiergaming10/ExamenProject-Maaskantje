<?php
?>
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <title>Nieuw Voedselpakket - Voedselbank Maaskantje</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body class="bg-gray-100 min-h-screen">
    <main class="container mx-auto px-4 py-8">
        <div class="flex flex-col md:flex-row gap-8">
            <!-- Sidebar: gezin info & pakket inhoud -->
            <div class="w-full md:w-1/3 flex flex-col gap-6">
                <div class="bg-white p-4 rounded shadow">
                <div class="mb-4">
  <label class="block mb-1">Gezin</label>
  <select id="gezin-select" class="px-4 py-2 border border-gray-300 rounded-md w-full"></select>
  <input type="hidden" id="gezin-id-hidden" name="gezinId" />
  <span id="gezin-naam" class="font-semibold text-lg"></span>
</div>
                    <div id="gezin-info" class="mt-2">
                        <div class="text-xs text-gray-500" id="gezin-dieetwensen"></div>
                    </div>
                </div>
                <form id="pakket-form" class="bg-white p-4 rounded shadow flex-1 flex flex-col">
                    <h3 class="text-lg font-medium mb-2">Inhoud van pakket:</h3>
                    <div class="overflow-x-auto flex-1">
                        <table class="min-w-full divide-y divide-gray-200">
                            <tbody id="pakket-items" class="bg-white divide-y divide-gray-200">
                                <!-- Pakket items will be loaded here dynamically -->
                            </tbody>
                        </table>
                    </div>
                    <button type="submit" class="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
                        Verstuur
                    </button>
                </form>
            </div>
            <!-- Producten grid -->
            <div class="w-full md:w-2/3 flex flex-col">
                <div class="flex justify-between items-center mb-4">
                    <input type="text" id="product-search" placeholder="Zoek producten..." class="px-4 py-2 border border-gray-300 rounded-md w-full max-w-xs">
                </div>
                <div id="product-search-results" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <!-- Product cards will be loaded here dynamically -->
                </div>
            </div>
        </div>
    </main>
    <script src="js/voedselpakket-maken.js"></script>
</body>
</html>
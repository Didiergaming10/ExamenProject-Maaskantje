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
    <title>Klanten - Voedselbank Maaskantje</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body class="bg-gray-100 min-h-screen">
<?php include 'header.php'; ?>
    <main class="container mx-auto px-4 py-8">
        <div class="bg-white p-4 rounded-lg shadow mb-6">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold">Klanten</h2>
                <div class="flex space-x-2">
                    <button id="add-klant" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                        <i class="fas fa-plus mr-2"></i>Voeg toe
                    </button>
                </div>
            </div>
            
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden multi-select-col">
                                <input type="checkbox" id="select-all-klanten" class="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded">
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Naam gezin
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Postcode
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Telefoon
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Aantal leden
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acties
                            </th>
                        </tr>
                    </thead>
                    <tbody id="klanten-table-body" class="bg-white divide-y divide-gray-200">
                        <!-- Klanten will be loaded here dynamically -->
                    </tbody>
                </table>
            </div>
        </div>
    </main>

    <!-- View/Edit Klant Modal -->
    <div id="klant-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 hidden flex items-center justify-center">
        <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
            <div class="flex justify-between items-center mb-4">
                <h2 id="modal-title" class="text-xl font-semibold">Klant informatie</h2>
                <button id="close-modal" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form id="klant-form" class="space-y-4">
                <input type="hidden" id="klant-id">
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label for="gezin-naam" class="block text-sm font-medium text-gray-700">Naam gezin</label>
                        <input type="text" id="gezin-naam" name="gezin-naam" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                    </div>
                    <div>
                        <label for="postcode" class="block text-sm font-medium text-gray-700">Postcode</label>
                        <input type="text" id="postcode" name="postcode" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                    </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" id="email" name="email" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                    </div>
                    <div>
                        <label for="telefoon" class="block text-sm font-medium text-gray-700">Telefoon nummer</label>
                        <input type="tel" id="telefoon" name="telefoon" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                    </div>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Dieetwensen:</label>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="flex items-center">
                            <input type="checkbox" id="geen-varkensvlees" name="dieetwensen" value="geen-varkensvlees" class="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded">
                            <label for="geen-varkensvlees" class="ml-2 block text-sm text-gray-700">geen varkensvlees</label>
                        </div>
                        <div class="flex items-center">
                            <input type="checkbox" id="veganistisch" name="dieetwensen" value="veganistisch" class="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded">
                            <label for="veganistisch" class="ml-2 block text-sm text-gray-700">veganistisch</label>
                        </div>
                        <div class="flex items-center">
                            <input type="checkbox" id="vegetarisch" name="dieetwensen" value="vegetarisch" class="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded">
                            <label for="vegetarisch" class="ml-2 block text-sm text-gray-700">vegetarisch</label>
                        </div>
                        <div class="flex items-center">
                            <input type="checkbox" id="allergisch" name="dieetwensen" value="allergisch" class="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded">
                            <label for="allergisch" class="ml-2 block text-sm text-gray-700">allergisch</label>
                        </div>
                    </div>
                    <div class="mt-2">
                        <input type="text" id="allergenen" name="allergenen" placeholder="Lactose, Gluten, Pinda's" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                    </div>
                </div>
                
                <div id="gezinsleden-container">
                    <h3 class="text-lg font-medium mb-2">Gezinsleden</h3>
                    <!-- Gezinsleden will be loaded here dynamically -->
                </div>
                
                <div>
                    <button type="button" id="add-gezinslid" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Voeg gezinslid toe
                    </button>
                </div>
                
                <div class="flex justify-end space-x-2">
                    <button type="button" id="cancel-klant" class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Annuleren
                    </button>
                    <button type="submit" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Opslaan
                    </button>
                </div>
            </form>
        </div>
    </div>

    <script src="js/klanten.js"></script>
</body>
</html>

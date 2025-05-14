<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Medewerkers - Voedselbank Maaskantje</title>
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
                        <input type="text" id="search-medewerkers" placeholder="Zoeken..." class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500">
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
                <h2 class="text-xl font-semibold">Medewerkers</h2>
                <div class="flex space-x-2">
                    <button id="multi-select" class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        <i class="fas fa-check-square mr-2"></i>Multi select
                    </button>
                    <button id="add-medewerker" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                        <i class="fas fa-plus mr-2"></i>Voeg toe
                    </button>
                </div>
            </div>
            
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden multi-select-col">
                                <input type="checkbox" id="select-all-medewerkers" class="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded">
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Naam
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Telefoon
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Rol
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acties
                            </th>
                        </tr>
                    </thead>
                    <tbody id="medewerkers-table-body" class="bg-white divide-y divide-gray-200">
                        <!-- Medewerkers will be loaded here dynamically -->
                    </tbody>
                </table>
            </div>
        </div>
    </main>

    <!-- Add/Edit Medewerker Modal -->
    <div id="medewerker-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 hidden flex items-center justify-center">
        <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div class="flex justify-between items-center mb-4">
                <h2 id="modal-title" class="text-xl font-semibold">Medewerker toevoegen</h2>
                <button id="close-modal" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form id="medewerker-form" class="space-y-4">
                <input type="hidden" id="medewerker-id">
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label for="voornaam" class="block text-sm font-medium text-gray-700">Voornaam</label>
                        <input type="text" id="voornaam" name="voornaam" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                    </div>
                    <div>
                        <label for="achternaam" class="block text-sm font-medium text-gray-700">Achternaam</label>
                        <input type="text" id="achternaam" name="achternaam" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                    </div>
                </div>
                
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" name="email" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                </div>
                
                <div>
                    <label for="telefoon" class="block text-sm font-medium text-gray-700">Telefoon</label>
                    <input type="tel" id="telefoon" name="telefoon" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                </div>
                
                <div>
                    <label for="rol" class="block text-sm font-medium text-gray-700">Rol</label>
                    <select id="rol" name="rol" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                        <option value="">Selecteer rol</option>
                        <option value="directie">Directie</option>
                        <option value="magazijn">Magazijnmedewerker</option>
                        <option value="vrijwilliger">Vrijwilliger</option>
                    </select>
                </div>
                
                <div>
                    <label for="wachtwoord" class="block text-sm font-medium text-gray-700">Wachtwoord</label>
                    <input type="password" id="wachtwoord" name="wachtwoord" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                    <p class="text-xs text-gray-500 mt-1">Laat leeg om het huidige wachtwoord te behouden</p>
                </div>
                
                <div>
                    <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
                    <select id="status" name="status" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                        <option value="actief">Actief</option>
                        <option value="geblokkeerd">Geblokkeerd</option>
                    </select>
                </div>
                
                <div class="flex justify-end space-x-2">
                    <button type="button" id="cancel-medewerker" class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
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
    <script src="js/medewerkers.js"></script>
</body>
</html>

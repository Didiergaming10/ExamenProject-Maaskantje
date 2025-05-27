<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Overzicht - Voedselbank Maaskantje</title>
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
                <h2 class="text-xl font-semibold">Gezinnen</h2>
                <div class="flex space-x-2">
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
                            <th> </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th> </th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            </th>
                        </tr>
                    </thead>
                    <tbody id="gezin-table-body" class="bg-white divide-y divide-gray-200">
                    
                                <!-- Products will be loaded here dynamically -->
                            </tbody>
                </table>
            </div>

            
        </div>
    </main>
        </div>
    </div>

    <script src="js/auth.js"></script>
    <script src="js/gezin.js"></script>
</body>
</html>

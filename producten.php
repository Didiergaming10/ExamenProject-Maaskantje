<?php
session_start();
include 'php/connection.php';
$required_roles = ['directie', 'magazijnmedewerker'];
include 'auth.php';

?>

<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Producten - Voedselbank Maaskantje</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <script src="js/producten.js"></script>
</head>
<body class="bg-gray-100 min-h-screen">
<?php include 'header.php'; ?>
    <main class="container mx-auto px-4 py-8">
        <div class="flex flex-col md:flex-row gap-6">
            <!-- Sidebar for categories -->
            <div class="w-full md:w-1/4 bg-white p-4 rounded-lg shadow">
                <h2 class="text-lg font-semibold mb-4">Categorieën</h2>
                <ul class="space-y-2" id="categories-list">
                    <!-- Dynamisch geladen -->
                </ul>
                <?php if (isset($_SESSION['role']) && $_SESSION['role'] === 'directie'): ?>
    <button id="add-category-btn" class="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <i class="fas fa-plus mr-2"></i>Nieuwe categorie
    </button>
<?php endif; ?>
                
            </div>
            
            <!-- Main content -->
            <div class="w-full md:w-3/4">
                <div class="bg-white p-4 rounded-lg shadow mb-6">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl font-semibold">Producten</h2>
                        <div class="flex items-center space-x-2">
                            <label for="sort-by" class="text-sm font-medium text-gray-700">Sorteer:</label>
                            <select id="sort-by" class="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                                <option value="naam">Naam</option>
                                <option value="categorie">Categorie</option>
                                <option value="ean">EAN-nummer</option>
                                <option value="voorraad">Voorraad</option>
                            </select>
                        </div>
                    </div>
                    
                    
                    <div class="mb-4 flex flex-col md:flex-row items-center gap-2">
    <input
        type="text"
        id="search-products"
        placeholder="Zoek op naam, categorie, EAN of voorraad..."
        class="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
    />
    <button id="add-product" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 md:ml-2 w-full md:w-auto">
        <i class="fas fa-plus mr-2"></i>Product toevoegen
    </button>
</div>
                    
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <input type="checkbox" id="select-all-products" class="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded">
                                    </th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Naam
                                    </th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Categorie
                                    </th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        EAN-nummer
                                    </th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Voorraad
                                    </th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acties
                                    </th>
                                </tr>
                            </thead>
                            <tbody id="products-table-body" class="bg-white divide-y divide-gray-200">
                                <!-- Products will be loaded here dynamically -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Add/Edit Product Modal -->
    <div id="product-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 hidden flex items-center justify-center">
        <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div class="flex justify-between items-center mb-4">
                <h2 id="modal-title" class="text-xl font-semibold">Product toevoegen</h2>
                <button id="close-modal" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form id="product-form" class="space-y-4">
                <input type="hidden" id="product-id">
                <div>
                    <label for="product-naam" class="block text-sm font-medium text-gray-700">Naam</label>
                    <input type="text" id="product-naam" name="product-naam" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                </div>
                <div>
                    <label for="product-categorie" class="block text-sm font-medium text-gray-700">Categorie</label>
                    <select id="product-categorie" name="product-categorie" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
 
                    </select>
                </div>
                <div>
                    <label for="product-ean" class="block text-sm font-medium text-gray-700">EAN-nummer</label>
                    <input type="text" id="product-ean" name="product-ean" maxlength="13" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                </div>
                <div>
                    <label for="product-voorraad" class="block text-sm font-medium text-gray-700">Voorraad</label>
                    <input type="number" id="product-voorraad" name="product-voorraad" min="0" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                </div>

                <div class="flex justify-end space-x-2">
                    <button type="button" id="cancel-product" class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Annuleren
                    </button>
                    <button type="submit" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Opslaan
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Nieuwe categorie Modal -->
    <div id="category-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 hidden flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">Nieuwe categorie toevoegen</h2>
            <button id="close-category-modal" class="text-gray-500 hover:text-gray-700">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <form id="category-form" class="space-y-4">
            <div>
                <label for="category-naam" class="block text-sm font-medium text-gray-700">Categorienaam</label>
                <input type="text" id="category-naam" name="category-naam" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div class="flex justify-end space-x-2">
                <button type="button" id="cancel-category" class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Annuleren
                </button>
                <button type="submit" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Toevoegen
                </button>
            </div>
        </form>
    </div>
</div>

    <!-- Categorie bewerken Modal -->
    <div id="edit-category-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 hidden flex items-center justify-center">
  <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold">Categorie bewerken</h2>
      <button id="close-edit-category-modal" class="text-gray-500 hover:text-gray-700">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <form id="edit-category-form" class="space-y-4">
      <input type="hidden" id="edit-category-old-naam">
      <div>
        <label for="edit-category-naam" class="block text-sm font-medium text-gray-700">Nieuwe categorienaam</label>
        <input type="text" id="edit-category-naam" name="edit-category-naam" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
      </div>
      <div class="flex justify-end space-x-2">
        <button type="button" id="cancel-edit-category" class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Annuleren
        </button>
        <button type="submit" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Opslaan
        </button>
      </div>
    </form>
  </div>
</div>

  <script src="js/auth.js"></script>

</body>
</html>
<?php
session_start();
include 'php/connection.php';
$required_roles = ['directie'];
include 'auth.php';

?>

<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <title>Medewerkers - Voedselbank Maaskantje</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

</head>
<body class="bg-gray-100 min-h-screen">
<?php include 'header.php'; ?>
<main class="container mx-auto px-4 py-8">
    <div class="bg-white p-4 rounded-lg shadow mb-6">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">Medewerkers</h2>
            <div class="flex gap-2">
                <label class="flex items-center space-x-1">
                    <input type="checkbox" id="show-blocked" class="h-4 w-4 text-green-600 border-gray-300 rounded">
                    <span class="text-sm text-gray-700">Toon geblokkeerde</span>
                </label>
                <input type="text" id="medewerkers-filter" placeholder="Zoek op naam, email, telefoon..." class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
                <button id="add-medewerker" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Voeg toe</button>
            </div>
        </div>

        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" data-sort="naam">Naam</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" data-sort="email">Email</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" data-sort="telefoon">Telefoon</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" data-sort="rol">Rol</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" data-sort="status">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acties</th>
                </tr>
                </thead>
                <tbody id="medewerkers-table-body" class="bg-white divide-y divide-gray-200">
                <!-- Medewerkers worden hier geladen via JS -->
                </tbody>
            </table>
        </div>
    </div>

    <!-- Medewerker Modal -->
    <div id="medewerker-modal" class="fixed inset-0 bg-gray-800 bg-opacity-70 hidden items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div class="flex justify-between items-center mb-4">
                <h2 id="modal-title" class="text-xl font-semibold">Medewerker toevoegen</h2>
                <button id="close-modal" class="text-gray-600 hover:text-gray-900 focus:outline-none">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div id="modal-error" class="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded hidden"></div>
            <form id="medewerker-form" class="space-y-4">
                <input type="hidden" name="action" id="modal-action" value="create">
                <input type="hidden" name="id" id="medewerker-id">
                <div>
                    <label for="voornaam" class="block text-sm font-medium text-gray-700">Voornaam</label>
                    <input type="text" name="voornaam" id="voornaam" required class="mt-1 block w-full border rounded px-3 py-2">
                </div>
                <div>
                    <label for="achternaam" class="block text-sm font-medium text-gray-700">Achternaam</label>
                    <input type="text" name="achternaam" id="achternaam" required class="mt-1 block w-full border rounded px-3 py-2">
                </div>
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" name="email" id="email" required class="mt-1 block w-full border rounded px-3 py-2">
                </div>
                <div>
                    <label for="telefoon" class="block text-sm font-medium text-gray-700">Telefoon</label>
                    <input type="text" name="telefoon" id="telefoon" maxlength="10" class="mt-1 block w-full border rounded px-3 py-2">
                </div>
                <div id="password-fields">
                    <label for="password" class="block text-sm font-medium text-gray-700">Wachtwoord</label>
                    <input type="password" name="password" id="password" class="mt-1 block w-full border rounded px-3 py-2">
                    <label for="confirm-password" class="block text-sm font-medium text-gray-700 mt-2">Bevestig wachtwoord</label>
                    <input type="password" name="confirm-password" id="confirm-password" class="mt-1 block w-full border rounded px-3 py-2">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Rol</label>
                    <select name="role" id="rol" class="mt-1 block w-full border rounded px-3 py-2">
                        <option value="admin">Admin</option>
                        <option value="magazijn">Magazijn</option>
                        <option value="vrijwilliger">Vrijwilliger</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Status</label>
                    <select name="status" id="status" class="mt-1 block w-full border rounded px-3 py-2">
                        <option value="actief">Actief</option>
                        <option value="geblokkeerd">Geblokkeerd</option>
                    </select>
                </div>
                <div class="flex justify-end space-x-2">
                    <button type="button" id="cancel-btn" class="px-4 py-2 border rounded bg-gray-200 hover:bg-gray-300">Annuleren</button>
                    <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Opslaan</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Delete bevestiging Modal -->
    <div id="delete-modal" class="fixed inset-0 bg-gray-800 bg-opacity-70 hidden items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
            <h2 class="text-xl font-semibold mb-4">Medewerker verwijderen</h2>
            <p id="delete-text" class="mb-4">Weet je zeker dat je deze medewerker wilt verwijderen?</p>
            <div class="flex justify-end space-x-2">
                <button id="delete-cancel" class="px-4 py-2 border rounded bg-gray-200 hover:bg-gray-300">Annuleren</button>
                <button id="delete-confirm" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Verwijder</button>
            </div>
        </div>
    </div>
</main>
<script src="js/medewerkers.js"></script>
</body>
</html>

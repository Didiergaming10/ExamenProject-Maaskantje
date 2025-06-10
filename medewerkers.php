<?php
session_start();
include 'php/connection.php';
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
            <button id="add-medewerker" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Voeg toe</button>
        </div>

        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Naam</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefoon</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acties</th>
                </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                <?php
                $result = $conn->query("
                    SELECT 
                        g.id, g.voornaam, g.achternaam, g.email, g.telefoon, g.status,
                        r.directie, r.magazijnmedewerker, r.vrijwilliger
                    FROM gebruikers g
                    LEFT JOIN rollen r ON g.rollen_idrollen = r.idrollen
                ");



                if ($result && $result->num_rows > 0) {
                    while ($row = $result->fetch_assoc()) {
                        // Rol bepalen
                        $rol = 'onbekend';
                        if ($row['directie'] == 1) {
                            $rol = 'admin';
                        } elseif ($row['magazijnmedewerker'] == 1) {
                            $rol = 'magazijn';
                        } elseif ($row['vrijwilliger'] == 1) {
                            $rol = 'vrijwilliger';
                        }

                        echo "<tr>";
                        echo "<td class='px-6 py-4 whitespace-nowrap'>" . htmlspecialchars(($row['voornaam'] ?? '') . ' ' . ($row['achternaam'] ?? '')) . "</td>";
                        echo "<td class='px-6 py-4 whitespace-nowrap'>" . htmlspecialchars($row['email'] ?? '') . "</td>";
                        echo "<td class='px-6 py-4 whitespace-nowrap'>" . htmlspecialchars($row['telefoon'] ?? '') . "</td>";
                        echo "<td class='px-6 py-4 whitespace-nowrap'>" . htmlspecialchars($rol) . "</td>";
                        echo "<td class='px-6 py-4 whitespace-nowrap'>" . htmlspecialchars($row['status'] ?? '-') . "</td>";
                        echo "<td class='px-6 py-4 whitespace-nowrap'>
                                <button class=\"text-blue-600 hover:underline mr-4 edit-btn\" 
                                    data-id=\"" . (int)$row['id'] . "\" 
                                    data-voornaam=\"" . htmlspecialchars($row['voornaam'] ?? '') . "\" 
                                    data-achternaam=\"" . htmlspecialchars($row['achternaam'] ?? '') . "\" 
                                    data-email=\"" . htmlspecialchars($row['email'] ?? '') . "\" 
                                    data-telefoon=\"" . htmlspecialchars($row['telefoon'] ?? '') . "\" 
                                    data-rol=\"" . htmlspecialchars($rol) . "\" 
                                    data-status=\"" . htmlspecialchars($row['status'] ?? '') . "\">Bewerk</button>
                                <button class=\"text-red-600 hover:underline delete-btn\" 
                                    data-id=\"" . (int)$row['id'] . "\" 
                                    data-naam=\"" . htmlspecialchars(($row['voornaam'] ?? '') . ' ' . ($row['achternaam'] ?? '')) . "\">Verwijder</button>
                              </td>";
                        echo "</tr>";
                    }
                } else {
                    echo "<tr><td colspan='6' class='text-center py-4 text-gray-500'>Geen medewerkers gevonden.</td></tr>";
                }

                $conn->close();
                ?>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Medewerker Modal (voor create & edit) -->
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

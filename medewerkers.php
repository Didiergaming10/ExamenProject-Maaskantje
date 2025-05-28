<?php
include 'php/connection.php';
?>

<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <title>Medewerkers - Voedselbank Maaskantje</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100 min-h-screen">
<main class="container mx-auto px-4 py-8">
    <div class="bg-white p-4 rounded-lg shadow mb-6">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">Medewerkers</h2>
            <a href="create-account.php" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Voeg toe</a>
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
                        echo "<td class='px-6 py-4 whitespace-nowrap'>" . htmlspecialchars($row['voornaam'] . ' ' . $row['achternaam']) . "</td>";
                        echo "<td class='px-6 py-4 whitespace-nowrap'>" . htmlspecialchars($row['email'] ?? '-') . "</td>";
                        echo "<td class='px-6 py-4 whitespace-nowrap'>" . htmlspecialchars($row['telefoon'] ?? '-') . "</td>";
                        echo "<td class='px-6 py-4 whitespace-nowrap'>" . htmlspecialchars($rol) . "</td>";
                        echo "<td class='px-6 py-4 whitespace-nowrap'>" . htmlspecialchars($row['status'] ?? '-') . "</td>";
                        echo "<td class='px-6 py-4 whitespace-nowrap'>
                                <a href='edit-medewerker.php?id=" . (int)$row['id'] . "' class='text-blue-600 hover:underline mr-4'>Bewerk</a>
                                <form method='POST' action='delete-medewerker.php' onsubmit='return confirm(\"Weet je zeker dat je deze medewerker wilt verwijderen?\");' style='display:inline;'>
                                    <input type='hidden' name='id' value='" . (int)$row['id'] . "'>
                                    <button type='submit' class='text-red-600 hover:underline'>Verwijder</button>
                                </form>
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
</main>
</body>
</html>

<?php
// Databaseverbinding
$conn = new mysqli("mysql", "root", "password", "Eindproject");

if ($conn->connect_error) {
    die("Verbinding mislukt: " . $conn->connect_error);
}
?>

<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
                    $result = $conn->query("SELECT id, voornaam, achternaam, email, telefoon, rol, status FROM medewerkers");

                    if ($result && $result->num_rows > 0) {
                        while ($row = $result->fetch_assoc()) {
                            echo "<tr>";
                            echo "<td class='px-6 py-4 whitespace-nowrap'>" . htmlspecialchars($row['voornaam'] . ' ' . $row['achternaam']) . "</td>";
                            echo "<td class='px-6 py-4 whitespace-nowrap'>" . htmlspecialchars($row['email']) . "</td>";
                            echo "<td class='px-6 py-4 whitespace-nowrap'>" . (!empty($row['telefoon']) ? htmlspecialchars($row['telefoon']) : '-') . "</td>";
                            echo "<td class='px-6 py-4 whitespace-nowrap'>" . htmlspecialchars($row['rol']) . "</td>";
                            echo "<td class='px-6 py-4 whitespace-nowrap'>" . htmlspecialchars($row['status']) . "</td>";
                            echo "<td class='px-6 py-4 whitespace-nowrap'>";
                            echo "<form method='POST' action='delete-medewerker.php' onsubmit='return confirm(\"Weet je zeker dat je deze medewerker wilt verwijderen?\");'>";
                            echo "<input type='hidden' name='id' value='" . htmlspecialchars($row['id']) . "'>";
                            echo "<button type='submit' class='text-red-600 hover:underline'>Verwijder</button>";
                            echo "</form>";
                            echo "</td>";
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

<?php
session_start();
include 'php/connection.php';

// Insert new leverancier and levering on POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $bedrijfsnaam = $_POST['bedrijfsnaam'];
    $adres = $_POST['adres'];
    $voornaam = $_POST['voornaam'];
    $email = $_POST['email'];
    $telefoon = $_POST['telefoon'];
    $datum = $_POST['datum'] ?? null;  // levering datum
    $volgende_levering = $_POST['volgende_levering'] ?? null;  // volgende levering datum

    // Insert leverancier (without achternaam)
    $stmt = $conn->prepare("INSERT INTO leveranciers (bedrijfsnaam, adres, name, email, telefoonnummer) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssi", $bedrijfsnaam, $adres, $voornaam, $email, $telefoon);
    $stmt->execute();
    $leverancier_id = $stmt->insert_id;
    $stmt->close();

    // Insert levering if dates are provided
    if ($leverancier_id && ($datum || $volgende_levering)) {
        $stmt2 = $conn->prepare("INSERT INTO leveringen (datum, volgende_levering, leveranciers_id) VALUES (?, ?, ?)");
        $stmt2->bind_param("ssi", $datum, $volgende_levering, $leverancier_id);
        $stmt2->execute();
        $stmt2->close();
    }

    header("Location: " . $_SERVER['PHP_SELF']);
    exit;
}

// Fetch leveranciers with their earliest volgende_levering and latest datum
$sql = "SELECT l.*, 
        (SELECT volgende_levering FROM leveringen WHERE leveranciers_id = l.id ORDER BY volgende_levering ASC LIMIT 1) AS volgende_levering,
        (SELECT MAX(datum) FROM leveringen WHERE leveranciers_id = l.id) AS laatste_datum
        FROM leveranciers l";
$result = $conn->query($sql);
$leveranciers = $result->fetch_all(MYSQLI_ASSOC);
include 'auth.php';
?>


<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8" />
    <title>Leveranciers</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
</head>
<body class="bg-gray-100 min-h-screen">
<?php include 'header.php'; ?>

<main class="container mx-auto px-4 py-8">
    <div class="bg-white p-4 rounded-lg shadow mb-6">
        <h2 class="text-2xl font-bold mb-4">Leveranciers</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <?php foreach ($leveranciers as $l): ?>
                <div class="bg-white p-4 rounded-lg shadow">
                    <h3 class="text-lg font-semibold mb-2"><?= htmlspecialchars($l['bedrijfsnaam'] ?? '') ?></h3>
                    <p class="text-sm text-gray-500">Adres: <?= htmlspecialchars($l['adres'] ?? '') ?></p>
                    <p class="text-sm">Contact: <?= htmlspecialchars($l['name'] ?? '') ?></p>
                    <p class="text-sm">Email: <?= htmlspecialchars($l['email'] ?? '') ?></p>
                    <p class="text-sm">Telefoon: <?= htmlspecialchars($l['telefoonnummer'] ?? '') ?></p>
                    <p class="text-sm mt-2 text-blue-600 font-medium">
                        Laatste levering: <?= $l['laatste_datum'] ? date("d-m-Y", strtotime($l['laatste_datum'])) : 'Geen' ?>
                    </p>
                    <p class="text-sm mt-1 text-green-600 font-medium">
                        Volgende levering: <?= $l['volgende_levering'] ? date("d-m-Y", strtotime($l['volgende_levering'])) : 'Geen gepland' ?>
                    </p>
                </div>
            <?php endforeach; ?>
    

    <!-- Toevoegen button -->
    <div class="text-right p-4">
        <button id="openModal" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Toevoegen
        </button>
    </div>

    <!-- Modal Overlay -->
    <div id="modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
        <!-- Modal Content -->
        <div class="bg-white p-6 rounded-lg shadow max-w-xl w-full relative">
            <!-- Close Button -->
            <button id="closeModal" class="absolute top-2 right-2 text-gray-600 hover:text-black text-2xl font-bold">
                &times;
            </button>
            <h2 class="text-xl font-semibold mb-4">Nieuwe leverancier toevoegen</h2>
            <form method="POST" autocomplete="off" class="space-y-4">
                <input type="text" name="bedrijfsnaam" required placeholder="Bedrijfsnaam" class="w-full px-3 py-2 border rounded" />
                <input type="text" name="adres" required placeholder="Adres" class="w-full px-3 py-2 border rounded" />
                <input type="text" name="voornaam" required placeholder="Contactpersoon" class="w-full px-3 py-2 border rounded" />
                <input type="email" name="email" required placeholder="Email" class="w-full px-3 py-2 border rounded" />
                <input type="number" name="telefoon" required placeholder="Telefoonnummer" class="w-full px-3 py-2 border rounded" />
                
                <label class="block">
                  <span class="text-gray-700">Datum levering</span>
                  <input type="date" name="datum" class="mt-1 block w-full border rounded px-3 py-2" />
                </label>
                <label class="block">
                  <span class="text-gray-700">Volgende levering</span>
                  <input type="date" name="volgende_levering" class="mt-1 block w-full border rounded px-3 py-2" />
                </label>

                <div class="text-right">
                    <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Opslaan</button>
                </div>
            </form>
        </div>
    </div>
</main>

<!-- Modal Script -->
<script>
    const modal = document.getElementById('modal');
    const openBtn = document.getElementById('openModal');
    const closeBtn = document.getElementById('closeModal');

    openBtn.addEventListener('click', () => modal.classList.remove('hidden'));
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    window.addEventListener('click', e => { if (e.target === modal) modal.classList.add('hidden'); });
</script>
</body>
</html>

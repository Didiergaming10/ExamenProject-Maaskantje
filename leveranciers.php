<?php
session_start();
include 'auth.php';
include 'php/connection.php';

// Handle POST (Add or Update leverancier)
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['form_type']) && $_POST['form_type'] === 'leverancier') {
    $id = $_POST["id"] ?? null;
    if (!empty($id)) {
        $stmt = $conn->prepare("UPDATE leveranciers SET bedrijfsnaam = ?, adres = ?, voornaam = ?, achternaam = ?, email = ?, telefoonnummer = ? WHERE id = ?");
        $stmt->bind_param("ssssssi", $_POST["bedrijfsnaam"], $_POST["adres"], $_POST["voornaam"], $_POST["achternaam"], $_POST["email"], $_POST["telefoonnummer"], $id);
        $stmt->execute();
        $stmt->close();
    } else {
        $stmt = $conn->prepare("INSERT INTO leveranciers (bedrijfsnaam, adres, voornaam, achternaam, email, telefoonnummer) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssssi", $_POST["bedrijfsnaam"], $_POST["adres"], $_POST["voornaam"], $_POST["achternaam"], $_POST["email"], $_POST["telefoonnummer"]);
        $stmt->execute();
        $stmt->close();
    }
    header("Location: leveranciers.php");
    exit;
}

// Handle POST (Add or Update levering)
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['form_type']) && $_POST['form_type'] === 'levering') {
    $leveringenid = $_POST["leveringenid"] ?? null;
    $leveranciers_id = $_POST["leveranciers_id"];
    $datum = $_POST["datum"];
    $volgende_levering = $_POST["volgende_levering"] ?: null;

    if (!empty($leveringenid)) {
        $stmt = $conn->prepare("UPDATE leveringen SET datum = ?, volgende_levering = ? WHERE leveringenid = ? AND leveranciers_id = ?");
        $stmt->bind_param("ssii", $datum, $volgende_levering, $leveringenid, $leveranciers_id);
        $stmt->execute();
        $stmt->close();
    } else {
        $stmt = $conn->prepare("INSERT INTO leveringen (datum, volgende_levering, leveranciers_id) VALUES (?, ?, ?)");
        $stmt->bind_param("ssi", $datum, $volgende_levering, $leveranciers_id);
        $stmt->execute();
        $stmt->close();
    }
    header("Location: leveranciers.php");
    exit;
}

// Handle Delete leverancier
if (isset($_GET["delete"])) {
    $stmt = $conn->prepare("DELETE FROM leveranciers WHERE id = ?");
    $stmt->bind_param("i", $_GET["delete"]);
    $stmt->execute();
    $stmt->close();
    header("Location: leveranciers.php");
    exit;
}

// Handle Delete levering
if (isset($_GET["delete_levering"])) {
    $stmt = $conn->prepare("DELETE FROM leveringen WHERE leveringenid = ?");
    $stmt->bind_param("i", $_GET["delete_levering"]);
    $stmt->execute();
    $stmt->close();
    header("Location: leveranciers.php");
    exit;
}

// Fetch leveranciers
$result = $conn->query("SELECT * FROM leveranciers ORDER BY bedrijfsnaam ASC");
$leveranciers = $result->fetch_all(MYSQLI_ASSOC);

// Fetch leveringen grouped by leverancier id
$leveringenByLeverancier = [];
$leveringenResult = $conn->query("SELECT * FROM leveringen ORDER BY datum DESC");
while ($row = $leveringenResult->fetch_assoc()) {
    $leveringenByLeverancier[$row['leveranciers_id']][] = $row;
}
?>

<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Leveranciers - Voedselbank Maaskantje</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
</head>
<body class="bg-gray-100 min-h-screen">
<?php include 'header.php'; ?>

<main class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
        <h2 class="text-3xl font-extrabold text-gray-900">Leveranciers</h2>
        <button id="add-leverancier" class="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center shadow-md transition duration-300">
            <i class="fas fa-plus mr-2"></i>Toevoegen
        </button>
    </div>

    <?php if (count($leveranciers) === 0): ?>
        <p class="text-gray-500 text-lg italic">Geen leveranciers gevonden.</p>
    <?php else: ?>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <?php foreach ($leveranciers as $l): ?>
            <div class="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300">
                <div>
                    <h3 class="text-2xl font-semibold text-gray-900 mb-3"><?= htmlspecialchars($l['bedrijfsnaam']) ?></h3>
                    <p class="text-gray-700 mb-1"><strong>Adres:</strong> <?= htmlspecialchars($l['adres']) ?></p>
                    <p class="text-gray-700 mb-1"><strong>Contactpersoon:</strong> <?= htmlspecialchars($l['voornaam'] . ' ' . $l['achternaam']) ?></p>
                    <p class="text-gray-700 mb-1"><strong>Email:</strong> <a href="mailto:<?= htmlspecialchars($l['email']) ?>" class="text-green-600 hover:underline"><?= htmlspecialchars($l['email']) ?></a></p>
                    <p class="text-gray-700 mb-4"><strong>Telefoon:</strong> <?= htmlspecialchars($l['telefoonnummer']) ?></p>
                </div>

                <div>
                    <h4 class="font-semibold mb-3 text-gray-900">Leveringen:</h4>
                    <?php 
                        $leveringen = $leveringenByLeverancier[$l['id']] ?? [];
                    ?>
                    <?php if ($leveringen): ?>
                        <ul class="mb-4 divide-y divide-gray-200 max-h-48 overflow-y-auto">
                            <?php foreach ($leveringen as $levering): ?>
                                <li class="py-3 flex justify-between items-center hover:bg-gray-50 rounded transition duration-200">
                                    <div>
                                        <div><strong>Datum:</strong> <span class="text-blue-600 font-semibold"><?= htmlspecialchars(date('d-m-Y', strtotime($levering['datum']))) ?></span></div>
                                        <div><strong>Volgende levering:</strong> <span class="text-green-600"><?= htmlspecialchars($levering['volgende_levering'] ? date('d-m-Y', strtotime($levering['volgende_levering'])) : '-') ?></span></div>
                                    </div>
                                    <div class="space-x-3 text-lg">
                                        <button aria-label="Bewerk levering" onclick='editLevering(<?= json_encode($levering, JSON_HEX_TAG|JSON_HEX_APOS|JSON_HEX_QUOT|JSON_HEX_AMP) ?>, <?= $l["id"] ?>)' class="text-yellow-500 hover:text-yellow-700 focus:outline-none transition duration-200">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <a href="?delete_levering=<?= $levering['leveringenid'] ?>" onclick="return confirm('Weet je zeker dat je deze levering wilt verwijderen?')" class="text-red-600 hover:text-red-800 transition duration-200" aria-label="Verwijder levering">
                                            <i class="fas fa-trash-alt"></i>
                                        </a>
                                    </div>
                                </li>
                            <?php endforeach; ?>
                        </ul>
                    <?php else: ?>
                        <p class="mb-4 text-gray-500 italic">Nog geen leveringen.</p>
                    <?php endif; ?>
                </div>

                <div class="flex justify-end space-x-3 mt-2">
                    <button 
                        class="text-yellow-600 hover:text-yellow-800 focus:outline-none transition duration-200" 
                        onclick='editLeverancier(<?= json_encode($l, JSON_HEX_TAG|JSON_HEX_APOS|JSON_HEX_QUOT|JSON_HEX_AMP) ?>)'>
                        <i class="fas fa-edit fa-lg"></i>
                    </button>
                    <a href="?delete=<?= $l['id'] ?>" onclick="return confirm('Weet je zeker dat je deze leverancier wilt verwijderen?')" class="text-red-700 hover:text-red-900 transition duration-200">
                        <i class="fas fa-trash-alt fa-lg"></i>
                    </a>
                    <button 
                        class="text-blue-600 hover:text-blue-800 focus:outline-none transition duration-200" 
                        onclick='addLevering(<?= $l["id"] ?>)'>
                        <i class="fas fa-plus-circle fa-lg"></i>
                    </button>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
    <?php endif; ?>
</main>

<!-- Leverancier Modal -->
<div id="leverancier-modal" class="fixed inset-0 bg-gray-800 bg-opacity-70 hidden flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
        <div class="flex justify-between items-center mb-5">
            <h2 id="modal-title" class="text-2xl font-semibold text-gray-900">Leverancier toevoegen/bewerken</h2>
            <button id="close-modal" class="text-gray-600 hover:text-gray-900 focus:outline-none">
                <i class="fas fa-times fa-lg"></i>
            </button>
        </div>
        <form id="leverancier-form" method="POST" class="space-y-5">
            <input type="hidden" name="form_type" value="leverancier" />
            <input type="hidden" name="id" id="leverancier-id" />

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label for="bedrijfsnaam" class="block text-sm font-medium text-gray-700">Bedrijfsnaam</label>
                    <input type="text" name="bedrijfsnaam" id="bedrijfsnaam" required class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
                </div>
                <div>
                    <label for="adres" class="block text-sm font-medium text-gray-700">Adres</label>
                    <input type="text" name="adres" id="adres" required class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label for="voornaam" class="block text-sm font-medium text-gray-700">Voornaam</label>
                    <input type="text" name="voornaam" id="voornaam" required class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
                </div>
                <div>
                    <label for="achternaam" class="block text-sm font-medium text-gray-700">Achternaam</label>
                    <input type="text" name="achternaam" id="achternaam" required class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" name="email" id="email" required class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
                </div>
                <div>
                    <label for="telefoonnummer" class="block text-sm font-medium text-gray-700">Telefoonnummer</label>
                    <input type="tel" name="telefoonnummer" id="telefoonnummer" required class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
                </div>
            </div>

            <div class="flex justify-end space-x-3 pt-5">
                <button type="button" id="cancel-btn" class="px-5 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    Annuleren
                </button>
                <button type="submit" class="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    Opslaan
                </button>
            </div>
        </form>
    </div>
</div>

<!-- Levering Modal -->
<div id="levering-modal" class="fixed inset-0 bg-gray-800 bg-opacity-70 hidden flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-screen overflow-y-auto">
        <div class="flex justify-between items-center mb-5">
            <h2 id="levering-modal-title" class="text-2xl font-semibold text-gray-900">Levering toevoegen/bewerken</h2>
            <button id="close-levering-modal" class="text-gray-600 hover:text-gray-900 focus:outline-none">
                <i class="fas fa-times fa-lg"></i>
            </button>
        </div>
        <form id="levering-form" method="POST" class="space-y-5">
            <input type="hidden" name="form_type" value="levering" />
            <input type="hidden" name="leveringenid" id="leveringenid" />
            <input type="hidden" name="leveranciers_id" id="leveranciers_id" />

            <div>
                <label for="datum" class="block text-sm font-medium text-gray-700">Datum levering</label>
                <input type="date" name="datum" id="datum" required class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div>
                <label for="volgende_levering" class="block text-sm font-medium text-gray-700">Datum volgende levering</label>
                <input type="date" name="volgende_levering" id="volgende_levering" class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                <p class="text-xs text-gray-500 mt-1">Kan leeg blijven als onbekend</p>
            </div>

            <div class="flex justify-end space-x-3 pt-5">
                <button type="button" id="cancel-levering-btn" class="px-5 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Annuleren
                </button>
                <button type="submit" class="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Opslaan
                </button>
            </div>
        </form>
    </div>
</div>

<script>
    // Modal DOM elements
    const leverancierModal = document.getElementById('leverancier-modal');
    const leveringModal = document.getElementById('levering-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const cancelBtn = document.getElementById('cancel-btn');
    const closeLeveringModalBtn = document.getElementById('close-levering-modal');
    const cancelLeveringBtn = document.getElementById('cancel-levering-btn');

    // Show modal helper
    function showModal(modal) {
        modal.classList.remove('hidden');
    }
    function hideModal(modal) {
        modal.classList.add('hidden');
    }

    // Clear and show Leverancier Modal for add
    document.getElementById('add-leverancier').addEventListener('click', () => {
        document.getElementById('modal-title').innerText = 'Leverancier toevoegen';
        const form = document.getElementById('leverancier-form');
        form.reset();
        document.getElementById('leverancier-id').value = '';
        showModal(leverancierModal);
    });

    // Edit leverancier fills modal with data
    function editLeverancier(leverancier) {
        document.getElementById('modal-title').innerText = 'Leverancier bewerken';
        document.getElementById('leverancier-id').value = leverancier.id;
        document.getElementById('bedrijfsnaam').value = leverancier.bedrijfsnaam;
        document.getElementById('adres').value = leverancier.adres;
        document.getElementById('voornaam').value = leverancier.voornaam;
        document.getElementById('achternaam').value = leverancier.achternaam;
        document.getElementById('email').value = leverancier.email;
        document.getElementById('telefoonnummer').value = leverancier.telefoonnummer;
        showModal(leverancierModal);
    }

    closeModalBtn.addEventListener('click', () => hideModal(leverancierModal));
    cancelBtn.addEventListener('click', () => hideModal(leverancierModal));

    // Levering modal controls
    function addLevering(leveranciers_id) {
        document.getElementById('levering-modal-title').innerText = 'Levering toevoegen';
        const form = document.getElementById('levering-form');
        form.reset();
        document.getElementById('leveringenid').value = '';
        document.getElementById('leveranciers_id').value = leveranciers_id;
        showModal(leveringModal);
    }

    function editLevering(levering, leveranciers_id) {
        document.getElementById('levering-modal-title').innerText = 'Levering bewerken';
        document.getElementById('leveringenid').value = levering.leveringenid;
        document.getElementById('leveranciers_id').value = leveranciers_id;
        document.getElementById('datum').value = levering.datum;
        document.getElementById('volgende_levering').value = levering.volgende_levering ?? '';
        showModal(leveringModal);
    }

    closeLeveringModalBtn.addEventListener('click', () => hideModal(leveringModal));
    cancelLeveringBtn.addEventListener('click', () => hideModal(leveringModal));
</script>

</body>
</html>

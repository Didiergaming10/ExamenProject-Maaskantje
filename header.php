<?php
$role = $_SESSION['role'] ?? null;


$roleMenus = [
    1 => 'Admin',
    2 => 'Magazijnmedewerker',
    3 => 'Vrijwilliger'
];

$menuItems = [
    1 => ['dashboard', 'create-account', 'gezin-informatie', 'klanten', 'leveranciers', 'medewerkers', 'producten', 'voedselpakketten'],
    2 => ['leveranciers',  'producten'],
    3 => ['voedselpakketten']
];

$currentMenu = $menuItems[$role] ?? [];
?>

<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8" />
    <title>Voedselbank Maaskantje</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- Font Awesome -->
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
    />
    <main class="container mx-auto px-4 py-8">
    <?php if ($role && isset($roleMenus[$role])): ?>
        <nav class="sticky top-16 z-10 bg-green-600 rounded-md px-4 py-2">
            <ul class="flex space-x-6">
                <?php foreach ($currentMenu as $item): ?>
                    <li>
                        <a
                            href="<?= strtolower($item) ?>.php"
                            class="text-white font-semibold hover:text-green-300 transition"
                        >
                            <?= ucfirst($item) ?>
                        </a>
                    </li>
                <?php endforeach; ?>
            </ul>
        </nav>
    <?php endif; ?>
</main>
</head>
<body class="bg-gray-100">

<header class="bg-white shadow">
    <div class="container mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold">Voedselbank Maaskantje</h1>
            <div class="flex items-center">
                <div class="relative mr-4">
                    <input
                        type="text"
                        placeholder="Zoeken..."
                        class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                    <i class="fas fa-search absolute right-3 top-3 text-gray-400"></i>
                </div>
                <nav id="main-nav" class="hidden md:flex space-x-4">
                    <?php foreach ($currentMenu as $item): ?>
                        <a
                            href="<?= strtolower($item) ?>.php"
                            class="text-gray-700 hover:text-green-500"
                        >
                            <?= ucfirst($item) ?>
                        </a>
                    <?php endforeach; ?>
                </nav>
                <div class="md:hidden">
                    <button
                        id="mobile-menu-button"
                        class="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        <i class="fas fa-bars text-xl"></i>
                    </button>
                </div>
            </div>
        </div>
        <div id="mobile-menu" class="hidden md:hidden mt-4">
            <nav class="flex flex-col space-y-2">
                <?php foreach ($currentMenu as $item): ?>
                    <a
                        href="<?= strtolower($item) ?>.php"
                        class="text-gray-700 hover:text-green-500"
                    >
                        <?= ucfirst($item) ?>
                    </a>
                <?php endforeach; ?>
            </nav>
        </div>
    </div>
</header>

<!-- Pagina inhoud -->


<!-- JavaScript om het mobiele menu te togglen -->
<script>
document.addEventListener('DOMContentLoaded', function () {
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    menuButton.addEventListener('click', function () {
        mobileMenu.classList.toggle('hidden');
    });
});
</script>

</body>
</html>

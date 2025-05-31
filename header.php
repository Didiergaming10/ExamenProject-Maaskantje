<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Only display header if user is logged in
if (isset($_SESSION['valid']) && $_SESSION['valid'] === true) {
    $role = isset($_SESSION['role']) ? (int)$_SESSION['role'] : null;
    $username = $_SESSION['username'] ?? 'Gebruiker';

    $roleMenus = [
        1 => 'Admin',
        2 => 'Magazijnmedewerker',
        3 => 'Vrijwilliger'
    ];

    $menuItems = [
        1 => [
            'klanten',
            'medewerkers',
            'leveranciers',
            'producten',
            'voedselpakketten',
            ['link' => 'index-vrijwilliger', 'label' => 'Voedselpakket maken']
        ],
        2 => ['leveranciers', 'producten'],
        3 => [
            'voedselpakketten',
            ['link' => 'index-vrijwilliger', 'label' => 'Voedselpakket maken']
        ]
    ];

    $currentMenu = $menuItems[$role] ?? [];

    // Add this before the HTML:
    $homeLinks = [
        1 => 'directie-home.php',
        2 => 'producten.php',
        3 => 'index-vrijwilliger.php'
    ];
    $homeLink = $homeLinks[$role] ?? '#';
?>
<header class="bg-white shadow sticky top-0 z-50">
    <div class="container mx-auto px-4 py-3 flex justify-between items-center">
        <!-- Logo/Title -->
        <a href="<?= htmlspecialchars($homeLink) ?>" class="flex items-center space-x-3 group hover:opacity-80 transition">
            <i class="fas fa-seedling text-green-600 text-2xl group-hover:scale-110 transition-transform"></i>
            <span class="text-2xl font-bold text-green-700 group-hover:text-green-800 transition-colors">Voedselbank Maaskantje</span>
        </a>
        <!-- Desktop Nav -->
        <nav class="hidden md:flex items-center space-x-6">
            <?php foreach ($currentMenu as $item): ?>
                <?php
                    if (is_array($item)) {
                        $href = strtolower($item['link']) . '.php';
                        $label = $item['label'];
                    } else {
                        $href = strtolower($item) . '.php';
                        $label = ucfirst($item);
                    }
                ?>
                <a
                    href="<?= htmlspecialchars($href) ?>"
                    class="text-gray-700 hover:text-green-600 transition-colors font-medium px-2 py-1 rounded hover:bg-green-50 hover:underline"
                >
                    <?= htmlspecialchars($label) ?>
                </a>
            <?php endforeach; ?>
        </nav>
        <!-- Search + User -->
        <div class="flex items-center space-x-4">
            <form class="relative hidden sm:block" onsubmit="handleHeaderSearch(event)">
                <input
                    id="header-search"
                    type="text"
                    placeholder="Zoeken..."
                    class="pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 transition"
                />
                <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </form>
            <!-- User Dropdown -->
            <div class="relative" id="user-dropdown-parent">
                <button id="user-dropdown-btn" type="button" class="flex items-center space-x-2 px-3 py-2 rounded hover:bg-green-50 transition focus:outline-none">
                    <i class="fas fa-user-circle text-green-600 text-xl"></i>
                    <span class="hidden sm:inline text-gray-700"><?= htmlspecialchars($username) ?></span>
                    <i class="fas fa-chevron-down text-xs text-gray-500"></i>
                </button>
                <div id="user-dropdown-menu" class="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded shadow-lg opacity-0 pointer-events-none transition z-50">
                    <div class="px-4 py-2 text-sm text-gray-500 border-b"><?= $roleMenus[$role] ?? '' ?></div>
                    <a href="logout.php" class="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:underline">Uitloggen</a>
                </div>
            </div>
            <!-- Mobile menu button -->
            <button id="mobile-menu-button" class="md:hidden text-gray-600 hover:text-green-700 focus:outline-none">
                <i class="fas fa-bars text-2xl"></i>
            </button>
        </div>
    </div>
    <!-- Mobile Nav -->
    <div id="mobile-menu" class="md:hidden hidden bg-white border-t border-gray-200">
        <nav class="flex flex-col px-4 py-2 space-y-1">
            <?php foreach ($currentMenu as $item): ?>
                <?php
                    if (is_array($item)) {
                        $href = strtolower($item['link']) . '.php';
                        $label = $item['label'];
                    } else {
                        $href = strtolower($item) . '.php';
                        $label = ucfirst($item);
                    }
                ?>
                <a
                    href="<?= htmlspecialchars($href) ?>"
                    class="text-gray-700 hover:text-green-600 px-2 py-2 rounded hover:bg-green-50 transition hover:underline"
                >
                    <?= htmlspecialchars($label) ?>
                </a>
            <?php endforeach; ?>
            <a href="logout.php" class="text-gray-700 hover:text-green-600 px-2 py-2 rounded hover:bg-green-50 transition hover:underline">Uitloggen</a>
        </nav>
    </div>
</header>
<script>
function handleHeaderSearch(event) {
    event.preventDefault();
    const query = document.getElementById('header-search').value.toLowerCase().trim();
    const pages = {
        'medewerkers': 'medewerkers.php',
        'producten': 'producten.php',
        'klanten': 'klanten.php',
        'leveranciers': 'leveranciers.php',
        'voedselpakketten': 'voedselpakketten.php',
        'account': 'create-account.php',
        'dashboard': 'dashboard.php'
    };
    if (pages[query]) {
        window.location.href = pages[query];
    } else {
        alert('Pagina niet gevonden.');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if(menuButton && mobileMenu) {
        menuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // User dropdown toggle
    const userBtn = document.getElementById('user-dropdown-btn');
    const userMenu = document.getElementById('user-dropdown-menu');
    document.addEventListener('click', function(e) {
        if (userBtn && userMenu) {
            if (userBtn.contains(e.target)) {
                userMenu.classList.toggle('opacity-0');
                userMenu.classList.toggle('pointer-events-none');
            } else if (!userMenu.contains(e.target)) {
                userMenu.classList.add('opacity-0');
                userMenu.classList.add('pointer-events-none');
            }
        }
    });
});
</script>
<style>
a{
    text-decoration: none !important;}
    </style>
<?php } // End of if logged in check ?>
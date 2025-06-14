<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Only display header if user is logged in
if (isset($_SESSION['valid']) && $_SESSION['valid'] === true) {
    $role = $_SESSION['role'] ?? null;
    $username = $_SESSION['username'] ?? 'Gebruiker';

    $roleMenus = [
        'directie' => 'Admin',
        'magazijnmedewerker' => 'Magazijnmedewerker',
        'vrijwilliger' => 'Vrijwilliger'
    ];

    $menuItems = [
        'directie' => ['klanten', 'medewerkers', 'leveranciers', 'producten', 'voedselpakketten', 'index-vrijwilliger'],
        'magazijnmedewerker' => ['leveranciers', 'producten'],
        'vrijwilliger' => ['voedselpakketten', 'index-vrijwilliger']
    ];

    $menuDisplayNames = [
        'index-vrijwilliger' => 'Voedselpakket maken',
    ];

    $currentMenu = $menuItems[$role] ?? [];

    $homeLinks = [
        'directie' => '/directie-home.php',
        'magazijnmedewerker' => '/producten.php',
        'vrijwilliger' => '/index-vrijwilliger.php'
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
                <a
                    href="/<?= strtolower($item) ?>.php"
                    class="text-gray-700 hover:text-green-600 transition-colors font-medium px-2 py-1 rounded hover:bg-green-50 hover:underline"
                >
                    <?= $menuDisplayNames[$item] ?? ucfirst($item) ?>
                </a>
            <?php endforeach; ?>
        </nav>
        <!-- Search + User -->
        <div class="flex items-center space-x-4">
            
        <!-- User Dropdown -->
            <div class="relative" id="user-dropdown-parent">
                <button id="user-dropdown-btn" type="button" class="flex items-center space-x-2 px-3 py-2 rounded hover:bg-green-50 transition focus:outline-none">
                    <i class="fas fa-user-circle text-green-600 text-xl"></i>
                    <span class="hidden sm:inline text-gray-700"><?= htmlspecialchars($username) ?></span>
                    <i class="fas fa-chevron-down text-xs text-gray-500"></i>
                </button>
                <div id="user-dropdown-menu" class="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded shadow-lg opacity-0 pointer-events-none transition z-50">
                    <div class="px-4 py-2 text-sm text-gray-500 border-b"><?= $roleMenus[$role] ?? '' ?></div>
                    <a href="/php/change-password.php" class="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:underline">Wachtwoord wijzigen</a>
                    <a href="/logout.php" class="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:underline">Uitloggen</a>
                </div>
            </div>

        </div>
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
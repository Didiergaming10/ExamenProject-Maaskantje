<?php
// auth.php  – single gate-keeper for login + role checks
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}


/* ------------------------------------------------------------------
   BASIC AUTHENTICATION
   ------------------------------------------------------------------ */
if (
    !isset($_SESSION['valid']) || $_SESSION['valid'] !== true ||
    !isset($_SESSION['user_id'])
) {
    header('Location: index.php');   // never point back to the same page
    exit();
}

/* ------------------------------------------------------------------
   ROLE-BASED ACCESS CONTROL (RBAC)
   ------------------------------------------------------------------ */
// ROLE-BASED ACCESS CONTROL
if (isset($required_roles)) {
    if (!in_array($_SESSION['role'], $required_roles, true)) {
        redirectToRoleHome();
    }
} elseif (isset($required_role)) {
    if ($_SESSION['role'] !== $required_role) {
        redirectToRoleHome();
    }
}

// Function to redirect based on role
function redirectToRoleHome() {
    $role = $_SESSION['role'] ?? '';

    switch ($role) {
        case 'directie':
            header('Location: directie-home.php');
            break;
        case 'vrijwilliger':
            header('Location: voedselpakketten.php');
            break;
        case 'magazijnmedewerker':
            header('Location: producten.php');
            break;
        default:
            header('Location: index.php'); // fallback if unknown role
    }
    exit();
}

/* ------------------------------------------------------------------
   USER STILL EXISTS?
   ------------------------------------------------------------------ */
$user_id = $_SESSION['user_id'];
$stmt    = $conn->prepare('SELECT id FROM gebruikers WHERE id = ?');
$stmt->bind_param('i', $user_id);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 0) {
    // user was deleted while logged in → clear session & bounce
    session_unset();
    session_destroy();

    if (ini_get('session.use_cookies')) {
        $p = session_get_cookie_params();
        setcookie(session_name(), '', time()-42000,
            $p['path'], $p['domain'], $p['secure'], $p['httponly']
        );
    }
    header('Location: index.php?reason=deleted');
    exit();
}
?>

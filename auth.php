<?php
// auth.php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Redirect to login if not authenticated
if (!isset($_SESSION['valid']) || $_SESSION['valid'] !== true) {
    header('Location: index.php');
    exit;
}

?>
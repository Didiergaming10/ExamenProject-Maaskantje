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

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

// Controleer of gebruiker nog bestaat
$user_id = $_SESSION['user_id'];
$stmt = $conn->prepare("SELECT id FROM gebruikers WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 0) {
    // Gebruiker bestaat niet meer, log uit
    session_unset();
    session_destroy();
    header("Location: login.php?reason=deleted");
    exit();
}
?>
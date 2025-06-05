<?php
session_start();
include 'php/connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['id'])) {
    $id = (int)$_POST['id'];

    // Verwijder medewerker uit database
    $stmt = $conn->prepare("DELETE FROM gebruikers WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();

    // Check of de verwijderde gebruiker de huidige gebruiker is
    if (isset($_SESSION['user_id']) && $_SESSION['user_id'] == $id) {
        session_unset();
        session_destroy();
        header("Location: login.php");
        exit();
    }

    // Anders terug naar medewerkerslijst
    header("Location: medewerkers.php");
    exit();
}
?>

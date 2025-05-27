<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['id'])) {
    $id = intval($_POST['id']);

    // Databaseverbinding
    $conn = new mysqli("mysql", "root", "password", "Eindproject");

    if ($conn->connect_error) {
        die("Verbinding mislukt: " . $conn->connect_error);
    }

    // Verwijder de gebruiker met het opgegeven ID
    $stmt = $conn->prepare("DELETE FROM gebruikers WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        // Na verwijderen terug naar medewerkersoverzicht
        header("Location: medewerkers.php");
        exit();
    } else {
        echo "Fout bij verwijderen: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
} else {
    echo "Ongeldig verzoek.";
}
?>

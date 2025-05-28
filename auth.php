<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_id'])) {
    header('Location: index.php');
    exit();
}

function require_role($allowed_roles) {
    if (!in_array($_SESSION['role'], $allowed_roles)) {
        header('Location: index.php'); 
        exit();
    }
}
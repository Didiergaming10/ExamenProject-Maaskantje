<?php
$servername = "mysql";
$username = "root";
$password = "password";
$db = "Eindproject";

$conn = new mysqli($servername, $username, $password, $db);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$sql ="select * from producten";
$res = $conn->query($sql);
$data = [];
while ($row = $res->fetch_assoc()) {
    array_push($data, $row);
}
echo json_encode($data);

?>

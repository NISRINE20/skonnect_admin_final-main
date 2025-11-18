<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$host = "localhost";
$user = "root";
$password = "";
$dbname = "skonnect"; // <-- change this to your database name

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
  die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$sql = "SELECT id, full_name, birthdate, gender, contact, interests, email FROM youth_users";
$result = $conn->query($sql);

$youths = [];

if ($result->num_rows > 0) {
  while($row = $result->fetch_assoc()) {
    $youths[] = $row;
  }
}

echo json_encode($youths);

$conn->close();
?>

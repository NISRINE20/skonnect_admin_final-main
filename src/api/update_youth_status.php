<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$host = "localhost";
$user = "root";
$password = "";
$dbname = "skonnect";

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['id']) && isset($data['status'])) {
    $id = $conn->real_escape_string($data['id']);
    $status = $conn->real_escape_string($data['status']);
    
    $sql = "UPDATE youth_users SET status = '$status' WHERE id = $id";
    
    if ($conn->query($sql)) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["error" => "Update failed"]);
    }
} else {
    echo json_encode(["error" => "Invalid data"]);
}

$conn->close();
?>
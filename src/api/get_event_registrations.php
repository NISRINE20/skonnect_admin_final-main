<?php
// filepath: c:\xampp\htdocs\skonnect-api\get_event_registrations.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$host = "localhost";
$user = "root";
$password = "";
$dbname = "skonnect";

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Database connection failed']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$event_id = $data['event_id'] ?? null;

if (!$event_id) {
    echo json_encode(['success' => false, 'error' => 'Missing event_id']);
    exit;
}

$stmt = $conn->prepare("SELECT id, full_name, email, contact, registered_at FROM event_registrations WHERE event_id = ? ORDER BY registered_at DESC");
$stmt->bind_param("i", $event_id);
$stmt->execute();
$result = $stmt->get_result();

$participants = [];
while ($row = $result->fetch_assoc()) {
    $participants[] = $row;
}

echo json_encode(['success' => true, 'participants' => $participants]);
$stmt->close();
$conn->close();
?>
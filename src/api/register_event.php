<?php
// filepath: c:\xampp\htdocs\skonnect-api\register_event.php

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
$full_name = $data['full_name'] ?? '';
$email = $data['email'] ?? '';
$contact = $data['contact'] ?? '';

if (!$event_id || !$full_name || !$email) {
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

// Optional: Prevent duplicate registration for same event/email
$stmt = $conn->prepare("SELECT id FROM event_registrations WHERE event_id = ? AND email = ?");
$stmt->bind_param("is", $event_id, $email);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    echo json_encode(['success' => false, 'error' => 'You have already registered for this event.']);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();

$stmt = $conn->prepare("INSERT INTO event_registrations (event_id, full_name, email, contact) VALUES (?, ?, ?, ?)");
$stmt->bind_param("isss", $event_id, $full_name, $email, $contact);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $conn->error]);
}

$stmt->close();
$conn->close();
?>
<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $title = $conn->real_escape_string($data['title']);
    $msg = $conn->real_escape_string($data['message']);
    $type = $conn->real_escape_string($data['type']);
    $conn->query("INSERT INTO announcements (title, message, type, created_at) VALUES ('$title', '$msg', '$type', NOW())");
    echo json_encode(['status' => 'ok']);
    exit;
}

$res = $conn->query("SELECT title, message, type, created_at FROM announcements ORDER BY created_at DESC");
$announcements = [];
while ($row = $res->fetch_assoc()) {
    $announcements[] = $row;
}
echo json_encode($announcements);
?>
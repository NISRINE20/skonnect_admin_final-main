<?php
// filepath: c:\xampp\htdocs\skonnect-api\delete_announcement.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);
$id = intval($data['id']);
if ($id > 0) {
    $conn->query("DELETE FROM announcements WHERE id = $id");
    echo json_encode(['status' => 'deleted']);
} else {
    echo json_encode(['status' => 'error']);
}
?>
<?php
// filepath: c:\xampp\htdocs\skonnect-api\fetch_attendance.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

include 'db.php'; // your DB connection file

$event_id = isset($_GET['event_id']) ? intval($_GET['event_id']) : 0;
$attendance = [];

if ($event_id) {
    $res = $conn->query("SELECT user_id, full_name, timestamp FROM attendance WHERE event_id = $event_id ORDER BY timestamp ASC");
    while ($row = $res->fetch_assoc()) {
        $attendance[] = $row;
    }
}

echo json_encode(['attendance' => $attendance]);
?>
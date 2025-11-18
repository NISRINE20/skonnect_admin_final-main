<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$host = "localhost";
$user = "root";
$password = "";
$dbname = "skonnect";

$conn = new mysqli($host, $user, $password, $dbname);

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['event_id'])) {
    $event_id = intval($_GET['event_id']);
    $result = $conn->query("SELECT * FROM event_form_fields WHERE event_id = $event_id ORDER BY sort_order ASC");
    
    $fields = [];
    while ($row = $result->fetch_assoc()) {
        $fields[] = $row;
    }

    echo json_encode(['success' => true, 'fields' => $fields]);
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request']);
}
?>

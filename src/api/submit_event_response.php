<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$host = "localhost";
$user = "root";
$password = "";
$dbname = "skonnect";

$conn = new mysqli($host, $user, $password, $dbname);
$data = json_decode(file_get_contents("php://input"), true);

$event_id = intval($data['event_id']);
$user_email = $conn->real_escape_string($data['email']);
$responses = $data['responses'];

foreach ($responses as $field_name => $response) {
    $field = $conn->real_escape_string($field_name);
    $value = $conn->real_escape_string($response);

    $conn->query("INSERT INTO event_form_responses (event_id, user_email, field_name, response)
                  VALUES ($event_id, '$user_email', '$field', '$value')");
}

echo json_encode(['success' => true]);
?>

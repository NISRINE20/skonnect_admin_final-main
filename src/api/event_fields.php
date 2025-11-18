<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);
$event_id = $data['event_id'];
$fields = $data['fields'];

foreach ($fields as $index => $field) {
    $label = $conn->real_escape_string($field['label']);
    $type = $conn->real_escape_string($field['type']);
    $required = $field['required'] ? 1 : 0;
    $name = strtolower(str_replace(' ', '_', $label));
    $sort_order = $index;

    $conn->query("INSERT INTO event_form_fields (event_id, label, name, type, required, sort_order)
                  VALUES ($event_id, '$label', '$name', '$type', $required, $sort_order)");
}

echo json_encode(['success' => true]);

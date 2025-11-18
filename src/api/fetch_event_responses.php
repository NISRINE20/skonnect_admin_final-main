<?php
header('Content-Type: application/json');

// ✅ Direct database connection (without db.php)
$host = "localhost";
$user = "root";
$password = "";
$dbname = "skonnect";

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

// ✅ Check if event_id is provided
if (!isset($_GET['event_id'])) {
    echo json_encode(['success' => false, 'message' => 'Event ID is required']);
    exit;
}

$event_id = intval($_GET['event_id']);

// ✅ Fetch distinct emails of participants
$usersQuery = $conn->prepare("SELECT DISTINCT email FROM event_responses WHERE event_id = ?");
$usersQuery->bind_param("i", $event_id);
$usersQuery->execute();
$usersResult = $usersQuery->get_result();

$participants = [];

while ($user = $usersResult->fetch_assoc()) {
    $email = $user['email'];

    // Fetch responses for each email
    $responseQuery = $conn->prepare("SELECT field_name, response FROM event_responses WHERE event_id = ? AND email = ?");
    $responseQuery->bind_param("is", $event_id, $email);
    $responseQuery->execute();
    $responseResult = $responseQuery->get_result();

    $responses = [];
    while ($row = $responseResult->fetch_assoc()) {
        $responses[$row['field_name']] = $row['response'];
    }

    $participants[] = [
        'email' => $email,
        'responses' => $responses
    ];
}

echo json_encode([
    'success' => true,
    'participants' => $participants
]);

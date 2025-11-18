<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'db.php'; // your DB connection file

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents("php://input");
    $data = json_decode($raw, true);

    $user_id = 'admin';
    $sender = $data['sender'] ?? '';
    $message = $data['message'] ?? '';

    if (!$sender || !$message) {
        echo json_encode(['success' => false, 'error' => 'Missing sender or message']);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO chatbot_messages (user_id, sender, message) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $user_id, $sender, $message);
    $stmt->execute();

    echo json_encode(['success' => true]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Only display admin responses
    $res = $conn->query("SELECT * FROM chatbot_messages WHERE user_id='admin' ORDER BY timestamp ASC");
    $messages = [];
    while ($row = $res->fetch_assoc()) {
        $messages[] = $row;
    }
    echo json_encode($messages);
    exit;
}
?>
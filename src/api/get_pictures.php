<?php
// Set headers
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Database config
$host = '127.0.0.1';
$db   = 'skonnect_db';
$user = 'db_user';
$pass = 'db_pass';
$charset = 'utf8mb4';

// Setup PDO
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);

    // Query profile pictures
    $stmt = $pdo->prepare('SELECT id, email, image, uploaded_at FROM profile_pictures ORDER BY uploaded_at DESC');
    $stmt->execute();
    $rows = $stmt->fetchAll();

    // Convert BLOB image to base64
    foreach ($rows as &$row) {
        $row['image'] = base64_encode($row['image']);
    }

    echo json_encode($rows);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch profile pictures']);
}

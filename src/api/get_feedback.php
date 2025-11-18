<?php
// Set response headers
header('Content-Type: application/json; charset=utf-8');
// Optional CORS - restrict origin in production
header('Access-Control-Allow-Origin: *');

// Allow only GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Database configuration
$host = '127.0.0.1';
$db   = 'skonnect';
$user = '';
$pass = '';
$charset = 'utf8mb4';

// DSN and PDO options
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

// Connect and query
try {
    $pdo = new PDO($dsn, $user, $pass, $options);

    $stmt = $pdo->prepare('SELECT id, name, email, message, ip, user_agent, created_at FROM feedback ORDER BY created_at DESC');
    $stmt->execute();
    $feedback = $stmt->fetchAll();

    echo json_encode($feedback);
} catch (PDOException $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(['error' => 'Database connection failed']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch feedback']);
}

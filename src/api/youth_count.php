<?php
// filepath: skonnect-api/youth_count.php

// Allow CORS and set JSON header
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// DB connection details (replace with your actual credentials)
$host = "localhost";
$user = "root";
$password = ""; // default XAMPP password
$dbname = "skonnect"; // <-- change this to your actual DB name

// Create connection
$conn = new mysqli($host, $user, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

// Query to count youth users
$sql = "SELECT COUNT(*) as count FROM youth_users";
$result = $conn->query($sql);

// Return JSON response
if ($result) {
    $row = $result->fetch_assoc();
    echo json_encode(['count' => intval($row['count'])]);
} else {
    echo json_encode(['count' => 0]);
}

// Close connection
$conn->close();
?>

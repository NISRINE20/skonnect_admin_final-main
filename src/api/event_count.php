<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$host = "localhost";
$user = "root";
$password = "";
$dbname = "skonnect";

$conn = new mysqli($host, $user, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

// Total events
$sql_total = "SELECT COUNT(*) as count FROM events";
$result_total = $conn->query($sql_total);
$total = $result_total ? intval($result_total->fetch_assoc()['count']) : 0;

// Events created in last 30 days
$sql_recent = "SELECT COUNT(*) as count FROM events WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
$result_recent = $conn->query($sql_recent);
$recent = $result_recent ? intval($result_recent->fetch_assoc()['count']) : 0;

// Events created in previous 30 days (31-60 days ago)
$sql_prev = "SELECT COUNT(*) as count FROM events WHERE created_at >= DATE_SUB(NOW(), INTERVAL 60 DAY) AND created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)";
$result_prev = $conn->query($sql_prev);
$prev = $result_prev ? intval($result_prev->fetch_assoc()['count']) : 0;

// Calculate percent increase
$increase_percent = 0;
if ($prev > 0) {
    $increase_percent = round((($recent - $prev) / $prev) * 100, 2);
} elseif ($recent > 0) {
    $increase_percent = 100;
}

echo json_encode([
    'count' => $total,
    'count_30days' => $recent,
    'increase_percent' => $increase_percent
]);

$conn->close();
?>
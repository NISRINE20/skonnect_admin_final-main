<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$host = "localhost";
$user = "root";
$password = "";
$dbname = "skonnect";

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Get total messages count (excluding admin)
$total_query = "SELECT COUNT(*) as total 
                FROM chatbot_messages 
                WHERE user_id != 'admin'";
                
$total_result = $conn->query($total_query);
$total_data = $total_result->fetch_assoc();

// Get messages per month
$monthly_query = "SELECT 
                    MONTH(created_at) as month,
                    COUNT(*) as count
                 FROM chatbot_messages 
                 WHERE user_id != 'admin'
                 AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
                 GROUP BY MONTH(created_at)
                 ORDER BY month";

$monthly_result = $conn->query($monthly_query);
$monthly_data = [];

while($row = $monthly_result->fetch_assoc()) {
    $monthly_data[] = $row;
}

// Calculate percentage change from last month
$change_query = "SELECT 
    (SELECT COUNT(*) 
     FROM chatbot_messages 
     WHERE user_id != 'admin'
     AND MONTH(created_at) = MONTH(CURRENT_DATE)) as this_month,
    (SELECT COUNT(*) 
     FROM chatbot_messages 
     WHERE user_id != 'admin'
     AND MONTH(created_at) = MONTH(DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH))) as last_month";

$change_result = $conn->query($change_query);
$change_data = $change_result->fetch_assoc();

$percent_change = 0;
if ($change_data['last_month'] > 0) {
    $percent_change = (($change_data['this_month'] - $change_data['last_month']) / $change_data['last_month']) * 100;
}

echo json_encode([
    "total" => $total_data['total'],
    "monthly_data" => $monthly_data,
    "percent_change" => round($percent_change, 2)
]);

$conn->close();
?>
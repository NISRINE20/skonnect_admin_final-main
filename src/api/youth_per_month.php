<?php
// filepath: c:\xampp\htdocs\skonnect-api\youths_per_month.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include 'db.php'; // your DB connection

$months = [];
$res = $conn->query("
    SELECT MONTH(created_at) AS month, COUNT(*) AS count
    FROM youth_users
    WHERE YEAR(created_at) = YEAR(CURDATE())
    GROUP BY MONTH(created_at)
    ORDER BY MONTH(created_at)
");
while ($row = $res->fetch_assoc()) {
    $months[] = [
        'month' => $row['month'],
        'count' => $row['count']
    ];
}
echo json_encode($months);
?>
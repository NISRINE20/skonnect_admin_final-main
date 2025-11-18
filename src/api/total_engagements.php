<?php
header('Content-Type: application/json');

// Update these DB credentials to match your environment
$host = 'localhost';
$db   = 'skonnect';
$user = 'root';
$pass = '';
$dsn  = "mysql:host=$host;dbname=$db;charset=utf8mb4";

try {
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    // Total unique engagements (per event + identifier)
    $sql_total = "
        SELECT COUNT(*) AS total FROM (
            SELECT CONCAT(event_id, '|', COALESCE(user_email, '')) AS keyid FROM event_form_responses
            UNION
            SELECT CONCAT(event_id, '|', CAST(user_id AS CHAR)) AS keyid FROM attendance
        ) t
    ";
    $total = (int) $pdo->query($sql_total)->fetchColumn();

    // Last 30 days unique engagements
    $sql_last30 = "
        SELECT COUNT(*) AS total FROM (
            SELECT CONCAT(event_id, '|', COALESCE(user_email, '')) AS keyid FROM event_form_responses
            WHERE submitted_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            UNION
            SELECT CONCAT(event_id, '|', CAST(user_id AS CHAR)) AS keyid FROM attendance
            WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        ) t
    ";
    $last30 = (int) $pdo->query($sql_last30)->fetchColumn();

    // Previous 30-60 day period unique engagements
    $sql_prev30 = "
        SELECT COUNT(*) AS total FROM (
            SELECT CONCAT(event_id, '|', COALESCE(user_email, '')) AS keyid FROM event_form_responses
            WHERE submitted_at >= DATE_SUB(NOW(), INTERVAL 60 DAY)
              AND submitted_at < DATE_SUB(NOW(), INTERVAL 30 DAY)
            UNION
            SELECT CONCAT(event_id, '|', CAST(user_id AS CHAR)) AS keyid FROM attendance
            WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 60 DAY)
              AND timestamp < DATE_SUB(NOW(), INTERVAL 30 DAY)
        ) t
    ";
    $prev30 = (int) $pdo->query($sql_prev30)->fetchColumn();

    // percent change calculation
    if ($prev30 == 0) {
        if ($last30 == 0) {
            $percent_change = 0;
        } else {
            $percent_change = 100;
        }
    } else {
        $percent_change = round((($last30 - $prev30) / max(1, $prev30)) * 100, 2);
    }

    // optional: also return raw counts from each table
    $form_count = (int) $pdo->query("SELECT COUNT(*) FROM event_form_responses")->fetchColumn();
    $attendance_count = (int) $pdo->query("SELECT COUNT(*) FROM attendance")->fetchColumn();

    echo json_encode([
        'total' => $total,
        'percent_change' => $percent_change,
        'last_30_days' => $last30,
        'previous_30_days' => $prev30,
        'form_count' => $form_count,
        'attendance_count' => $attendance_count
    ]);
    exit;
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'DB error', 'message' => $e->getMessage()]);
    exit;
}
?>
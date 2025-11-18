<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli('localhost', 'root', '', 'skonnect');

if ($conn->connect_error) {
    die(json_encode(['status' => 'error', 'message' => 'Connection failed: ' . $conn->connect_error]));
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // First get main events
    $sql = "SELECT id, title, description, created_at FROM main_events ORDER BY created_at DESC";
    $result = $conn->query($sql);
    
    $events = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            // Get sub-events for this main event
            $subEventsSql = "SELECT id, title, description, date, time, location, image, status, points, created_at, event_type 
                           FROM sub_events 
                           WHERE main_event_id = ? 
                           ORDER BY date, time";
            
            $stmt = $conn->prepare($subEventsSql);
            $stmt->bind_param("i", $row['id']);
            $stmt->execute();
            $res = $stmt->get_result();
            $subEvents = $res->fetch_all(MYSQLI_ASSOC);

            // Encode image blob for each sub-event (or set null)
            foreach ($subEvents as &$sub) {
                if (isset($sub['image']) && $sub['image'] !== null && $sub['image'] !== '') {
                    // base64 encode the raw blob. Leave without data: prefix; Flutter will handle both.
                    $sub['image'] = base64_encode($sub['image']);
                } else {
                    $sub['image'] = null;
                }
            }
            unset($sub); // break reference

            $stmt->close();
            
            $events[] = [
                'id' => $row['id'],
                'title' => $row['title'],
                'description' => $row['description'],
                'created_at' => $row['created_at'],
                'sub_events' => $subEvents
            ];
        }
    }
    
    echo json_encode(['status' => 'success', 'main_events' => $events]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}

$conn->close();
?>
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET");

$host = "localhost";
$user = "root";
$password = "";
$dbname = "skonnect"; // Change to your DB name

$conn = new mysqli($host, $user, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed"]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT id, title, description, date, time, location, 
                   TO_BASE64(image) AS image 
            FROM events ORDER BY date DESC";
    $result = $conn->query($sql);

    $events = [];
    while ($row = $result->fetch_assoc()) {
        $row['image'] = $row['image'] ? 'data:image/jpeg;base64,' . $row['image'] : null;
        $events[] = $row;
    }
    echo json_encode($events);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'];
    $desc = $_POST['description'];
    $date = $_POST['date'];
    $time = $_POST['time'];
    $location = $_POST['location'];

    $image = isset($_FILES['image']) ? file_get_contents($_FILES['image']['tmp_name']) : null;
    $stmt = $conn->prepare("INSERT INTO events (title, description, date, time, location, image) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $title, $desc, $date, $time, $location, $null);

    // If image exists, bind as blob
    if ($image) {
        $stmt->send_long_data(5, $image);
    } else {
        $null = null;
    }

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => $stmt->error]);
    }

    $stmt->close();
}

$conn->close();
?>

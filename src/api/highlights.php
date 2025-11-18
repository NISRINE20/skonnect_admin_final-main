<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

include 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT id, title, description, article_text, created_at, 
            CONCAT('data:image/jpeg;base64,', TO_BASE64(image)) as image 
            FROM highlights ORDER BY created_at DESC";
    $result = $conn->query($sql);
    $highlights = [];
    
    while($row = $result->fetch_assoc()) {
        $highlights[] = $row;
    }
    
    echo json_encode($highlights);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $title = $data['title'];
    $description = $data['description'];
    $articleText = $data['articleText'];
    
    // Extract the base64 image data
    $image = $data['image'];
    
    // Remove data URL prefix if present
    if (strpos($image, 'data:') === 0) {
        $image = preg_replace('/^data:image\/\w+;base64,/', '', $image);
    }
    
    // Decode base64 image
    $imageBinary = base64_decode($image);
    
    if (!$imageBinary) {
        echo json_encode(['success' => false, 'error' => 'Invalid image data']);
        exit;
    }
    
    // Validate image size (optional)
    if (strlen($imageBinary) > 5000000) { // 5MB limit
        echo json_encode(['success' => false, 'error' => 'Image too large']);
        exit;
    }
    
    $sql = "INSERT INTO highlights (image, title, description, article_text, created_at) 
            VALUES (?, ?, ?, ?, NOW())";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss", $imageBinary, $title, $description, $articleText);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Highlight added successfully'
        ]);
    } else {
        echo json_encode([
            'success' => false, 
            'error' => $conn->error
        ]);
    }
    
    $stmt->close();
}

$conn->close();
?>

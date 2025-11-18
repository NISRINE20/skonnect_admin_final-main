<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$host = 'localhost';
$user = 'root';
$password = '';
$database = 'skonnect_db';

try {
    $conn = new PDO("mysql:host=$host;dbname=$database", $user, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['id']) || !isset($data['title']) || !isset($data['description']) || !isset($data['articleText'])) {
        throw new Exception('Missing required fields');
    }

    $id = $data['id'];
    $title = $data['title'];
    $description = $data['description'];
    $articleText = $data['articleText'];
    
    // Handle image update
    $imageQuery = '';
    $params = [
        'id' => $id,
        'title' => $title,
        'description' => $description,
        'article_text' => $articleText
    ];

    // Only update image if a new one is provided
    if (isset($data['image']) && !empty($data['image'])) {
        $image = $data['image'];
        // Convert base64 image to binary
        $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $image));
        $imageQuery = ', image = :image';
        $params['image'] = $imageData;
    }

    $sql = "UPDATE highlights SET 
            title = :title,
            description = :description,
            article_text = :article_text" . 
            $imageQuery . 
            " WHERE id = :id";

    $stmt = $conn->prepare($sql);
    $result = $stmt->execute($params);

    if ($result) {
        echo json_encode(['success' => true, 'message' => 'Highlight updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update highlight']);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
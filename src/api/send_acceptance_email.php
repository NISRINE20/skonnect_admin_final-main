<?php
// send_acceptance_email.php
// Simple endpoint to send acceptance confirmation emails.
header('Content-Type: application/json');
// Allow local dev origins — adjust in production
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // CORS preflight
    http_response_code(200);
    exit;
}

$raw = file_get_contents('php://input');
$input = json_decode($raw, true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON input']);
    exit;
}

$email = isset($input['email']) ? filter_var($input['email'], FILTER_VALIDATE_EMAIL) : false;
$full_name = isset($input['full_name']) ? trim($input['full_name']) : '';
$youth_id = isset($input['id']) ? $input['id'] : null;

if (!$email) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing or invalid email']);
    exit;
}

$subject = 'Skonnect Registration Accepted';
$message = "Hello " . ($full_name ?: 'Participant') . ",\n\n" .
    "Congratulations! Your registration has been accepted.\n\n" .
    "You can now participate in Skonnect activities and we'll keep you updated on upcoming events.\n\n" .
    "If you have any questions, please reply to this email.\n\n" .
    "Best regards,\nSkonnect Team";

// Basic headers. In production use a proper SMTP service or library (PHPMailer, etc.).
$headers = 'From: no-reply@skonnect.local' . "\r\n" .
    'Reply-To: no-reply@skonnect.local' . "\r\n" .
    'X-Mailer: PHP/' . phpversion();

// Attempt to send email
$success = false;
try {
    $success = mail($email, $subject, $message, $headers);
} catch (Exception $e) {
    // swallow exception and report false
    $success = false;
}

if ($success) {
    echo json_encode(['success' => true, 'message' => 'Email sent']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to send email']);
}

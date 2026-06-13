<?php
// Enable error reporting (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

include 'config.php';

$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data['userId'])) {
    echo json_encode(["success" => false, "message" => "Missing userId"]);
    exit();
}

$userId = $data['userId'];

// Delete any related record in faculty_status first
$stmt1 = $conn->prepare("DELETE FROM faculty_status WHERE user_id = ?");
if (!$stmt1) {
    echo json_encode(["success" => false, "message" => "Prepare failed for faculty_status: " . $conn->error]);
    exit();
}
$stmt1->bind_param("i", $userId);
$stmt1->execute();
$stmt1->close();

// Now delete the user from the users table
$stmt2 = $conn->prepare("DELETE FROM users WHERE id = ?");
if (!$stmt2) {
    echo json_encode(["success" => false, "message" => "Prepare failed for users: " . $conn->error]);
    exit();
}
$stmt2->bind_param("i", $userId);

if ($stmt2->execute()) {
    echo json_encode(["success" => true, "message" => "User deleted successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Deletion failed: " . $stmt2->error]);
}

$stmt2->close();
$conn->close();
?>

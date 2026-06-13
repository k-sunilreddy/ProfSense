<?php
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
if (!isset($data['userId']) || !isset($data['status'])) {
    echo json_encode(array("success" => false, "message" => "Missing required fields."));
    exit;
}

$userId = $data['userId'];
$status = $data['status'];
$availableFrom = isset($data['availableFrom']) ? $data['availableFrom'] : "";
$availableTo = isset($data['availableTo']) ? $data['availableTo'] : "";

// Check if a row already exists in faculty_status for this userId
$stmt = $conn->prepare("SELECT id FROM faculty_status WHERE user_id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();
$stmt->close();

if ($result->num_rows > 0) {
    // Update existing record
    $stmt = $conn->prepare("UPDATE faculty_status SET status = ?, availableFrom = ?, availableTo = ? WHERE user_id = ?");
    $stmt->bind_param("sssi", $status, $availableFrom, $availableTo, $userId);
} else {
    // Insert new record
    $stmt = $conn->prepare("INSERT INTO faculty_status (user_id, status, availableFrom, availableTo) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("isss", $userId, $status, $availableFrom, $availableTo);
}

if ($stmt->execute()) {
    echo json_encode(array("success" => true, "message" => "Status updated successfully", "status" => $status));
} else {
    echo json_encode(array("success" => false, "message" => "Failed to update status: " . $stmt->error));
}
$stmt->close();
$conn->close();
?>

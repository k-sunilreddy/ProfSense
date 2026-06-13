<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}
include 'config.php';

$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    echo json_encode(["success" => false, "message" => "No data received"]);
    exit();
}
if (!isset($data['EmpId'], $data['Password'])) {
    echo json_encode(["success" => false, "message" => "Missing credentials"]);
    exit();
}

$empId = $data['EmpId'];
$password = $data['Password'];

$stmt = $conn->prepare("SELECT * FROM users WHERE emp_id = ?");
$stmt->bind_param("s", $empId);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if ($user && password_verify($password, $user['password'])) {
    echo json_encode(["success" => true, "message" => "Login successful", "user" => $user]);
} else {
    echo json_encode(["success" => false, "message" => "Invalid credentials"]);
}

$stmt->close();
$conn->close();
?>

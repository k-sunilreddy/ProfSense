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

// Require fields: EmpId, Name, Designation, Password
if (!isset($data['EmpId'], $data['Name'], $data['Designation'], $data['Password'])) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit();
}

$empId = $data['EmpId'];
// Prevent registration if emp_id is "admin"
if (strtolower($empId) === "admin") {
    echo json_encode(["success" => false, "message" => "Registration for admin is not allowed"]);
    exit();
}
$name = $data['Name'];
$designation = $data['Designation']; 
$password = password_hash($data['Password'], PASSWORD_BCRYPT);

// Changed 'email' to 'department' to match your DB schema columns
$stmt = $conn->prepare("INSERT INTO users (emp_id, name, department, password) VALUES (?, ?, ?, ?)");
if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Prepare failed: " . $conn->error]);
    exit();
}
$stmt->bind_param("ssss", $empId, $name, $designation, $password);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Registration successful"]);
} else {
    echo json_encode(["success" => false, "message" => "Error: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>

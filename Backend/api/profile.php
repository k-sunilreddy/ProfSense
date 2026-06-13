<?php
// Enable error reporting for debugging (remove or adjust for production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

include 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    if (isset($_GET['userId'])) {
        $userId = $_GET['userId'];
        $stmt = $conn->prepare("SELECT id, emp_id, name, email, department FROM users WHERE id = ?");
        if (!$stmt) {
            echo json_encode(["success" => false, "message" => "Prepare statement error: " . $conn->error]);
            exit();
        }
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            echo json_encode(["success" => true, "user" => $user]);
        } else {
            echo json_encode(["success" => false, "message" => "User not found"]);
        }
        $stmt->close();
    } else {
        echo json_encode(["success" => false, "message" => "No userId provided"]);
    }
} elseif ($method == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) {
        echo json_encode(["success" => false, "message" => "No data received"]);
        exit();
    }
    // Require userId and Name; Department is optional (will default to an empty string if not provided)
    if (!isset($data['userId']) || !isset($data['Name'])) {
        echo json_encode(["success" => false, "message" => "Missing required fields"]);
        exit();
    }

    $userId = $data['userId'];
    $name = $data['Name'];
    $department = isset($data['Department']) ? $data['Department'] : "";

    // If a new password is provided (for admin), update password as well.
    if (isset($data['Password']) && !empty($data['Password'])) {
        $newPassword = password_hash($data['Password'], PASSWORD_BCRYPT);
        $stmt = $conn->prepare("UPDATE users SET name = ?, department = ?, password = ? WHERE id = ?");
        if (!$stmt) {
            echo json_encode(["success" => false, "message" => "Prepare statement error: " . $conn->error]);
            exit();
        }
        $stmt->bind_param("sssi", $name, $department, $newPassword, $userId);
    } else {
        $stmt = $conn->prepare("UPDATE users SET name = ?, department = ? WHERE id = ?");
        if (!$stmt) {
            echo json_encode(["success" => false, "message" => "Prepare statement error: " . $conn->error]);
            exit();
        }
        $stmt->bind_param("ssi", $name, $department, $userId);
    }

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Profile updated"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to update profile: " . $stmt->error]);
    }
    $stmt->close();
}

$conn->close();
?>

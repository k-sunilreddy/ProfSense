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

$defaultStatus = "Not Updated";
$defaultFrom = "";  // Clear availableFrom
$defaultTo = "";    // Clear availableTo

// 1. Update existing rows for non-admin users
$sql1 = "UPDATE faculty_status SET status = ?, availableFrom = ?, availableTo = ?
         WHERE user_id IN (SELECT id FROM users WHERE LOWER(emp_id) <> 'admin')";
$stmt1 = $conn->prepare($sql1);
if (!$stmt1) {
    echo json_encode(array("success" => false, "message" => "Prepare error: " . $conn->error));
    exit;
}
$stmt1->bind_param("sss", $defaultStatus, $defaultFrom, $defaultTo);
$stmt1->execute();
$stmt1->close();

// 2. Insert rows for faculty without an entry in faculty_status
$sql2 = "INSERT INTO faculty_status (user_id, status, availableFrom, availableTo)
         SELECT id, ?, ?, ? FROM users
         WHERE LOWER(emp_id) <> 'admin'
         AND id NOT IN (SELECT user_id FROM faculty_status)";
$stmt2 = $conn->prepare($sql2);
if (!$stmt2) {
    echo json_encode(array("success" => false, "message" => "Prepare error: " . $conn->error));
    exit;
}
$stmt2->bind_param("sss", $defaultStatus, $defaultFrom, $defaultTo);
$stmt2->execute();
$stmt2->close();

echo json_encode(array("success" => true, "message" => "All statuses reset to '$defaultStatus'"));
$conn->close();
?>

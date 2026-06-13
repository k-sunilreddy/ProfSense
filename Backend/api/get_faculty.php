<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

include 'config.php';

$sql = "SELECT u.id, u.emp_id, u.name, u.email AS designation,
        COALESCE(fs.status, 'Not Updated') AS status,
        fs.availableFrom,
        fs.availableTo
        FROM users u
        LEFT JOIN faculty_status fs ON u.id = fs.user_id
        WHERE LOWER(u.emp_id) <> 'admin'";
$result = $conn->query($sql);

$faculty = array();
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $faculty[] = $row;
    }
}

echo json_encode(array("success" => true, "faculty" => $faculty));
$conn->close();
?>

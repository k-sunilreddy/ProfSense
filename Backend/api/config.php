<?php
// 1. ALLOW VERCEL FRONTEND TO CONNECT (CORS)
// Replace the '*' below with your actual Vercel URL later for better security, e.g., "https://your-profsense.vercel.app"
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Handle preflight OPTIONS requests from the browser
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// 2. FETCH SECURE CLOUD CREDENTIALS
// These will be pulled dynamically from Render's Environment Variables
$host = getenv('DB_HOST');
$username = getenv('DB_USER');
$password = getenv('DB_PASSWORD');
$database = getenv('DB_NAME');
$port = getenv('DB_PORT');

// Path to your Aiven SSL certificate (ensure ca.pem is in the same folder as this file!)
$ssl_cert = __DIR__ . '/ca.pem';

// 3. CREATE SECURE SSL CONNECTION
$conn = mysqli_init();

// Apply the SSL certificate to the connection
mysqli_ssl_set($conn, NULL, NULL, $ssl_cert, NULL, NULL);

// Establish the secure connection to Aiven
$connected = mysqli_real_connect($conn, $host, $username, $password, $database, $port, NULL, MYSQLI_CLIENT_SSL);

// Check connection
if (!$connected) {
    die("Connection failed: " . mysqli_connect_error());
}
?>
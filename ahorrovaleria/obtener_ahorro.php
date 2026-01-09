<?php
ini_set('session.cookie_path', '/');
ini_set('session.cookie_secure', 1);
ini_set('session.cookie_samesite', 'None');
ini_set('session.use_only_cookies', 1);

session_start();

if (!isset($_SESSION['usuario'])) {
    http_response_code(403);
    exit;
}

require_once "../conexion.php";

$usuario = $_SESSION['usuario'];

/* CONEXIÓN */
$conexion = new mysqli("localhost", "root", "", "golden", 3307);
$result = $conexion->query(
    "SELECT monto, total_veces, marcadas 
     FROM ahorro 
     WHERE usuario = '$usuario'"
);

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);

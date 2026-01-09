<?php
session_start();
if (!isset($_SESSION['usuario'])) {
    http_response_code(403);
    exit;
}

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

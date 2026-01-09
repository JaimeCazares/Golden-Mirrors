<?php
session_start();
if (!isset($_SESSION['usuario'])) {
    http_response_code(403);
    exit;
}

$usuario = $_SESSION['usuario'];
$monto   = $_POST['monto'] ?? 0;
$marcadas = $_POST['marcadas'] ?? 0;

/* CONEXIÓN */
$conexion = new mysqli("localhost", "root", "", "golden", 3307);
if ($conexion->connect_error) {
    http_response_code(500);
    exit;
}

$sql = "UPDATE ahorro 
        SET marcadas = ? 
        WHERE usuario = ? AND monto = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("isi", $marcadas, $usuario, $monto);
$stmt->execute();

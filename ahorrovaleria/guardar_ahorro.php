<?php
require_once __DIR__ . '/../session_init.php';
require_once __DIR__ . '/../conexion.php';

$usuario  = $_SESSION['usuario'];
$monto    = (int)($_POST['monto'] ?? 0);
$marcadas = (int)($_POST['marcadas'] ?? 0);

$sql = "UPDATE ahorro SET marcadas = ? WHERE usuario = ? AND monto = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("isi", $marcadas, $usuario, $monto);
$stmt->execute();

echo "OK";

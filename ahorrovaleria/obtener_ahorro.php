<?php
require_once __DIR__ . '/../session_init.php';
require_once __DIR__ . '/../conexion.php';

$usuario = $_SESSION['usuario'];

$sql = "
    SELECT monto, total_veces, marcadas
    FROM ahorro
    WHERE usuario = ?
    ORDER BY monto DESC
";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("s", $usuario);
$stmt->execute();
$result = $stmt->get_result();

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

header('Content-Type: application/json');
echo json_encode($data);

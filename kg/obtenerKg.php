<?php
require_once "../conexion.php";

$result = $conexion->query("SELECT peso FROM peso_actual WHERE id = 1");
$fila = $result->fetch_assoc();

echo json_encode([
    "peso" => floatval($fila["peso"])
]);

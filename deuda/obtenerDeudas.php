<?php
require_once __DIR__ . "/../conexion.php";

$resultado = $conexion->query("SELECT nombre, monto, pagada FROM deudas_estado");

$deudas = [];

while ($fila = $resultado->fetch_assoc()) {
    $deudas[] = $fila;
}

echo json_encode($deudas);

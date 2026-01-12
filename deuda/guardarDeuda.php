<?php
require_once __DIR__ . "/../conexion.php";

$nombre = $_POST['nombre'];
$pagada = intval($_POST['pagada']);

$stmt = $conexion->prepare(
    "UPDATE deudas_estado SET pagada=? WHERE nombre=?"
);
$stmt->bind_param("is", $pagada, $nombre);
$stmt->execute();

echo "OK";

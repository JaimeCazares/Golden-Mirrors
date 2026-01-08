<?php
require_once "../conexion.php";

$peso = floatval($_POST["peso"]);

$stmt = $conexion->prepare("UPDATE peso_actual SET peso=? WHERE id=1");
$stmt->bind_param("d", $peso); // 👈 d = double
$stmt->execute();

echo "OK";

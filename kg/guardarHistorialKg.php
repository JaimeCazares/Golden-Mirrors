<?php
require_once "../conexion.php";

$peso = $_POST['peso'];
$fecha = date("Y-m-d");

// obtener primera fecha
$res = $conexion->query("SELECT fecha FROM peso_historial ORDER BY fecha ASC LIMIT 1");

if ($res->num_rows > 0) {
    $row = $res->fetch_assoc();
    $fechaInicial = new DateTime($row['fecha']);
} else {
    $fechaInicial = new DateTime($fecha);
}

$fechaActual = new DateTime($fecha);
$dias = $fechaInicial->diff($fechaActual)->days;
$semana = floor($dias / 7);

// FOTO
$fotoRuta = null;
if (!empty($_FILES['foto']['name'])) {
    $dir = "../uploads/peso/";
    if (!is_dir($dir)) mkdir($dir, 0777, true);

    $nombre = time() . "_" . basename($_FILES["foto"]["name"]);
    $ruta = $dir . $nombre;

    move_uploaded_file($_FILES["foto"]["tmp_name"], $ruta);
    $fotoRuta = "uploads/peso/" . $nombre;
}

$stmt = $conexion->prepare(
    "INSERT INTO peso_historial (peso, fecha, semana, foto) VALUES (?, ?, ?, ?)"
);
$stmt->bind_param("dsis", $peso, $fecha, $semana, $fotoRuta);
$stmt->execute();

echo json_encode(["ok" => true]);

<?php
require_once __DIR__ . '/../session_init.php';

if (!isset($_SESSION['usuario'])) {
    http_response_code(403);
    exit;
}


/* =========================
   CONEXIÓN SEGÚN ENTORNO
   ========================= */
if ($_SERVER['SERVER_NAME'] === 'localhost') {
    $conexion = new mysqli(
        "localhost",
        "root",
        "",
        "golden",
        3307
    );
} else {
    $conexion = new mysqli(
        "localhost",
        "u717657264_golden",
        "Jaimecazares7.",
        "u717657264_golden",
        3306
    );
}

if ($conexion->connect_error) {
    http_response_code(500);
    exit;
}

/* =========================
   OBTENER AHORRO
   ========================= */
$usuario = $_SESSION['usuario'];

$result = $conexion->prepare(
    "SELECT monto, total_veces, marcadas 
     FROM ahorro 
     WHERE usuario = ?"
);
$result->bind_param("s", $usuario);
$result->execute();

$res = $result->get_result();
$data = [];

while ($row = $res->fetch_assoc()) {
    $data[] = $row;
}

header('Content-Type: application/json');
echo json_encode($data);

<?php
ini_set('session.cookie_path', '/');
ini_set('session.cookie_secure', 1);
ini_set('session.cookie_samesite', 'None');
ini_set('session.use_only_cookies', 1);

session_start();

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
   GUARDAR AHORRO
   ========================= */
$usuario  = $_SESSION['usuario'];
$monto    = intval($_POST['monto'] ?? 0);
$marcadas = intval($_POST['marcadas'] ?? 0);

$sql = "UPDATE ahorro 
        SET marcadas = ? 
        WHERE usuario = ? AND monto = ?";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("isi", $marcadas, $usuario, $monto);
$stmt->execute();

echo "OK";

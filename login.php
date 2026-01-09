<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();

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
    die("Error conexión DB: " . $conexion->connect_error);
}

/* =========================
   LOGIN
   ========================= */

$usuario  = $_POST["usuario"] ?? "";
$password = $_POST["password"] ?? "";

$sql = "SELECT * FROM usuarios WHERE usuario = ? LIMIT 1";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("s", $usuario);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows === 1) {

    $user = $resultado->fetch_assoc();

    if ($password === $user["password"]) {

        $_SESSION["usuario"] = $usuario;

        // 🔑 DEFINIR ROL CORRECTAMENTE
        if ($usuario === 'vale') {
            $_SESSION["rol"] = 'novia';
            echo "AHORRO";
        } else {
            $_SESSION["rol"] = 'admin';
            echo "INDEX";
        }

    } else {
        echo "Contraseña incorrecta";
    }

} else {
    echo "El usuario no existe";
}

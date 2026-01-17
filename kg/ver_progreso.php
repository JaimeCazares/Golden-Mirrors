<?php
require_once "../conexion.php";
$modo = isset($_GET['modo']) ? $_GET['modo'] : 'galeria';

// Obtener registros que tengan al menos una foto
$res = $conexion->query("SELECT * FROM peso_historial WHERE foto_frente IS NOT NULL ORDER BY semana ASC");
$registros = [];
while ($row = $res->fetch_assoc()) {
    $registros[] = $row;
}

if ($modo == 'comparar' && count($registros) >= 2) {
    $primero = $registros[0];
    $ultimo = end($registros);
    $mostrar = [$primero, $ultimo];
    $titulo = "Comparativa: Antes y Después";
} else {
    $mostrar = $registros;
    $titulo = "Mi Progreso Visual";
}
?>
<!DOCTYPE html>
<html>

<head>
    <title><?php echo $titulo; ?></title>
    <style>
        body {
            background: #0f0f1e;
            color: white;
            font-family: sans-serif;
            text-align: center;
        }

        .grid {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px;
            padding: 20px;
        }

        .card {
            background: #1a1a2e;
            padding: 15px;
            border-radius: 12px;
            border: 1px solid #00e0ff;
        }

        img {
            width: 250px;
            border-radius: 8px;
            display: block;
            margin-bottom: 5px;
        }

        .info {
            font-size: 14px;
            color: #00e0ff;
            font-weight: bold;
        }
    </style>
</head>

<body>
    <h1><?php echo $titulo; ?></h1>
    <div class="grid">
        <?php foreach ($mostrar as $r): ?>
            <div class="card">
                <div class="info">Semana <?php echo $r['semana']; ?> - <?php echo $r['peso']; ?> kg</div>
                <img src="../<?php echo $r['foto_frente']; ?>" alt="Frente">
                <?php if ($r['foto_lado']): ?> <img src="../<?php echo $r['foto_lado']; ?>" alt="Lado"> <?php endif; ?>
            </div>
        <?php endforeach; ?>
    </div>
</body>

</html>
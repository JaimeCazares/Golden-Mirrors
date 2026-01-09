<?php
header('Content-Type: application/json');

echo json_encode([
    [
        "monto" => 500,
        "total_veces" => 6,
        "marcadas" => 0
    ],
    [
        "monto" => 200,
        "total_veces" => 12,
        "marcadas" => 0
    ]
]);

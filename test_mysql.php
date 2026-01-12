<?php
$mysqli = new mysqli("localhost", "root", "", "", 3306);

if ($mysqli->connect_error) {
    die("ERROR: " . $mysqli->connect_error);
}

echo "✅ MYSQL RESPONDE";

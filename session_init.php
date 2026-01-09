<?php
ini_set('session.cookie_path', '/');
ini_set('session.use_only_cookies', 1);

if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
    ini_set('session.cookie_secure', 1);
    ini_set('session.cookie_samesite', 'None');
}

session_start();

if (!isset($_SESSION['usuario'])) {
    http_response_code(403);
    exit;
}

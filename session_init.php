<?php
ini_set('session.cookie_path', '/');
ini_set('session.use_only_cookies', 1);

/**
 * SOLO activar cookies seguras en HTTPS (Hostinger)
 * En local NO
 */
$https = (
    (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || $_SERVER['SERVER_PORT'] == 443
);

if ($https) {
    ini_set('session.cookie_secure', 1);
    ini_set('session.cookie_samesite', 'None');
}

session_start();

if (!isset($_SESSION['usuario'])) {
    http_response_code(403);
    exit;
}

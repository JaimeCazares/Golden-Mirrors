<?php
ini_set('session.save_path', __DIR__ . '/sessions');
ini_set('session.cookie_path', '/');
ini_set('session.cookie_secure', 1);
ini_set('session.cookie_samesite', 'Lax');
ini_set('session.use_only_cookies', 1);

if (!is_dir(__DIR__ . '/sessions')) {
    mkdir(__DIR__ . '/sessions', 0777, true);
}

session_start();

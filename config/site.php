<?php

return [
    'title' => env('APP_NAME', 'vuetified.app'),
    'titleStyle' => [
        'color' => '#f5c300' , //gold
    ],
    'navbarStyle' => [
        'background-color' => '#103050' //dark-blue
    ],
    'footerStyle' => [
        'background-color' => '#333333',
        'color'            => '#f5c300'
    ],
    'sidebarStyle' => [
        'background-color' => '#103050',
        'color'            => '#BA9A5A'
    ],
    'toggleBarStyle' => [
        'color' => '#f5c300' , //gold
    ],
    'icon' => [
        'name' => 'fa-compass', // font-awesome or material icon
        'color' => '#26A69A',
        'show'  => true
    ],
    'logo' => [
        'url' => '/img/logo.png',
        'width' => '50px',
        'height' => '50px',
        'show'  => true
    ],
    'trademark' => env('HOME_TRADEMARK','Vuetified'),
    'domain' => env('APP_DOMAIN', 'vuetified.app'),
    'url' => env('APP_URL', 'http://localhost'),
    'email' => env('ADMIN_EMAIL', 'admin@vuetified.app'),
];
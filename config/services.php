<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Stripe, Mailgun, SparkPost and others. This file provides a sane
    | default location for this type of information, allowing packages
    | to have a conventional place to find your various credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
    ],

    'ses' => [
        'key' => env('SES_KEY'),
        'secret' => env('SES_SECRET'),
        'region' => 'us-east-1',
    ],

    'sparkpost' => [
        'secret' => env('SPARKPOST_SECRET'),
    ],

    'stripe' => [
        'model' => App\User::class,
        'key' => env('STRIPE_KEY'),
        'secret' => env('STRIPE_SECRET'),
    ],

    'twitter' => [
        'client_id' => env('TWITTER_KEY'),
        'client_secret' => env('TWITTER_SECRET'),
        'redirect' => env('TWITTER_REDIRECT_URI'),  
    ], 

    'facebook' => [
        'client_id' => env('FACEBOOK_APP_ID'),
        'client_secret' => env('FACEBOOK_APP_SECRET'),
        'redirect' => env('FACEBOOK_REDIRECT_URL'),  
    ], 

    'dailymotion' => [
        'client_id' => env('DAILYMOTION_KEY'),
        'client_secret' => env('DAILYMOTION_SECRET'),
        'redirect' => env('DAILYMOTION_REDIRECT_URI'),  
    ], 

    'google' => [
        'client_id' => env('GOOGLE_KEY'),
        'client_secret' => env('GOOGLE_SECRET'),
        'redirect' => env('GOOGLE_REDIRECT_URI'),  
    ], 

    'imgur' => [
        'client_id' => env('IMGUR_KEY'),
        'client_secret' => env('IMGUR_SECRET'),
        'redirect' => env('IMGUR_REDIRECT_URI'),  
    ], 

    'instagram' => [
        'client_id' => env('INSTAGRAM_KEY'),
        'client_secret' => env('INSTAGRAM_SECRET'),
        'redirect' => env('INSTAGRAM_REDIRECT_URI'),  
    ], 

    'medium' => [
        'client_id' => env('MEDIUM_KEY'),
        'client_secret' => env('MEDIUM_SECRET'),
        'redirect' => env('MEDIUM_REDIRECT_URI'),  
    ], 

    'pinterest' => [
        'client_id' => env('PINTEREST_KEY'),
        'client_secret' => env('PINTEREST_SECRET'),
        'redirect' => env('PINTEREST_REDIRECT_URI'),  
    ], 

    'reddit' => [
        'client_id' => env('REDDIT_KEY'),
        'client_secret' => env('REDDIT_SECRET'),
        'redirect' => env('REDDIT_REDIRECT_URI'),  
    ],

    'tumblr' => [
        'client_id' => env('TUMBLR_KEY'),
        'client_secret' => env('TUMBLR_SECRET'),
        'redirect' => env('TUMBLR_REDIRECT_URI'),  
    ], 

    'vimeo' => [
        'client_id' => env('VIMEO_KEY'),
        'client_secret' => env('VIMEO_SECRET'),
        'redirect' => env('VIMEO_REDIRECT_URI'),  
    ], 

    'wordpress' => [
        'client_id' => env('WORDPRESS_KEY'),
        'client_secret' => env('WORDPRESS_SECRET'),
        'redirect' => env('WORDPRESS_REDIRECT_URI'),  
    ], 

    'youtube' => [
        'client_id' => env('YOUTUBE_KEY'),
        'client_secret' => env('YOUTUBE_SECRET'),
        'redirect' => env('YOUTUBE_REDIRECT_URI'),  
    ], 

];

<?php

use Faker\Generator as Faker;
use App\Twitter;

$factory->define(Twitter::class, function (Faker $faker) {
    return [
        'user_id' => rand(1,100000),
        'username' => $faker->userName,
        'access_token' => str_random(60),
        'access_token_secret' => str_random(60),
    ];
});

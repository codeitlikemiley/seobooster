<?php

use Faker\Generator as Faker;
use App\TwitterPost;

$factory->define(TwitterPost::class, function (Faker $faker) {
    return [
        'status' => $faker->sentence,
    ];
});

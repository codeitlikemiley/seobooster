<?php

use App\TwitterPost;
use App\Jobs\PublishTwitterPost;
/* Vue Wilcard Route Catcher */

Horizon::auth(function ($request) {
    return true;
});

//! example que of laravel horizon
Route::get('/post', function () {
    $post = TwitterPost::first();
    PublishTwitterPost::dispatch($post)->onQueue('twitter-post');
});

Route::domain('{referrallink}.'.config('app.domain'))->group(function () {
    Route::get('/{vue?}', 'DomainController@sponsor')->where('vue', '[\/\w\.-]*')->name('sponsor');
});

Route::get('/{vue?}', 'DomainController@app')->where('vue', '[\/\w\.-]*')->name('app');
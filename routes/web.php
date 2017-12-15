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

//! Provider Link Redirect
Route::get('/auth/{provider}/user/{id}/login', 'AccountProviderController@redirectToProvider')->where('provider', '[\/\w\.-]*')->name('account_provider_redirect');
//! We Should Create Callback URL on our Vue Front End... Then Make Api Calls In OUr Database, to Save the Data We Got!
Route::get('/providers/{provider}/callback', 'AccountProviderController@handleProviderCallback')->where('provider', '[\/\w\.-]*')->name('account_provider_callback');

Route::domain('{referrallink}.'.config('app.domain'))->group(function () {
    Route::get('/{vue?}', 'DomainController@sponsor')->where('vue', '[\/\w\.-]*')->name('sponsor');
});

Route::get('/{vue?}', 'DomainController@app')->where('vue', '[\/\w\.-]*')->name('app');
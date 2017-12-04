<?php
Route::get('/twitter', function(){
    $clientId = "RlB6T8QimvLI0VFiGMEgSdDIG";
    $clientSecret = "UQTdtSssUAMf1HPrlXsyItlIogfknM63YPYVe75YgWXQvq7uE";
    $redirectUrl = "http://seosocio.com/providers/twitter/callback";
    $config = new \SocialiteProviders\Manager\Config($clientId, $clientSecret, $redirectUrl);
    return Socialite::with('twitter')->setConfig($config)->redirect();
    });
Route::get('/providers/twitter/callback', function(){
    $user = Socialite::driver('twitter')->user();
    return  response()->json($user);
});

/* Vue Wilcard Route Catcher */
Route::domain('{referrallink}.'.config('app.domain'))->group(function () {
    Route::get('/{vue?}', 'DomainController@sponsor')->where('vue', '[\/\w\.-]*')->name('sponsor');
});

Route::get('/{vue?}', 'DomainController@app')->where('vue', '[\/\w\.-]*')->name('app');
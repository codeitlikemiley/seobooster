<?php
Route::group(['middleware' => ['auth:api']], function () {
    //? Users Page
    Route::post('/@me', 'Api\UsersController@me')->name('api.@me');
    Route::post('/users', 'Api\UsersController@index')->name('api.user.index');
    Route::post('/users/username/{username}', 'Api\UsersController@findByUsername')->name('api.user.findByUsername');
    Route::post('/users/email/{email}', 'Api\UsersController@findByEmail')->name('api.user.findByEmail');
    Route::get('/permissions', 'Api\Auth\PermissionRolesController@getAllPermissions')->name('api.permissions.index');
    Route::get('/roles', 'Api\Auth\PermissionRolesController@getAllRoles')->name('api.roles.index');
    Route::post('/users/{id}/syncRoles', 'Api\Auth\PermissionRolesController@syncRoles')->name('api.user.roles.sync');
    Route::post('/users/{id}/syncPermissions', 'Api\Auth\PermissionRolesController@syncPermissions')->name('api.user.permissions.sync');
    Route::get('/users/{id}/activateLink', 'Api\Link\ActivationController@activateLink')->name('api.user.link.activate');
    Route::get('/users/{id}/deactivateLink', 'Api\Link\ActivationController@deactivateLink')->name('api.user.link.deactivate');
    //? Settings Page
    Route::post('/users/settings/updateAccount', 'Api\Settings\SettingsController@updateAccount')->name('api.user.updateAccount');
    Route::post('/users/settings/updateProfile', 'Api\Settings\SettingsController@updateProfile')->name('api.user.updateProfile');
    Route::post('/users/settings/updateReferralLink', 'Api\Settings\SettingsController@updateReferralLink')->name('api.user.updateReferralLink');
    //? Router Check For Auth User
    Route::post('/auth/check', 'Api\Auth\LoginController@check')->name('api.auth.check');
    //? Helpers We Can Use For Permission and Roles
    Route::get('/getPermissionsViaRoles', 'Api\Auth\ACLController@getPermissionsViaRoles')->name('api.auth.getPermissionsViaRoles');
    Route::get('/getDirectPermissions', 'Api\Auth\ACLController@getDirectPermissions')->name('api.auth.getDirectPermissions');
    Route::get('/getAllPermissions', 'Api\Auth\ACLController@getAllPermissions')->name('api.auth.getAllPermissions');
    Route::get('/hasPermissionTo', 'Api\Auth\ACLController@hasPermissionTo')->name('api.auth.hasPermissionTo');
    Route::get('/hasAnyPermission', 'Api\Auth\ACLController@hasAnyPermission')->name('api.auth.hasAnyPermission');
    Route::get('/getRoles', 'Api\Auth\ACLController@getRoles')->name('api.auth.getRoles');
    Route::get('/hasRole', 'Api\Auth\ACLController@hasRole')->name('api.auth.hasRole');
    Route::get('/hasAnyRole', 'Api\Auth\ACLController@hasAnyRole')->name('api.auth.hasAnyRole');
    Route::get('/hasAllRoles', 'Api\Auth\ACLController@hasAllRoles')->name('api.auth.hasAllRoles');
    //? Router For Logout
    Route::post('/auth/logout', 'Api\Auth\LoginController@logout')->name('api.auth.logout');
    Route::post('/accounts/{type?}', 'AccountController@index')->name('api.account.index');
    //? Router For Making post
    Route::post('/post', 'PostController@store')->name('api.post.create');
    Route::post('/providers/{provider}/callback', 'AccountProviderController@handleProviderCallback')->where('provider', '[\/\w\.-]*')->name('account_provider_callback');

});
/* Can Be Accessed Without Access Token */
//? Router For Authentication
Route::get('/auth/{provider}/user/{id}/login', 'AccountProviderController@redirectToProvider')->where('provider', '[\/\w\.-]*')->name('account_provider_redirect');
Route::post('/auth/register', 'Api\Auth\RegisterController@register')->name('api.auth.register');
Route::post('/auth/login', 'Api\Auth\LoginController@login')->name('api.auth.login');
Route::post('/auth/refresh', 'Api\Auth\LoginController@refresh')->name('api.auth.refresh');
Route::post('/auth/social', 'Api\Auth\SocialAuthController@socialAuth')->name('api.auth.social');
Route::post('/sendResetEmail', 'Api\Auth\ForgotPasswordController@sendResetEmail')->name('api.auth.forgotpassword');
Route::post('/resetPassword', 'Api\Auth\ResetPasswordController@resetPassword')->name('api.auth.reset-password');
//? Router For Sending Customer Email
Route::post('/@contact', 'Api\ContactUsController@contact')->name('api.@contact');



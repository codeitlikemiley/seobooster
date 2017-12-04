<?php

namespace App\Http\Controllers\Api\Settings;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Rules\MustMatchPassword;
use App\Rules\ValidateZip;
use Illuminate\Validation\Rule;
use App\User;
use App\Http\Resources\User\User as UserResouce;

class SettingsController extends Controller
{

    public function __construct()
    {
        // $this->middleware(['can:edit-profile']);
    }

    public function updateAccount(Request $request)
    {
        $user = $request->user_id ? \Vuetified::user()->find($request->user_id) : $request->user();

        $data = request()->validate([
            'email' => [
                'sometimes',
                'required',
                'email',
                Rule::unique('users')->ignore($user->id),
            ],
			'username' => [
                'sometimes',
                'required',
               Rule::unique('users')->ignore($user->id),
            ],
            'old_password' => [
                'sometimes',
                'required',
                new MustMatchPassword($user->password)
            ],
			'password' => 'required_with:old_password|min:6|confirmed',
            'password_confirmation' => 'required_with:password'
        ]);
        // fill will only assign those in the fillable fileds of user
        $user->fill($data);
        $save = $user->save();
        if($save){
            return (new UserResouce($user->load('profile','referralLink', 'roles', 'permissions')))->additional(['message' => 'Account Updated!']);
        }

    }

    public function updateProfile(Request $request)
    {
        
        $user = $request->user_id ? \Vuetified::user()->find($request->user_id) : $request->user();
        $data = request()->validate([
            'first_name' => [
                'sometimes',
                'required',
                'regex:/(^[A-Za-z0-9 ]+$)+/'
            ],
            'last_name' => [
                'sometimes',
                'required',
                'regex:/(^[A-Za-z0-9 ]+$)+/'
            ],
            'contact_no' => [
                'sometimes',
                'required',
                'regex:/(^[A-Za-z0-9 ]+$)+/'
            ],
            'address_1' => [
                'sometimes',
                'required',
                'regex:/(^[A-Za-z0-9 ]+$)+/'
            ],
            'address_2' => [
                'sometimes',
                'required',
                'regex:/(^[A-Za-z0-9 ]+$)+/'
            ],
            'city' => [
                'sometimes',
                'required',
                'regex:/(^[A-Za-z0-9 ]+$)+/'
            ],
            'country' => [
                'sometimes',
                'required',
                'regex:/(^[A-Za-z0-9 ]+$)+/'
            ],
            'zip_code' => [
                'sometimes',
                'required',
                new ValidateZip
            ],
            'state_province' => [
                'sometimes',
                'required',
                'regex:/(^[A-Za-z0-9 ]+$)+/'
            ],
        ]);
        $profile = $user->profile;
        $updated = $profile->update($data);
        if($updated){
            return (new UserResouce($user->load('profile','referralLink', 'roles', 'permissions')))->additional(['message' => 'Profile Updated!']);
        }
    }

    public function updateReferralLink(Request $request)
    {
        $user = $request->user_id ? \Vuetified::user()->find($request->user_id) : $request->user();
        $link = $user->referralLink;
        $data = request()->validate([
            'link' => [
                'regex:/^[a-zA-Z0-9 +@#]+$/',
                Rule::unique('links')->ignore($link->id),
            ]
        ]);
        
        $updated = $link->update($data);
        if($updated){
            return (new UserResouce($user->load('profile','referralLink', 'roles', 'permissions')))->additional(['message' => 'Referral Link Updated!']);
        }
    }
}

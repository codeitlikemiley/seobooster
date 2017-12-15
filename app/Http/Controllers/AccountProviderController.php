<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Exceptions\ProviderNotFound;
use App\Exceptions\UserNotFound;
use App\User;

class AccountProviderController extends Controller
{
    public function redirectToProvider($provider,$userId)
    {
        $user = User::find($userId);
        if(!$user){
            throw new UserNotFound;
        }
        $account = $user->accounts->where('name', $provider)->first();
        if(!$account){
            throw new ProviderNotFound;
        }else{
            //! We Need To Add Socialite Extention Provider For Each Provider
            //! We Should Also Throw Error Here If That Service Provider is Not Loaded Or Present
            //! We Should make this Stateless
            $config = new \SocialiteProviders\Manager\Config($account->client_id, $account->client_secret, $account->redirect_url);
            return \Socialite::with($provider)->setConfig($config)->redirect();
        }
    }
    //! This Should be Called From Front End, Where We Passed 
    public function handleProviderCallback(Request $request,$provider)
    {
        //! check if we can post with the user token
        $user = $request->all();
        $user = User::find($request->id);
        $user = \Socialite::driver($provider)->user();
        // $user = \Socialite::driver($provider)->user();
        // //! Process provider for the user...

        // $accessTokenResponseBody = $user->accessTokenResponseBody;  
        // Account::where('name', $provider)->where('user_id', request()->user()->id)->first();
        // $user->accessTokenResponseBody
        // "oauth_token": "2878046635-79xesuwmI1DExvSOnHh5WFLLjTM5CiU7urOJM5Y",
        // "oauth_token_secret": "hrmcLWaPRVn95eYJf5GMDUck9PKDPdMwC3TOw0uXZEzws",
        // "user_id": "2878046635",
        // "screen_name": "uriahg17",
        // "x_auth_expires": "0"
        // Save this to the Twitter Database
        return  response()->json($user);
        // POST API by twitter
        // https://developer.twitter.com/en/docs/tweets/post-and-engage/api-reference/post-statuses-update
    }
}

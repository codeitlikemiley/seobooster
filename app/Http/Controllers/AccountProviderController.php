<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Exceptions\ProviderNotFound;
use App\Exceptions\UserNotFound;
use App\User;

class AccountProviderController extends Controller
{

    protected $providers = [
        'facebook',
        'google',
        'twitter',
        'dailymotion',
        'imgur',
        'instagram',
        'medium',
        'pinterest',
        'reddit',
        'tumblr',
        'vimeo',
        'wordpress',
        'youtube'
    ];

    public function redirectToProvider($provider,$userId)
    {
        //! check if provider is allowed
        if( ! $this->isProviderAllowed($driver) ) {
            throw new ProviderNotFound;
        }
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
            return \Socialite::with($provider)->setConfig($config)->stateless()->redirect();
        }
    }
    //! This Should be Called From Front End, Where We Passed 
    public function handleProviderCallback(Request $request,$provider)
    {
        //! check if provider is allowed
        if( ! $this->isProviderAllowed($driver) ) {
            throw new ProviderNotFound;
        }
        //! We get the User Currently Using the App
        $auth = User::find($request->id);
        //! We get the Account Provider
        $account = $auth->accounts->where('name', $provider)->first();
        //! we load all accounts dynamically
        ${$provider.'_accounts'} = $provider.'_accounts';
        $accounts = $account->${$provider.'_accounts'};
        //! set the user
        $user = \Socialite::driver($provider)->stateless()->user();
        //! we will search for the account username either of the following
        $fields = [$user->nickname,$user->email];
        //! We return the first instance 
        $user = $accounts->whereIn('username', $fields)->first();
        
        // $user = \Socialite::driver($provider)->user();
        // $user = \Socialite::driver($provider)->getAccessTokenResponse($request->code);
        //! Update Our Access Token in the Front End To Avoid Being Locked Down
        //! We Need to Avoid Invalidation of The Old Token We Shouldnt be providing a new Token for the User!
        // $accessTokenResponseBody = $user->accessTokenResponseBody;  
        // Account::where('name', $provider)->where('user_id', request()->user()->id)->first();
        // $user->accessTokenResponseBody
        // "oauth_token": "2878046635-79xesuwmI1DExvSOnHh5WFLLjTM5CiU7urOJM5Y",
        // "oauth_token_secret": "hrmcLWaPRVn95eYJf5GMDUck9PKDPdMwC3TOw0uXZEzws",
        // "user_id": "2878046635",
        // "screen_name": "uriahg17",
        // "x_auth_expires": "0"
        // Save this to the Twitter Database
        // $user = \Socialite::driver($provider)->stateless()->user();

        //! Better if we can broadcast an event to front end using laravel echo 
        //! to notify the user has verified their account

        return  response()->json($user);
        // POST API by twitter
        // https://developer.twitter.com/en/docs/tweets/post-and-engage/api-reference/post-statuses-update
    }

    private function isProviderAllowed($driver)
    {
        return in_array($driver, $this->providers) && config()->has("services.{$driver}");
    }
}

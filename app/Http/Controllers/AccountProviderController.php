<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Exceptions\ProviderNotFound;
use App\Exceptions\UserNotFound;
use App\User;

class AccountProviderController extends Controller
{
    public function __construct()
    {
        $this->middleware(['api']);
    }

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
        if( ! $this->isProviderAllowed($provider) ) {
            throw new ProviderNotFound;
        }
        //! Check if UserId present in Request
        $user = User::find($userId);
        if(!$user){
            throw new UserNotFound;
        }
        //! Get the User Accounts by Provider Name
        $account = $user->accounts->where('name', $provider)->first();
        if(!$account){
            //! Throw error If No Account Yet
            throw new ProviderNotFound;
        }else{
            //! Authenticate User Third Party Account
            $config = new \SocialiteProviders\Manager\Config($account->client_id, $account->client_secret, $account->redirect_url);
            return \Socialite::with($provider)->setConfig($config)->stateless()->redirect();
        }
    }
    /**
     * Handle Callback function
     *
     * @param Request $request
     * @param [string] $provider
     * @return Response $response
     */
    public function handleProviderCallback(Request $request,$provider)
    {
        //* confirmed axios is sending the bearer token
        //! check if provider is allowed
        if( ! $this->isProviderAllowed($provider) ) {
            throw new ProviderNotFound;
        }
        //! Check For User Id in the request
        //! If there is Token we Retrive User Token
        //* We get the User Currently Using the App
        $auth = User::find($request->id);
        //* We get the Account Provider
        $account = $auth->accounts->where('name', $provider)->first();
        //! We Load The RelationShip Dynamically
        ${$provider.'_accounts'} = $provider.'_accounts';
        $accounts = $account->${$provider.'_accounts'};
        
        //? When Adding New Service Provider Add A Modified user() method that wont add Token to response Header
        $response = \Socialite::driver($provider)->stateless()->user();
        return  response()->json($response);
        //! We Either Search For Nickname or Email From Response
        $fields = [$response->nickname,$response->email];

        //! We get The Account By Username
        $user = $accounts->whereIn('username', $fields)->first();

        //! We Save The Provider Account Access Token
        //! We Will Dynamically Save Access Token By provider and username
        ${'update'.camel_case($provider).'AccessToken'} = 'update'.camel_case($provider).'AccessToken';
        $this->${'update'.camel_case($provider).'AccessToken'}($user, $response);

        //* Be Sure To Check Token Expiration When Posting!
        //! Better if we can broadcast an event to front end using laravel echo 
        //! to notify the user has verified their account
        
        //! NOTE WHEN RETURNING RESPONSE AVOID RETURNING A DATA WITH KEY OF access_token
        //! COZ it will be automatically be converted by vueauthenticate
        //! Either we Make that private so we wont return it or have the package creator fixed it!!!
        return  response()->json($user);

    }

    private function isProviderAllowed($driver)
    {
        return in_array($driver, $this->providers) && config()->has("services.{$driver}");
    }

    private function updateFacebookAccessToken($user, $response)
    {
        
        if($response->id){
            $user->provider_id = $response->id;
        }
        if($response->access_token){
            $user->access_token = $response->access_token;
        }
        //! verify if we have the correct expires name
        if($response->expires_at){
            $user->expires_at = $response->expires_at;
        }
        if(is_null($response->id) || is_null($response->access_token) || is_null($response->expires_at)){
            throw new \Exception('Error On Updating Facebook Account: id = '.$response->id.', access_token = '.$response->access_token.', expires_at = '.$response->expires_at);
        }else{
            $user->active = true;
            $user->save();
        }

    }

    private function updateTwitterAccessToken($user, $response)
    {
        if($response->token){
            $user->access_token = $response->token;
        }
        if($response->tokenSecret){
            $user->access_token_secret = $response->tokenSecret;
        }
        if($response->id){
            $user->provider_id = $response->id;
        }
        if(is_null($response->id) || is_null($response->token) || is_null($response->tokenSecret)){
            throw new \Exception('Error On Updating Facebook Account: id = '.$response->id.', token = '.$response->token.', tokenSecret = '.$response->tokenSecret);
        }else{
            $user->active = true;
            $user->save();
        }
    }
}

<?php

namespace App\Http\Controllers;

use App\Account;
use App\Provider;
use Illuminate\Http\Request;
use App\Exceptions\UserTokenNotFound;
use App\Http\Resources\ProviderResource;

class AccountController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request,$type=null)
    {
        
        $user = $request->user();
        if(!$user){
            throw new UserTokenNotFound;
        }
        if(!$type){
            throw new \Exception('Request Type Not Found!');
        }

        $providers = Provider::with(array('accounts'=>function($query) use ($request){
            $query->where('user_id', '=', $request->user()->id);
        }))->where('type',$type)->get();

        foreach ($providers as $providerIndex => $provider) {
            foreach ($provider->accounts as $accountIndex => $account) {
                $provider->accounts[$accountIndex]->load($account->name.'_accounts');
            }
        }
        
        // Return All Providers as ProviderCollection
        // Call Account Resource On Each Provider

        
        return ProviderResource::collection($providers);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request,$type,$provider)
    {
        $provider = Provider::findBySlugOrFail($provider);
        $account = new Account();
        $account->type = $type;
        $account->user_id = $request->user()->id;
        $provider->accounts()->save($account);
        $account->save();
        $newAccount = new $provider->model;
        /* Add dynamic validation */
        $newAccount->fill($request->all());
        $newAccount->save();
        $newAccount->accounts()->save($provider);
        return response()->json(['mesage' => 'New Account Added'],200);
    }
}

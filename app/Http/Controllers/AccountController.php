<?php

namespace App\Http\Controllers;

use App\Account;
use App\Provider;
use Illuminate\Http\Request;
use App\Exceptions\UserTokenNotFound;

class AccountController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = $request->user();
        if(!$user){
            throw new UserTokenNotFound;
        }
        return Account::where('user_id' ,$user->id);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
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

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Provider;

class ProviderController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Provider::all();
    }

     /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = $this->validateData($request);
        $provider = new Provider();
        $provider->fill($data);
        $save = $provider->save();
        if(!$save){
            return response()->json(['message' => 'Failed To Save!'],400);
        }
        return response()->json(['message' => 'New Provider Created', 'provider' => $prodiver]);
        
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Provider::findOrFail($id);
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $provider = Provider::find($id);
        if(!$provider){
            throw new ProviderNotFound;
        }

        $data = $this->validateData($request);
        
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $provider = Provider::find($id);
        if(!$provider){
            throw new ProviderNotFound;
        }
        $provider->delete();
        return response()->json(['message' => 'Provider Deleted!',204]);
    }

    private function validateData(Request $request){
        $data = $request->validate([
            'name' => [
                'required',

            ],
            'client_id' => [
                'required',
            ],
            'client_secret' => [
                'required',
            ],
            'redirect_url' => [
                'required',
                'url',
                'active_url'
            ],
            'scope' => [
                'present',
            ],
            'config' => [
                'present',
            ],
        ]);
        return $data;
    }
}

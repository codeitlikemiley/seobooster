<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Twitter extends Model
{
    protected $table = "twitter_accounts";

    protected $fillable = [
        'username', 'access_token', 'refresh_token', 'expires_at', 'scope'
    ];

    protected $dates = ['created_at', 'updated_at', 'expires_at'];

    protected $casts = [
        'scope' => 'array', 
    ];


    public function accounts()
    {
        return $this->morphMany(Provider::class, 'accounts');
    }
}

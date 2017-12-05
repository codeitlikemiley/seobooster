<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Twitter extends Model
{
    protected $table = "twitter_accounts";

    protected $fillable = [
        'username', 'access_token', 'access_token_secret', 'expires_at', 'scope', 'revoked'
    ];

    protected $dates = ['created_at', 'updated_at', 'expires_at'];

    protected $casts = [
        'scope' => 'array', 
        'revoked' => 'boolean'
    ];

    public function accounts()
    {
        return $this->morphToMany(Account::class, 'accountable');
    }

    public function owner()
    {
        return $this->belongsTo(User::class);
    }
}

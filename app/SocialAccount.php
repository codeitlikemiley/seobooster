<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SocialAccount extends Model
{
    protected $table = 'social_accounts';

    public function user()
    {
    	return $this->belongsTo(User::class);
    }

}
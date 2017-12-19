<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\FacebookPostFacebookAccount;

class Facebook extends Model
{
    protected $table = "facebook_accounts";

    protected $fillable = [
        'user_id','username', 'access_token', 'access_token_secret', 'expires_at', 'scope', 'revoked', 'active'
    ];
    protected $dates = ['created_at', 'updated_at', 'expires_at'];

    protected $casts = [
        'scope' => 'array', 
        'revoked' => 'boolean',
        'active' => 'boolean'
    ];

    protected $hidden = [
        'access_token', 'access_token_secret',
    ];

    protected $appends = ['post_count', 'link'];

    public function accounts()
    {
        return $this->morphToMany(Account::class, 'accountable');
    }

    public function owner()
    {
        return $this->belongsTo(User::class);
    }
    /* check if this is correct */
    public function posts()
    {
        // 1nd arg = table name
        // 2rd arg = current model column name
        // 3rd arg = joining table column name
        return $this->belongsToMany(FacebookPost::class,'facebook_post_facebook_account','facebook_account_id','facebook_post_id');
    }

    public function getPostCountAttribute()
    {
        return $this->posts->where('posted_at', '!=', null)->count();
    }

    public function getLinkAttribute()
    {
        return config('app.url') .'/auth/facebook/user/'. $this->user_id .'/login';
    }
}

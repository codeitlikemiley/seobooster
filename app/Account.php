<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Traits\GenerateUniqueID;

class Account extends Model
{
    use GenerateUniqueID;

    public $incrementing = false;

    protected $fillable = [
        'provider', 'username', 'access_token', 'refresh_token', 'expires_at', 'scope'
    ];

    protected $dates = ['created_at', 'updated_at', 'expires_at'];

    protected $casts = [
        'scope' => 'array', 
    ];

    public function posts()
    {
    	return $this->hasMany(Post::class);
    }

    public static function last()
    {
        return self::latest()->first();
    }

    public function getAvatarAttribute($value)
    {
        return empty($value) ? 'https://www.gravatar.com/avatar/'.md5(Str::lower($this->email)).'.jpg?s=200&d=mm' : url($value);
    }

    public static function findByUsername($username)
    {
        return self::whereUsername($username)->first();
    }

    public static function findByProvider($provider)
    {
        return self::whereProvider($provider)->first();
    }
}

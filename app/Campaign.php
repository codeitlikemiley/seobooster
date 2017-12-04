<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;
use Cviebrock\EloquentSluggable\SluggableScopeHelpers;

class Campaign extends Model
{
    use Sluggable,SluggableScopeHelpers;

    public function getRouteKeyName()
    {
        return 'slug';
    }

    protected $fillable = [
        'name', 'slug'
    ];

    protected $dates = ['created_at', 'updated_at'];

    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    public static function last()
    {
        return self::latest()->first();
    }

}

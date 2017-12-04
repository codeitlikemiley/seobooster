<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;
use Cviebrock\EloquentSluggable\SluggableScopeHelpers;

class Platform extends Model
{
    use Sluggable,SluggableScopeHelpers;

    public function getRouteKeyName()
    {
        return 'slug';
    }

    protected $fillable = [
        'provider_type', 'name', 'api_key', 'secret_key', 'redirect_url', 'slug'
    ];

    protected $dates = ['created_at', 'updated_at'];

    public function twitter()
    {
        return $this->morphedByMany(Twitter::class, 'postable');
    }
    // Add Below All Account Provider

}

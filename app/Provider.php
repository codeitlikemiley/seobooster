<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;
use Cviebrock\EloquentSluggable\SluggableScopeHelpers;

class Provider extends Model
{
    use Sluggable,SluggableScopeHelpers;

    protected $fillable = [
       'type', 'name', 'slug', 'client_id', 'client_secret', 'redirect_url', 'scope', 'config', 'account_model', 'post_model', 'job_model'
    ];

    protected $dates = ['created_at', 'updated_at'];

    protected $casts = [
        'scope' => 'array',
        'config' => 'array',
    ];

    public function getRouteKeyName()
    {
        return 'slug';
    }
    public function sluggable()
    {
        return [
            'slug' => [
                'source' => 'name'
            ]
        ];
    }

}

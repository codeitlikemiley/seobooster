<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;
use Cviebrock\EloquentSluggable\SluggableScopeHelpers;

class Account extends Model
{
    use Sluggable,SluggableScopeHelpers;

    protected $fillable = [
        'type', 'name', 'slug', 'client_id', 'client_secret', 'redirect_url', 'scope', 'config'
     ];

    protected $dates = ['created_at', 'updated_at'];

    protected $casts = [
        'scope' => 'array',
        'config' => 'array',
    ];

    public function sluggable()
    {
        return [
            'slug' => [
                'source' => 'name'
            ]
        ];
    }

    public function owner()
    {
        return $this->belongsTo(User::class);
    }

    public function twitter_accounts()
    {
        return $this->morphedByMany(Twitter::class, 'accountable');
    }
    // Add below Other Accounts
}

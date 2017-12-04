<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;
use Cviebrock\EloquentSluggable\SluggableScopeHelpers;

class Post extends Model
{
    use Sluggable,SluggableScopeHelpers;

    protected $fillable = [
        'title', 'slug'
    ];

    public function sluggable()
    {
        return [
            'slug' => [
                'source' => 'title'
            ],
        ];
    }

    public function postable()
    {
        return $this->morphTo();
    }

    public static function last()
    {
        return self::latest()->first();
    }
}

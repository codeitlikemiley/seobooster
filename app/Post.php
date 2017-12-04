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

    public function socialpost()
    {
        return $this->morphedByMany(SocialPost::class, 'postable');
    }
    
    public function videopost()
    {
        return $this->morphedByMany(VideoPost::class, 'postable');
    }

    public function blogpost()
    {
        return $this->morphedByMany(BlogPost::class, 'postable');
    }

    public static function last()
    {
        return self::latest()->first();
    }
}

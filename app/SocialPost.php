<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia\Interfaces\HasMediaConversions;
use Spatie\MediaLibrary\HasMedia\HasMediaTrait;

class SocialPost extends Model implements HasMediaConversions
{
    use HasMediaTrait;

    protected $fillable = [
        'description', 'url', 'spin', 'scheduled_at'
    ];

    protected $dates = ['created_at', 'updated_at', 'scheduled_at', 'posted_at'];

    public function posts()
    {
        return $this->morphMany(Post::class, 'postable');
    }

    /* uses laravel queue system , use laravel horizon */
    public function registerMediaConversions(Media $media = null)
    {
        $this->addMediaConversion('thumb')
              ->width(150)
              ->height(150)
              ->sharpen(10);
    }

    public static function last()
    {
        return self::latest()->first();
    }
}

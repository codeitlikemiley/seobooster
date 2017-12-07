<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\TwitterPostTwitterAccount;

class TwitterPost extends Model
{
    protected $table = "twitter_posts";

    protected $fillable = [
        'status', 
        'in_reply_to_status_id', 
        'auto_populate_reply_metadata', 
        'exclude_reply_user_ids', 
        'attachment_url', 
        'media_ids',
        'possibly_sensitive',
        'lat',
        'long',
        'place_id',
        'display_coordinates',
        'trim_user',
        'enable_dm_commands',
        'fail_dm_commands',
    ];

    protected $dates = ['created_at', 'updated_at', 'posted_at'];
    
    /* check if this is correct */
    public function accounts()
    {
        // 1nd arg = table name
        // 2rd arg = current model column name
        // 3rd arg = joining table column name
        return $this->belongsToMany(Twitter::class,'twitter_post_twitter_account','twitter_post_id','twitter_account_id');
    }
}

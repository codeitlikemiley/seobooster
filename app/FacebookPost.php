<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\App\FacebookPostFacebookAccount;

class FacebookPost extends Model
{
    protected $table = "facebook_posts";

    protected $fillable = [
        'description',
        'image',
        'caption'
    ];

    protected $dates = ['created_at', 'updated_at', 'posted_at', 'scheduled_at'];

    /* check if this is correct */
    public function accounts()
    {
        // 1nd arg = table name
        // 2rd arg = current model column name
        // 3rd arg = joining table column name
        return $this->belongsToMany(Facebook::class,'facebook_post_facebook_account','facebook_post_id','facebook_account_id');
    }
}

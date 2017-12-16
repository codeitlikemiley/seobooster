<?php

namespace App\Http\Controllers;

use App\Post;
use App\Account;
use App\BlogPost;
use App\Provider;
use App\VideoPost;
use Carbon\Carbon;
use App\SocialPost;
use Illuminate\Http\Request;

class PostController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param str $type (url param)
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, $type)
    {
        //! use a DB transcaction here to revert if failed
        DB::beginTransaction();
        try {
            //! Create Type of Post Model (Social, Blog, Video)
            $postArray = $this->createPostType($type);
            //! Recursively Create Post For Each Accounts Under Post Type
            $this->createAllPostByTypeForAllAccounts($type,$postArray);
        }catch (\Exception $e){
            //! just catch anyexception that would be thrown
            DB::rollback();
        }
        DB::commit();
       
    }

    private function createPostType($type)
    {
        if($type === 'social'){
            $socialPost =new SocialPost;
            $socialPost->fill($request->all());
            $socialPost->save();
            return $socialPost->toArray();
        }
        if($type === 'blog'){
            $blogPost = new BlogPost;
            $blogPost->fill($request->all());
            $blogPost->save();
            return $blogPost->toArray();
        }
        if($type === 'video'){
            $videoPost = new VideoPost;
            $videoPost->fill($request->all());
            $videoPost->save();
            return $videoPost->toArray();
        }
        
    }
    /**
     * createAllPostByType function
     *
     * @param [string] $type 
     * @param [array] $post
     * @return void
     */
    private function createAllPostByTypeForAllAccounts($type,$postArray)
    {
        $models = Provider::where('type', $type)->pluck('post_model');
            foreach($models as $model){
                $accounts = Account::where('user_id', $request->user()->id)->where('type', $type)->where('post_model', $model)->get();
                //! check if User Has Any Account
                if(!empty($accounts)){
                    //! Itterate thru all Account
                    foreach($accounts as $index => $account){
                        //! Return an Array of Provider User ID for activated account Only , ie.: $twitter_ids
                        //! Dynamically Generate A Variable
                        //! Rejet Not Active Account
                        ${$account->name .'_ids'} = $accounts[$index]->{$account->name .'_accounts'}->reject(function ($account) {
                                return $account->active === false;
                            })->map(function ($account) {
                                return $account->user_id;
                            });
                            if(!empty(${$account->name .'_ids'})){
                                //! itterate in all active account ONLY as ID
                                foreach(${$account->name .'_ids'} as $id){
                                    //! Upload Image to Specific Endpoint depending on provider
                                    //! note for multiple account we only need to upload one image then we can use the image id 
                                    //! In other Account
                                    //? ADD HERE YOUR UPLOAD METHOD
                                    //! Create a Dynamic Function
                                    ${'create'.ucfirst($account->name).'Post'} = 'create'.ucfirst($account->name).'Post';
                                    //! Check If A Method Exist For that Post , Using Dynamic Generated Method Name
                                    if(method_exists(get_called_class(), ${'create'.ucfirst($account->name).'Post'}))
                                    {
                                        //! Create Specific Post, pass PARAMS {$request,$model,$id}
                                        //? this should return an instance of post ie. TwitterPost
                                        $post = $this->${'create'.ucfirst($account->name).'Post'}($request,$model,$id);
                                        // PublishTwitterPost
                                        //! Define queque name
                                        ${$account->name.'-post'} = $account->name.'-post';
                                        //! Define Job Model
                                        ${$account->job_model} = $account->job_model;
                                        //! Schedule a Post
                                        //? $scheduleat should be a carbon instance of the date time
                                        dispatch((new ${$account->job_model}($post))->onQueue(${$account->name.'-post'})->delay($post->scheduled_at));

                                    }else{
                                        throw new \Exception('Method Does Not Exist: '. ${'create'.ucfirst($account->name).'Post'});
                                    }
                                }
                            }else{
                                throw new Exception('User Have No Active Account For This Provider: '. $account->name);
                            }
                    }
                }else{
                    throw new Exception('User Have No Accounts For Posting');
                }
                
            }
    }
    /**
     * Schedule A Twitter Post function
     *
     * @param Request $request
     * @param Model $model
     * @param [TwitterUserId] $id
     * @return void
     */
    private function createTwitterPost(Request $request,Model $model,$id)
    {
        //! https://upload.twitter.com/1.1/media/upload.json
        $post = new $model;
        $post->status = $request->description;
        $post->attachment_url = $request->url;
        $post->scheduled_at = $request->scheduled_at;
        $post->save();
        return $post;
        //! https://api.twitter.com/1.1/statuses/update.json
        // $this->uploadImage();
        // $post->media_ids = $this->uploadImage();

    }
    //? please read instruction.md
    private function createFacebookPost(Request $request,Model $model,$id)
    {
        //! upload photos
        //! /object-id/photos
        dd('creating facebook post');
        //! post to newsfeed
        //! object-id/feed
    }

    private function createTumblrPost(Request $request,Model $model,$id)
    {
        dd('creating twitter post');
    }

    private function createWordPressPost(Request $request,Model $model,$id)
    {
        dd('creating twitter post');
    }

    //! DEFINE ALL METHODS HERE FOR CREATING POST FOR EACH ACCOUNT

}

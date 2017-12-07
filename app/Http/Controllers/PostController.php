
<?php

namespace App\Http\Controllers;

use App\Post;
use App\Account;
use App\BlogPost;
use App\Provider;
use App\VideoPost;
use App\SocialPost;
//! IMPORT HERE ALL POST MODEL THAT WE WILL USE
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
                                    //! Check If A Method Exist For that Post , Using Dynamic Generated Method Name
                                    if(method_exists(get_called_class(), ${'create'.ucfirst($account->name).'Post'}))
                                    {
                                        //! Create Specific Post, pass PARAMS {$request,$model,$id}
                                        $this->${'create'.ucfirst($account->name).'Post'}($request,$model,$id);
                                    }else{
                                        throw new \Exception('Method Does Not Exist: '. ${'create'.ucfirst($account->name).'Post'});
                                    }
                                    
                                    //! Schedule a Post
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

    private function createTwitterPost()
    {
        dd('creating twitter post');
    }

    private function createFacebookPost()
    {
        dd('creating twitter post');
    }

    private function createTumblrPost()
    {
        dd('creating twitter post');
    }

    private function createWordPressPost()
    {
        dd('creating twitter post');
    }

    //! DEFINE ALL METHODS HERE FOR CREATING POST FOR EACH ACCOUNT

}

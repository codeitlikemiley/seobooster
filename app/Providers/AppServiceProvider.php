<?php

namespace App\Providers;

use App\User;
use App\Link;
use App\Observers\UserObserver;
use App\Observers\LinkObserver;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\ServiceProvider;
use Illuminate\Queue\Events\JobProcessed;
use Illuminate\Queue\Events\JobProcessing;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        User::observe(UserObserver::class);
        Link::observe(LinkObserver::class);

        //! Update Posted AT
        Queue::after(function (JobProcessed $event) {
            $string = $event->job->payload()['tags'][0];
            $modelEntities = explode(':', $string, 2); //
            //? Separate Model and ID in array ["App\TwitterPost","1",]
            $model =  $modelEntities[0];
            $modelId = $modelEntities[1];
            //! Create New Instance Of Model
            $model = new $model;
            //! Find Model by ID
            $post = $model->find($modelId);
            //! Update Updated @
            $post->posted_at = true;
            $post->save();
            Log::info('Job Object:',$post->toArray());
        });
        //!  rollback any transactions that were left open by a previously failed job
        Queue::looping(function () {
            while (DB::transactionLevel() > 0) {
                DB::rollBack();
            }
        });
        
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        
    }
}

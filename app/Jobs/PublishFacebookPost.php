<?php

namespace App\Jobs;

use App\FacebookPost;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class PublishFacebookPost implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $post;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(FacebookPost $facebok)
    {
        $this->post = $facebook;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        sleep(3);
        //! make an api call then pass all our twitter post model public properties to post to twitter
        //! post to Twitter the new Status
        //! if posted successfully update posted_at
    }
}

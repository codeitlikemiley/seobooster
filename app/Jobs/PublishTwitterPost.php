<?php

namespace App\Jobs;

use App\TwitterPost;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class PublishTwitterPost implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    protected $post;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(TwitterPost $twitter)
    {
        $this->post = $twitter;
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

<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTwitterPostTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // change this to adhere to our general api , we only need here is the status
        // of we just need to transform this using laravel resource api
        // to change the data representation from description to status
        Schema::create('twitter_posts', function (Blueprint $table) {
            $table->increments('id');
            $table->bigInteger('twitter_id')->nullable();
            $table->string('status'); // message // change this to description
            $table->bigInteger('in_reply_to_status_id')->nullable();
            $table->boolean('auto_populate_reply_metadata')->default(0);
            $table->json('exclude_reply_user_ids')->nullable(); // array of user ids
            $table->string('attachment_url')->nullable();
            $table->bigInteger('media_ids')->nullable();// up to 4 photos
            //https://developer.twitter.com/en/docs/media/upload-media/api-reference/post-media-upload-init.html
            $table->boolean('possibly_sensitive')->default(0);
            $table->decimal('lat', 10, 7)->nullable();
            $table->decimal('long', 10, 7)->nullable();
            $table->string('place_id')->nullable();
            $table->boolean('display_coordinates')->default(0);
            $table->boolean('trim_user')->default(0);
            $table->boolean('enable_dm_commands')->default(0);
            $table->boolean('fail_dm_commands')->default(0);
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('posted_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('twitter_posts');
    }
}

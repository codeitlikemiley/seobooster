<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFacebookPostTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('facebook_posts', function (Blueprint $table) {
            $table->increments('id');
            $table->bigInteger('facebook_id')->nullable();
            $table->text('message'); // message // change this to description
            $table->string('link')->nullable();
            $table->string('place')->nullable();
            $table->text('tags')->nullable();
            $table->json('privacy')->nullable();
            $table->string('object_attachment')->nullable(); //? Facebook ID for an existing picture in the person's photo albums
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('posted_at')->nullable();
            //! maybe we can add facebook groups relationships , save all fb groups ids
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
        Schema::dropIfExists('facebook_posts');
    }
}

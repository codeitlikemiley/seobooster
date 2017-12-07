<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProvidersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('providers', function (Blueprint $table) {
            $table->increments('id');
            $table->enum('type', ['blog', 'social', 'video']);
            /* pattern based on laravel socialite */
            $table->string('name');
            $table->string('icon')->nullable();
            $table->string('icon_color')->nullable();
            $table->string('slug')->unique();
            /* namespace of the model for our providers */
            $table->string('account_model'); // useful for creating new account
            $table->string('post_model'); // useful for creating new post
            /* will be used for route provider slug */
            $table->string('client_id');
            $table->string('client_secret');
            $table->string('redirect_url');
            $table->json('scope')->nullable();
            $table->json('config')->nullable();
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
        Schema::dropIfExists('providers');
    }
}

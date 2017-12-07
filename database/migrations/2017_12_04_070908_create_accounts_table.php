<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAccountsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('accounts', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->enum('type', ['blog', 'social', 'video']);
            $table->string('name');
            $table->string('icon')->nullable();
            $table->string('icon_color')->nullable();
            /* namespace of the model for our providers */
            $table->string('account_model');
            $table->string('post_model');
            /* will be used for route provider slug */
            $table->string('slug')->unique();
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
        Schema::dropIfExists('accounts');
    }
}

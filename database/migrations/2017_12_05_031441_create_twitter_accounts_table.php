<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTwitterAccountsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('twitter_accounts', function (Blueprint $table) {
            $table->increments('id');
            /* User Id of the user Who Owns This Account */
            $table->unsignedBigInteger('user_id')->nullable();
            /* account ID of Facebook */
            $table->unsignedBigInteger('provider_id')->nullable();
            $table->string('username')->unique();
            $table->string('access_token')->nullable();
            $table->string('access_token_secret')->nullable();
            /* scope that is given permission */
            $table->json('scope')->nullable();
            /* revoke or approve */
            $table->boolean('active')->default(0);
            $table->boolean('revoked')->default(0);
            $table->timestamp('expires_at')->nullable();
            $table->index(['user_id','username']);
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
        Schema::dropIfExists('twitter_o_auths');
    }
}

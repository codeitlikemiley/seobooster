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
            /* added for determining type of account */
            $table->enum('provider', ['blog', 'social', 'video']);
            /* can either be an email or username */
            $table->string('username');
            /* save this access token after authenticating the user social account */
            $table->string('access_token')->nullable();
            $table->string('refresh_token')->nullable();
            $table->timestamp('expires_at')->nullable();
            /* save all the scope ask during authentication */
            /* the scope should be done on the front end */
            $table->json('scope')->nullable();
            /* the name of the social network ie: fb, google, wordpress */
            /* below are all the old table fields */
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

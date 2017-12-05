<?php

use App\Account;
use App\Provider;
use Illuminate\Database\Seeder;

class ProviderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        /* this one will be the source of truth for every new Account created */
        $provider = new Provider;
        $provider->type = 'social';
        $provider->name = 'twitter';
        $provider->model = 'App\Twitter';
        $provider->client_id = str_random(30);
        $provider->client_secret = str_random(30);
        $provider->redirect_url = 'http://seobooster.app/providers/twitter/callback';
        // we should have a fix scope or config
        $provider->save();
        /* this is user specific, they can change their api keys at will */
        /* they can log in using all accounts with this api settings */
        // if a provider exist avoid creating a new one when creating a new account
        // use slug to verify uniqueness
        $account = new Account;
        $account->user_id = 1;
        $account->type = 'social';
        $account->name = 'twitter';
        $account->model = 'App\Twitter';
        $account->client_id = str_random(30);
        $account->client_secret = str_random(30);
        $account->redirect_url = 'http://seobooster.app/providers/twitter/callback';
        // we should have a fix scope or config
        
        $twitter = new $account->model;
        // we need to add dynamic validation logic for each type of account/providers
        $twitter->user_id = 1;
        $twitter->username = 'urigh17';
        $twitter->access_token = str_random(30);
        $twitter->access_token_secret = str_random(30);
        $twitter->save();
        $twitter->accounts()->save($account);
        $account->save();

        $twitter1 = new $account->model;
        // logic to determine what we will fill
        $twitter1->user_id = 1;
        $twitter1->username = 'urigh172';
        $twitter1->access_token = str_random(30);
        $twitter1->access_token_secret = str_random(30);
        $twitter1->save();
        $twitter1->accounts()->save($account);
    }
}

<?php

use App\Account;
use App\Provider;
use Illuminate\Database\Seeder;
use App\User;

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
        $provider->account_model = 'App\Twitter';
        $provider->post_model = 'App\TwitterPost';
        $provider->job_model = 'App\Jobs\PublishTwitterPost';
        $provider->client_id = str_random(30);
        $provider->client_secret = str_random(30);
        $provider->redirect_url = 'http://seobooster.app/providers/twitter/callback';
        // we should have a fix scope or config
        $provider->save();
        /* this is user specific, they can change their api keys at will */
        /* they can log in using all accounts with this api settings */
        // if a provider exist avoid creating a new one when creating a new account
        // use slug to verify uniqueness
        // in creating a new account we need to find specific provider id or by slug
        // account holds all our twitter account for example
        // and all our api credentials
        $account = new Account;
        $account->user_id = User::first()->id;
        $account->fill($provider->toArray());
        // $account->user_id = 1;
        // $account->name = $provider->name;
        // $account->type = $provider->type;
        // $account->account_model = $provider->account_model;
        // $account->post_model = $provider->post_model;
        // $account->client_id = $provider->client_id;
        // $account->client_secret = $provider->client_secret;
        // $account->redirect_url = 'http://seobooster.app/providers/twitter/callback';
        // we should have a fix scope or config
        
        $twitter = new $account->account_model;
        // we need to add dynamic validation logic for each type of account/providers
        $twitter->user_id = 1;
        $twitter->username = 'urigh17';
        $twitter->access_token = str_random(30);
        $twitter->access_token_secret = str_random(30);
        $twitter->save();
        $twitter->accounts()->save($account);
        $account->save();

        $twitter1 = new $account->account_model;
        // logic to determine what we will fill
        $twitter1->user_id = 1;
        $twitter1->username = 'urigh172';
        $twitter1->access_token = str_random(30);
        $twitter1->access_token_secret = str_random(30);
        $twitter1->save();
        $twitter1->accounts()->save($account);
        // we can do something like this
        // $account->twitter_accounts
    }
}

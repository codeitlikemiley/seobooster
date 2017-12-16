<?php

namespace SocialiteProviders\Facebook;

use Illuminate\Support\Arr;
use GuzzleHttp\ClientInterface;
use SocialiteProviders\Manager\OAuth2\User;
use Laravel\Socialite\Two\ProviderInterface;
use Laravel\Socialite\Two\InvalidStateException;
use SocialiteProviders\Manager\OAuth2\AbstractProvider;

class Provider extends AbstractProvider implements ProviderInterface
{
    const IDENTIFIER = 'FACEBOOK';

    protected $graphUrl = 'https://graph.facebook.com';
    protected $version = 'v2.11';

    protected $fields = ['name', 'email', 'gender', 'verified', 'link'];

    protected $scopes = ['email', 'manage_pages','publish_actions'];
    //! publish_actions - for profile posting
    //! manage_pages / publish_pages for - posting to fan pages
    //! user_managed_groups + publish actions = post only on your group own
    //! end point to hit for posting : {groupid}/feed

    protected function getAuthUrl($state)
    {
        return $this->buildAuthUrlFromBase('https://www.facebook.com/'.$this->version.'/dialog/oauth', $state);
    }

    /**
     * {@inheritdoc}
     */
    protected function getTokenUrl()
    {
        return $this->graphUrl.'/'.$this->version.'/oauth/access_token';
    }
    
}

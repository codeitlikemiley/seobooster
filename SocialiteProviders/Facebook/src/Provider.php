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
    /**
     * Unique Provider Identifier.
     */
    const IDENTIFIER = 'FACEBOOK';

    protected $graphUrl = 'https://graph.facebook.com';
    protected $version = 'v2.11';

    protected $fields = ['name', 'email', 'gender', 'verified', 'link'];

    /**
     * {@inheritdoc}
     */
    protected $scopes = ['email', 'manage_pages','publish_actions'];
    //! publish_actions - for profile posting
    //! manage_pages / publish_pages for - posting to fan pages
    //! user_managed_groups + publish actions = post only on your group own
    //! end point to hit for posting : {groupid}/feed
    /**
     * {@inheritdoc}
     */

    /**
     * Display the dialog in a popup view.
     *
     * @var bool
     */
    protected $popup = false;

    /**
     * Re-request a declined permission.
     *
     * @var bool
     */
    protected $reRequest = false;

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

    /**
     * {@inheritdoc}
     */
    public function getAccessTokenResponse($code)
    {
        $postKey = (version_compare(ClientInterface::VERSION, '6') === 1) ? 'form_params' : 'body';

        $response = $this->getHttpClient()->post($this->getTokenUrl(), [
            $postKey => $this->getTokenFields($code),
        ]);

        $data = [];

        $data = json_decode($response->getBody(), true);

        return Arr::add($data, 'expires_in', Arr::pull($data, 'expires'));
    }

    /**
     * {@inheritdoc}
     */
    protected function getUserByToken($token)
    {
        $meUrl = $this->graphUrl.'/'.$this->version.'/me?access_token='.$token.'&fields='.implode(',', $this->fields);

        if (! empty($this->clientSecret)) {
            $appSecretProof = hash_hmac('sha256', $token, $this->clientSecret);

            $meUrl .= '&appsecret_proof='.$appSecretProof;
        }

        $response = $this->getHttpClient()->get($meUrl, [
            'headers' => [
                'Accept' => 'application/json',
            ],
        ]);

        return json_decode($response->getBody(), true);
    }

    /**
     * {@inheritdoc}
     */
    protected function mapUserToObject(array $user)
    {
        $avatarUrl = $this->graphUrl.'/'.$this->version.'/'.$user['id'].'/picture';

        return (new User)->setRaw($user)->map([
            'id' => $user['id'], 'nickname' => null, 'name' => isset($user['name']) ? $user['name'] : null,
            'email' => isset($user['email']) ? $user['email'] : null, 'avatar' => $avatarUrl.'?type=normal',
            'avatar_original' => $avatarUrl.'?width=1920',
            'profileUrl' => isset($user['link']) ? $user['link'] : null,
        ]);
    }

    /**
     * {@inheritdoc}
     */
    protected function getCodeFields($state = null)
    {
        $fields = parent::getCodeFields($state);

        if ($this->popup) {
            $fields['display'] = 'popup';
        }

        if ($this->reRequest) {
            $fields['auth_type'] = 'rerequest';
        }

        return $fields;
    }

    /**
     * Set the user fields to request from Facebook.
     *
     * @param  array  $fields
     * @return $this
     */
    public function fields(array $fields)
    {
        $this->fields = $fields;

        return $this;
    }

    /**
     * Set the dialog to be displayed as a popup.
     *
     * @return $this
     */
    public function asPopup()
    {
        $this->popup = true;

        return $this;
    }

    /**
     * Re-request permissions which were previously declined.
     *
     * @return $this
     */
    public function reRequest()
    {
        $this->reRequest = true;

        return $this;
    }
    public function user()
    {
        if ($this->hasInvalidState()) {
            throw new InvalidStateException;
        }

        $response = $this->getAccessTokenResponse($this->getCode());

        $user = $this->mapUserToObject($this->getUserByToken(
            $token = Arr::get($response, 'access_token')
        ));

        return $user;
    }
}

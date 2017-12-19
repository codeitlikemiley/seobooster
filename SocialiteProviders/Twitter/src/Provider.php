<?php

namespace SocialiteProviders\Twitter;

use SocialiteProviders\Manager\OAuth1\AbstractProvider;
use SocialiteProviders\Manager\OAuth1\User;

class Provider extends AbstractProvider
{
    /**
     * Unique Provider Identifier.
     */
    const IDENTIFIER = 'TWITTER';

    /**
     * {@inheritDoc}
     */
    protected function mapUserToObject(array $user)
    {
        return (new User())->setRaw($user['extra'])->map([
             'id' => $user['id'],
             'nickname' => $user['nickname'],
             'name' => $user['name'],
             'email' => $user['email'],
             'avatar' => $user['avatar'],
        ]);
    }

    public function user()
    {
        if (! $this->hasNecessaryVerifier()) {
            throw new InvalidArgumentException('Invalid request. Missing OAuth verifier.');
        }
        $user = $this->server->getUserDetails($token = $this->getToken());
        $extraDetails = [
            'location' => $user->location,
            'description' => $user->description,
        ];
        $instance = (new User)->setRaw(array_merge($user->extra, $user->urls, $extraDetails));
        return $instance->map([
            'id' => $user->uid, 'nickname' => $user->nickname,
            'name' => $user->name, 'email' => $user->email, 'avatar' => $user->imageUrl,
            'avatar_original' => str_replace('_normal', '', $user->imageUrl),
        ]);
    }
}

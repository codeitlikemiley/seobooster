<?php

namespace SocialiteProviders\Youtube;

use SocialiteProviders\Manager\SocialiteWasCalled;

class YoutubeExtendSocialite
{
    /**
     * Execute the provider.
     */
    public function handle(SocialiteWasCalled $socialiteWasCalled)
    {
        $socialiteWasCalled->extendSocialite('youtube', __NAMESPACE__.'\Provider');
    }
}

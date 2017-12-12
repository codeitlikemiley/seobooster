<?php

namespace SocialiteProviders\Facebook;

use SocialiteProviders\Manager\SocialiteWasCalled;

class FacebookExtendSocialite
{
    
    /**
     * Execute the provider.
     */
    public function handle(SocialiteWasCalled $socialiteWasCalled)
    {
        $socialiteWasCalled->extendSocialite('facebook', __NAMESPACE__.'\Provider');
    }
}

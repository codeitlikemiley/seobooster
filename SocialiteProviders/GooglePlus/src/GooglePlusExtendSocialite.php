<?php

namespace SocialiteProviders\GooglePlus;

use SocialiteProviders\Manager\SocialiteWasCalled;

class GooglePlusExtendSocialite
{
    /**
     * Execute the provider.
     */
    public function handle(SocialiteWasCalled $socialiteWasCalled)
    {
        $socialiteWasCalled->extendSocialite('googleplus', __NAMESPACE__.'\Provider');
    }
}

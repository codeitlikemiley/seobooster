<?php

namespace SocialiteProviders\DailyMotion;

use SocialiteProviders\Manager\SocialiteWasCalled;

class DailyMotionExtendSocialite
{
    /**
     * Execute the provider.
     */
    public function handle(SocialiteWasCalled $socialiteWasCalled)
    {
        $socialiteWasCalled->extendSocialite('dailymotion', __NAMESPACE__.'\Provider');
    }
}

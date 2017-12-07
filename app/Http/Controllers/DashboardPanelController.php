<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardPanelController extends Controller
{
    private function getPostLifeTime()
    {
        return Post::count();
    }

    private function getMonthlyPost()
    {
        /* CHANGE THIS COUNT POST FOR EACH TYPE OF ACCOUNT */
        /* THEN ADD ALL COUNT FOR THAT CURRENT MONTH */
        /* this is a subPost relationship under post, which is BlogPost,Social Post and VideoPost */
        return Post::whereBetween('posted_at' , [Carbon::now(),Carbon::now()->addMonths(1)]);
    }

    private function getAccounts()
    {
        return Account::where('user_id', request()->user())->count();
    }
}

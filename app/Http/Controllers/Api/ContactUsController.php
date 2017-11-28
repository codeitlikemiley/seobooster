<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Mail\ContactUsMail;
use App\User;

class ContactUsController extends Controller
{
    public function contact(Request $request)
    {
        $data = request()->validate([
            'name' => [
                'required',
                'regex:/(^[A-Za-z0-9 ]+$)+/'
            ],
            'email' => [
                'required',
                'email'
            ],
            'subject' => [
                'present',
                'required'
            ],
            'message' => [
                'present',
                'required'
            ],
        ]);
        $user = User::findByUsername('admin');
        \Mail::to($user)
        ->queue(new ContactUsMail($data));
        return response()->json(['message' => 'Mail Sent'],200);
    }
}

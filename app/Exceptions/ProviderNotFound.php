<?php

namespace App\Exceptions;

use Illuminate\Http\Request;

class ProviderNotFound extends \Exception

{
    public function render(Request $request)
    {
        return response()->json(['message' => 'Provider Not Found Exception: '],404);
    }
}

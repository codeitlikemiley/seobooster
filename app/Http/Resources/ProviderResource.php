<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\Resource;
use App\Http\Resources\Account\AccountResource;

class ProviderResource extends Resource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name, 
            'type' => $this->type,
            'icon' => $this->icon,
            'icon_color' => $this->icon_color,
            'slug' => $this->slug,
            'account_model' => $this->account_model,
            'post_model' => $this->post_model,
            'job_model' => $this->job_model,
            'client_id' => $this->client_id,
            'client_secret' => $this->client_secret,
            'redirect_url' => $this->redirect_url,
            'scope' => $this->scope ?? [],
            'config' => $this->config ?? json_encode (json_decode ("{}")),
            'accounts' => AccountResource::collection($this->whenLoaded('accounts')),
        ];
    }
}

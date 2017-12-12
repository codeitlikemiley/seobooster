<?php

namespace App\Http\Resources\Account;

use Illuminate\Http\Resources\Json\Resource;

class AccountResource extends Resource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        ${$this->name.'_accounts'} = $this->name. '_accounts';
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'icon' => $this->icon,
            'icon_color' => $this->icon_color,
            'account_model' => $this->account_model,
            'post_model' => $this->post_model,
            'job_model' => $this->job_model,
            'client_id' => $this->client_id,
            'client_secret' => $this->client_secret,
            'redirect_url' => $this->redirect_url,
            'scope' => $this->scope ?? [],
            'config' => $this->config ?? json_encode (json_decode ("{}")),
            //! Fine Grain Post to Load Using Each Of Their Resources
            'accounts' => $this->whenLoaded(${$this->name.'_accounts'}),
        ];
    }
}

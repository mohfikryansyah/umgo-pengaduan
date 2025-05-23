<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AuthUserResource extends JsonResource
{
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'username' => $this->username,
            'nim' => $this->nim,
            'email' => $this->email,
            'email_verified_at' => $this->email_verified_at,
            'roles' => $this->getRoleNames(),
            'avatar' => $this->avatar,
        ];
    }
}

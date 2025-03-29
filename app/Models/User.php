<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    /**
     * Apply filters, sorting, and pagination to the query.
     *
     * @param Builder $query
     * @return Builder
     */
    public static function applyQueryParams(Builder $query)
    {
        // Apply filters
        if (request()->has('name')) {
            $query->where('name', 'LIKE', '%' . request('name') . '%');
        } elseif (request()->has('email')) {
            $query->where('email', 'LIKE', '%' . request('email') . '%');
        }

        // Apply sorting
        $sortField = request('sort_field', 'id');
        $sortDirection = request('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        // Return query
        return $query;
    }
}

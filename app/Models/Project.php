<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    /** @use HasFactory<\Database\Factories\ProjectFactory> */
    use HasFactory;
    protected $fillable = [
        'name', 'description', 'status', 'image_path', 'due_date', 'created_by', 'updated_by'
    ];

// Helper methods
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
        } elseif (request()->has('status')) {
            $query->where('status', request('status'));
        }

        // Apply sorting
        $sortField = request('sort_field', 'id');
        $sortDirection = request('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        // Return query
        return $query;
    }
    
    // Relationships
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}

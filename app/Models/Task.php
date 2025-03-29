<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    /** @use HasFactory<\Database\Factories\TaskFactory> */
    use HasFactory;
    protected $fillable = [
        'name', 'description', 'status', 'image_path', 'due_date', 'priority', 'assigned_to', 'project_id', 'created_by', 'updated_by'
    ];
// helper methods
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
    public function project()
    {
        return $this->belongsTo(Project::class);
    }
    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to');
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

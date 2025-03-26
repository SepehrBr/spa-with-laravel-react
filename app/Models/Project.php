<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    /** @use HasFactory<\Database\Factories\ProjectFactory> */
    use HasFactory;
    protected $fillable = [
        'name', 'description', 'status', 'image_path', 'due_date', 'created_by', 'updated_by'
    ];

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}

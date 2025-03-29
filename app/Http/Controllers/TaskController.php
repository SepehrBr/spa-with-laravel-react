<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Project;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Throwable;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // pagination
        $tasks = Task::applyQueryParams(Task::query())->paginate(perPage: 10)->onEachSide(1);

        return Inertia::render('Tasks/Index', [
                'tasks' => TaskResource::collection($tasks),
                'queryParams' => request()->query() ?: null,
                'success' => session('success') ?: null,
            ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $projects = Project::all();
        $users = User::all();

        return Inertia::render('Tasks/Create', [
            'projects' => $projects,
            'users' => $users,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        $data = $request->validated();

        // add created_by and updated_by fields to the data array
        $data['created_by'] = Auth::id();
        $data['updated_by'] = Auth::id();

        // store image and add path to it
        $image = $request->file('image');
        if ($image) {
            $data['image_path'] = $image->store('tasks/images/' . Str::random(10), 'public'); // Store the image in the public disk
        }

        // find project assigned to it and set it to data array
        $project = Project::find($data['project']);
        unset($data['project']);
        $data['project_id'] = $project->id;

        try {
            // create new task and add to DB
            $task = Task::create($data);

            // Return a JSON response for API requests
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Task created successfully.',
                    'data' => new TaskResource($task),
                ], 201);
            }

            // Redirect to the tasks index page with a success message
            return redirect()->route('tasks.index')->with('success', "Task \"$task->name\" for Project \"$project->name\", created successfully.");
        } catch (Exception $e) {
            // Return a JSON response for API requests
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to create task. Please try again.',
                    'error' => $e->getMessage(),
                ], 500);
            }
            // Handle the exception and redirect back with an error message
            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => 'Failed to create task. Please try again.']);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        return Inertia::render('Tasks/Show', [
            'task' => new TaskResource($task)
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        $projects = Project::all();
        $users = User::all();

        return Inertia::render('Tasks/Edit', [
            'projects' => $projects,
            'users' => $users,
            'task' => new TaskResource($task),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        $data = $request->validated();

        // update created_by and updated_by fields
        $data['updated_by'] = Auth::id();

        // store new image and update path of it
        $image = $request->file('image');
        if ($image) {
            // check if image exists, delete previous one
            if ($task->image_path) {
                Storage::disk('public')->deleteDirectory(dirname($task->image_path));
            }

            // update new added image path
            $data['image_path'] = $image->store('tasks/images/' . Str::random(10), 'public'); // Store the image in the public disk
        }

        // find project assigned to it and set it to data array
        $project = Project::find($data['project']);
        unset($data['project']);
        $data['project_id'] = $project->id;

        try {
            $task->update($data);

            // Return a JSON response for API requests
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Project updated successfully.',
                    'data' => new TaskResource($task),
                ], 200);
            }

            // Redirect to the tasks index page with a success message
            return redirect()->route('tasks.index')->with('success', "Task \"$task->name\" for Project \"$project->name\", updated successfully.");
        } catch (Throwable $e) {
            // return a JSON response for API request
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to update task. Please try again later.',
                    'error' => $e->getMessage()
                ], 500);
            }

            // return back with error message
            return redirect()->back()->withInput()->withErrors(['error' => 'Failed to update task. Please try again later.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        try {
            $task->delete();

            // delete image and its path from public disk
            if ($task->image_path) {
                Storage::disk('public')->deleteDirectory(dirname($task->image_path));
            }

            // Return a JSON response for API requests
            if (request()->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Task deleted successfully.',
                ], 200);
            }

            // Redirect to the tasks index page with a success message
            return redirect()->route('tasks.index')->with('success', 'Task deleted successfully.');
       } catch (\Illuminate\Database\QueryException $e) {
            // Handle foreign key constraint violation
            if (request()->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to delete task. It may have related tasks or dependencies.',
                    'error' => $e->getMessage(),
                ], 422); // 422 Unprocessable Entity
            }

            // Redirect back with an error message
            return redirect()
                ->back()
                ->withErrors(['error' => 'Failed to delete task. It may have related tasks or dependencies.']);
       } catch (Exception $e) {
            // Handle any other exceptions
            if (request()->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to delete task. Please try again.',
                    'error' => $e->getMessage(),
                ], 500);
            }

            // Redirect back with a generic error message
            return redirect()
                ->back()
                ->withErrors(['error' => 'Failed to delete task. Please try again.']);
       }
    }
}

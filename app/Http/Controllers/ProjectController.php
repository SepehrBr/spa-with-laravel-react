<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\TaskResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // add pagination
        $projects = Project::applyQueryParams(Project::query())->paginate(10)->onEachSide(2);

        return Inertia::render('Projects/Index', [
                'projects' => ProjectResource::collection($projects),
                'queryParams' => request()->query() ?: null,
                'success' => session('success') ?: null, // pass success message to the view if exists
            ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Projects/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectRequest $request)
    {
        $data = $request->validated();

        // add created_by and updated_by fields to the data array
        $data['created_by'] = Auth::id();
        $data['updated_by'] = Auth::id();

        // store image and add path to it
        $image = $request->file('image');
        if ($image) {
            $data['image_path'] = $image->store('projects/images/' . Str::random(10), 'public'); // Store the image in the public disk
        }

        try {
            // create new project and add to DB
            $project = Project::create($data);

            // Return a JSON response for API requests
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Project created successfully.',
                    'data' => new ProjectResource($project),
                ], 201);
            }

            // Redirect to the projects index page with a success message
            return redirect()->route('projects.index')->with('success', 'Project created successfully.');
        } catch (\Exception $e) {
            // Return a JSON response for API requests
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to create project. Please try again.',
                    'error' => $e->getMessage(),
                ], 500);
            }
            // Handle the exception and redirect back with an error message
            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => 'Failed to create project. Please try again.']);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        $query = $project->tasks()->getQuery();
        $tasks = Project::applyQueryParams($query)->paginate(perPage: 10)->onEachSide(1);

        return Inertia::render('Projects/Show', [
                'project' => new ProjectResource($project),
                'tasks' => TaskResource::collection($tasks),
                'queryParams' => request()->query() ?: null,
            ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        //
    }
}

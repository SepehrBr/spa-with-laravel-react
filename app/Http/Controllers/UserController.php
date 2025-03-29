<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserCrudResource;
use Exception;
use Inertia\Inertia;
use Throwable;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // add pagination
        $users = User::applyQueryParams(User::query())->paginate(10)->onEachSide(2);

        return Inertia::render('Users/Index', [
            'users' => UserCrudResource::collection($users),
            'queryParams' => request()->query() ?: null,
            'success' => session('success') ?: null, // pass success message to the view if exists
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Users/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();

        // bcrypt and hash password
        // $data['password'] = \Illuminate\Support\Facades\Hash::make($data['password']);
        $data['password'] = bcrypt($data['password']);

        try {
            // create new user and add to DB
            $user = User::create($data);

            // Return a JSON response for API requests
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'User created successfully.',
                    'data' => new UserCrudResource($user),
                ], 201);
            }

            // Redirect to the users index page with a success message
            return redirect()->route('users.index')->with('success', "User \"$user->name\" created successfully.");
        } catch (Exception $e) {
            // Return a JSON response for API requests
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to create user. Please try again.',
                    'error' => $e->getMessage(),
                ], 500);
            }
            // Handle the exception and redirect back with an error message
            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => 'Failed to create user. Please try again.']);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        return Inertia::render('Users/Edit', [
            'user' => new UserCrudResource($user)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $data = $request->validated();

        // update password is user implemented new one
        if ($data['password']) {
            $data['password'] = bcrypt($data['password']);
        } else {
            $data['password'] = bcrypt($user->password);
        }

        try {
            $user->update($data);

            // Return a JSON response for API requests
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'User updated successfully.',
                    'data' => new UserCrudResource($user),
                ], 200);
            }

            // Redirect to the Users index page with a success message
            return redirect()->route('users.index')->with('success', "User \"$user->name\" updated successfully.");
        } catch (Throwable $e) {
            // throw $e;
            // return a JSON response for API request
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to update User. Please try again later.',
                    'error' => $e->getMessage()
                ], 500);
            }

            // return back with error message
            return redirect()->back()->withInput()->withErrors(['error' => 'Failed to update User. Please try again later.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        try {
            $user->delete();

            // Return a JSON response for API requests
            if (request()->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'User deleted successfully.',
                ], 200);
            }

            // Redirect to the users index page with a success message
            return redirect()->route('users.index')->with('success', 'User deleted successfully.');
       } catch (\Illuminate\Database\QueryException $e) {
            // Handle foreign key constraint violation
            if (request()->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to delete user. It may have related tasks or dependencies.',
                    'error' => $e->getMessage(),
                ], 422); // 422 Unprocessable Entity
            }

            // Redirect back with an error message
            return redirect()
                ->back()
                ->withErrors(['error' => 'Failed to delete user. It may have related tasks or dependencies.']);
       } catch (Exception $e) {
            // Handle any other exceptions
            if (request()->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to delete user. Please try again later.',
                    'error' => $e->getMessage(),
                ], 500);
            }

            // Redirect back with a generic error message
            return redirect()
                ->back()
                ->withErrors(['error' => 'Failed to delete user. Please try again.']);
       }
    }
}

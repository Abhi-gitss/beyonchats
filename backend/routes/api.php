<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ArticleController;

// This is the default user route (keep it)
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// --- YOUR NEW ROUTES

// 1. Get all articles
Route::get('/articles', [ArticleController::class, 'index']);

// 2. Get one article
Route::get('/articles/{id}', [ArticleController::class, 'show']);
// 3. PUT requests
Route::put('/articles/{id}', [ArticleController::class, 'update']);
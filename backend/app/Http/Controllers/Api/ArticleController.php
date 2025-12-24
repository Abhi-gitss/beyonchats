<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Article;

class ArticleController extends Controller
{
    // 1. Get All Articles (Pagination is optional, we get all for now)
    public function index()
    {
        return response()->json([
            'data' => Article::orderBy('created_at', 'desc')->get()
        ]);
    }

    // 2. Get Single Article
    public function show($id)
    {
        $article = Article::find($id);
        if (!$article) {
            return response()->json(['message' => 'Article not found'], 404);
        }
        return response()->json($article);
    }

    // 3. Update Article (THIS WAS MISSING)
    public function update(Request $request, $id)
    {
        $article = Article::find($id);

        if (!$article) {
            return response()->json(['message' => 'Article not found'], 404);
        }

        // Update the article with whatever data is sent
        $article->update($request->all());

        return response()->json([
            'message' => 'Article updated successfully',
            'data' => $article
        ]);
    }
}
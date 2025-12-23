<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    // GET /api/articles
    // Returns a list of articles (paginated)
    public function index()
    {
        $articles = Article::orderBy('id', 'desc')->paginate(10);
        return response()->json($articles);
    }

    // GET /api/articles/{id}
    // Returns a single article's details
    public function show($id)
    {
        $article = Article::find($id);

        if (!$article) {
            return response()->json(['message' => 'Article not found'], 404);
        }

        return response()->json($article);
    }
}
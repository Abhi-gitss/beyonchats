<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'summary', 'content', 'source_url', 
        'image_url', 'published_at', 'generated_content', 
        'citations', 'is_processed'
    ];

    protected $casts = [
        'citations' => 'array',
        'is_processed' => 'boolean',
    ];
}
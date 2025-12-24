<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 
        'content', 
        'source_url', 
        'image_url', 
        'published_at',
        // These are the new fields we need to allow updates for:
        'generated_content',
        'citations',
        'is_processed'
    ];
}
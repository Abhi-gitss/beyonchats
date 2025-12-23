<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up(): void
{
    Schema::create('articles', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->text('summary')->nullable();
        $table->longText('content'); // Original content
        $table->string('source_url')->unique(); // Prevent duplicates
        $table->string('image_url')->nullable();
        $table->date('published_at')->nullable();
        
        // Fields for Phase 2 (AI Content)
        $table->longText('generated_content')->nullable(); 
        $table->json('citations')->nullable(); 
        $table->boolean('is_processed')->default(false); 
        
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};

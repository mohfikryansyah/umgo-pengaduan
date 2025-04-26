<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('status_pengaduans', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('pengaduan_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignUuid('pengaduan_khusus_id')->nullable()->constrained('pengaduan_khusus')->cascadeOnDelete();
            $table->string('status');
            $table->string('tindakan');
            $table->timestamps();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('status_pengaduans');
    }
};

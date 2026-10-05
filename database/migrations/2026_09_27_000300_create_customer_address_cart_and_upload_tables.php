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
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('label', 100)->nullable();
            $table->string('recipient_name', 150);
            $table->string('phone', 30);
            $table->string('line_one', 255);
            $table->string('line_two', 255)->nullable();
            $table->string('landmark', 255)->nullable();
            $table->string('city', 120);
            $table->string('state', 120);
            $table->string('postal_code', 30);
            $table->string('country_code', 2)->default('IN');
            $table->boolean('is_default')->default(false);
            $table->timestamps();

            $table->index(['user_id', 'is_default']);
            $table->index(['country_code', 'postal_code']);
        });

        Schema::create('design_uploads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('disk', 100);
            $table->string('path')->unique();
            $table->string('original_name', 255);
            $table->string('mime_type', 100);
            $table->string('extension', 20);
            $table->unsignedBigInteger('size_bytes');
            $table->string('sha256', 64)->nullable()->index();
            $table->string('status', 30)->default('pending');
            $table->timestamps();

            $table->index(['user_id', 'status']);
        });

        Schema::create('carts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->unique()->constrained()->nullOnDelete();
            $table->string('session_id', 100)->nullable()->unique();
            $table->string('currency', 3)->default('INR');
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            $table->index('expires_at');
        });

        Schema::create('cart_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cart_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->restrictOnDelete();
            $table->string('configuration_hash', 64);
            $table->unsignedInteger('quantity');
            $table->unsignedBigInteger('unit_price');
            $table->json('customization')->nullable();
            $table->timestamps();

            $table->unique(['cart_id', 'product_id', 'configuration_hash']);
        });

        Schema::create('cart_item_uploads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cart_item_id')->constrained()->cascadeOnDelete();
            $table->foreignId('design_upload_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['cart_item_id', 'design_upload_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cart_item_uploads');
        Schema::dropIfExists('cart_items');
        Schema::dropIfExists('carts');
        Schema::dropIfExists('design_uploads');
        Schema::dropIfExists('addresses');
    }
};

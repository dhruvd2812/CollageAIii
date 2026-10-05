<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'session_id',
        'currency',
        'expires_at',
    ];

    protected $appends = [
        'subtotal',
        'items_count',
    ];

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(CartItem::class)->latest();
    }

    protected function subtotal(): Attribute
    {
        return Attribute::make(
            get: fn () => (int) $this->items->sum(fn (CartItem $item) => $item->unit_price * $item->quantity)
        );
    }

    protected function itemsCount(): Attribute
    {
        return Attribute::make(
            get: fn () => (int) $this->items->sum('quantity')
        );
    }
}

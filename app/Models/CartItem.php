<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class CartItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'cart_id',
        'product_id',
        'configuration_hash',
        'quantity',
        'unit_price',
        'customization',
    ];

    protected $appends = ['line_total'];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'unit_price' => 'integer',
            'customization' => 'array',
        ];
    }

    public function cart(): BelongsTo
    {
        return $this->belongsTo(Cart::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class)->withTrashed();
    }

    public function uploads(): BelongsToMany
    {
        return $this->belongsToMany(DesignUpload::class, 'cart_item_uploads')->withTimestamps();
    }

    protected function lineTotal(): Attribute
    {
        return Attribute::make(
            get: fn () => (int) ($this->unit_price * $this->quantity)
        );
    }
}

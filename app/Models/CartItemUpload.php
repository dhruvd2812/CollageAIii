<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CartItemUpload extends Model
{
    use HasFactory;

    protected $fillable = [
        'cart_item_id',
        'design_upload_id',
    ];

    public function cartItem(): BelongsTo
    {
        return $this->belongsTo(CartItem::class);
    }

    public function designUpload(): BelongsTo
    {
        return $this->belongsTo(DesignUpload::class);
    }
}

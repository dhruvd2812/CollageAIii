<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class OrderItemUpload extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_item_id',
        'design_upload_id',
        'disk',
        'path',
        'original_name',
        'mime_type',
        'size_bytes',
    ];

    protected $appends = ['url', 'is_image'];

    protected function casts(): array
    {
        return [
            'size_bytes' => 'integer',
        ];
    }

    public function orderItem(): BelongsTo
    {
        return $this->belongsTo(OrderItem::class);
    }

    public function designUpload(): BelongsTo
    {
        return $this->belongsTo(DesignUpload::class);
    }

    protected function url(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (empty($this->path)) {
                    return '';
                }
                if (str_starts_with($this->path, 'http://') || str_starts_with($this->path, 'https://')) {
                    return $this->path;
                }
                if ($this->disk === 'public') {
                    return Storage::disk('public')->url($this->path);
                }
                return '/storage/' . ltrim($this->path, '/');
            }
        );
    }

    protected function isImage(): Attribute
    {
        return Attribute::make(
            get: fn () => str_starts_with($this->mime_type ?? '', 'image/')
        );
    }
}

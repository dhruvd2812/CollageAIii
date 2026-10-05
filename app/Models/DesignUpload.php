<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class DesignUpload extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'disk',
        'path',
        'original_name',
        'mime_type',
        'extension',
        'size_bytes',
        'sha256',
        'status',
    ];

    protected $appends = ['url', 'is_image'];

    protected function casts(): array
    {
        return [
            'size_bytes' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
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

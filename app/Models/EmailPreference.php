<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmailPreference extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'order_updates_enabled',
        'order_updates_consented_at',
        'marketing_enabled',
        'marketing_consented_at',
    ];

    protected function casts(): array
    {
        return [
            'order_updates_enabled' => 'boolean',
            'order_updates_consented_at' => 'datetime',
            'marketing_enabled' => 'boolean',
            'marketing_consented_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

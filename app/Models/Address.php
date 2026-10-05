<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Address extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'label',
        'recipient_name',
        'phone',
        'line_one',
        'line_two',
        'landmark',
        'city',
        'state',
        'postal_code',
        'country_code',
        'is_default',
    ];

    protected $appends = ['formatted_address'];

    protected function casts(): array
    {
        return [
            'is_default' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected function formattedAddress(): Attribute
    {
        return Attribute::make(
            get: function () {
                $parts = array_filter([
                    $this->line_one,
                    $this->line_two,
                    $this->landmark ? 'Near ' . $this->landmark : null,
                    $this->city,
                    $this->state . ' - ' . $this->postal_code,
                    $this->country_code === 'IN' ? 'India' : $this->country_code,
                ]);
                return implode(', ', $parts);
            }
        );
    }
}

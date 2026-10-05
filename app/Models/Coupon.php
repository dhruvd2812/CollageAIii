<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Coupon extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'discount_type',
        'fixed_discount_amount',
        'percentage_basis_points',
        'minimum_order_amount',
        'maximum_discount_amount',
        'currency',
        'starts_at',
        'expires_at',
        'usage_limit',
        'usage_limit_per_user',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'fixed_discount_amount' => 'integer',
            'percentage_basis_points' => 'integer',
            'minimum_order_amount' => 'integer',
            'maximum_discount_amount' => 'integer',
            'starts_at' => 'datetime',
            'expires_at' => 'datetime',
            'usage_limit' => 'integer',
            'usage_limit_per_user' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function usages(): HasMany
    {
        return $this->hasMany(CouponUsage::class);
    }

    public function isValidFor(int $subtotal, ?int $userId = null): array
    {
        if (!$this->is_active) {
            return ['valid' => false, 'message' => 'This coupon is no longer active.'];
        }

        $now = Carbon::now();
        if ($this->starts_at && $now->isBefore($this->starts_at)) {
            return ['valid' => false, 'message' => 'This coupon is not yet valid.'];
        }

        if ($this->expires_at && $now->isAfter($this->expires_at)) {
            return ['valid' => false, 'message' => 'This coupon has expired.'];
        }

        if ($subtotal < $this->minimum_order_amount) {
            return [
                'valid' => false,
                'message' => 'Minimum order amount of ₹' . $this->minimum_order_amount . ' required for this coupon.',
            ];
        }

        if ($this->usage_limit !== null && $this->usages()->count() >= $this->usage_limit) {
            return ['valid' => false, 'message' => 'Coupon usage limit has been reached.'];
        }

        if ($userId && $this->usage_limit_per_user !== null) {
            $userUsages = $this->usages()->where('user_id', $userId)->count();
            if ($userUsages >= $this->usage_limit_per_user) {
                return ['valid' => false, 'message' => 'You have reached the usage limit for this coupon.'];
            }
        }

        $discount = 0;
        if ($this->discount_type === 'fixed') {
            $discount = (int) $this->fixed_discount_amount;
        } elseif ($this->discount_type === 'percentage') {
            // basis points: 1000 = 10%
            $discount = (int) round(($subtotal * ($this->percentage_basis_points / 10000)));
        }

        if ($this->maximum_discount_amount !== null && $discount > $this->maximum_discount_amount) {
            $discount = (int) $this->maximum_discount_amount;
        }

        // Cap discount to subtotal
        $discount = min($discount, $subtotal);

        return [
            'valid' => true,
            'discount' => $discount,
            'message' => 'Coupon applied successfully!',
        ];
    }
}

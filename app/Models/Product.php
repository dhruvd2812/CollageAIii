<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'sku',
        'short_description',
        'description',
        'currency',
        'base_price',
        'sale_price',
        'manage_stock',
        'stock_quantity',
        'low_stock_threshold',
        'status',
        'is_featured',
        'is_customizable',
    ];

    protected $appends = [
        'effective_price',
        'has_discount',
        'discount_percent',
        'primary_image_url',
    ];

    protected function casts(): array
    {
        return [
            'base_price' => 'integer',
            'sale_price' => 'integer',
            'manage_stock' => 'boolean',
            'stock_quantity' => 'integer',
            'low_stock_threshold' => 'integer',
            'is_featured' => 'boolean',
            'is_customizable' => 'boolean',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function primaryImage(): HasOne
    {
        return $this->hasOne(ProductImage::class)->where('is_primary', true);
    }

    public function options(): HasMany
    {
        return $this->hasMany(ProductOption::class)->where('is_active', true)->orderBy('sort_order');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class)->where('status', 'approved')->latest();
    }

    public function wishlists(): HasMany
    {
        return $this->hasMany(Wishlist::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function allOptions(): HasMany
    {
        return $this->hasMany(ProductOption::class)->orderBy('sort_order');
    }

    protected function effectivePrice(): Attribute
    {
        return Attribute::make(
            get: fn () => ($this->sale_price !== null && $this->sale_price > 0 && $this->sale_price < $this->base_price)
                ? $this->sale_price
                : $this->base_price
        );
    }

    protected function hasDiscount(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->sale_price !== null && $this->sale_price > 0 && $this->sale_price < $this->base_price
        );
    }

    protected function discountPercent(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (!$this->has_discount || $this->base_price <= 0) {
                    return 0;
                }
                return (int) round((($this->base_price - $this->sale_price) / $this->base_price) * 100);
            }
        );
    }

    protected function primaryImageUrl(): Attribute
    {
        return Attribute::make(
            get: function () {
                $img = $this->images->firstWhere('is_primary', true) ?? $this->images->first();
                return $img ? $img->url : '';
            }
        );
    }
}

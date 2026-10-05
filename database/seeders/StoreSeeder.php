<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Coupon;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductOption;
use App\Models\ProductOptionValue;
use App\Models\Role;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class StoreSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Roles
        $adminRole = Role::firstOrCreate(
            ['name' => 'admin'],
            ['display_name' => 'Store Administrator', 'description' => 'Full store and order management access']
        );

        $customerRole = Role::firstOrCreate(
            ['name' => 'customer'],
            ['display_name' => 'Customer', 'description' => 'Regular customer access']
        );

        // 2. Admin User
        $adminUser = User::firstOrCreate(
            ['email' => 'admin@printwithdwarkesh.com'],
            [
                'name' => 'Dwarkesh Admin',
                'phone' => '+91 98765 43210',
                'password' => Hash::make('password'),
                'email_verified_at' => Carbon::now(),
            ]
        );
        $adminUser->roles()->syncWithoutDetaching([$adminRole->id]);

        // Sample Customer
        $customer = User::firstOrCreate(
            ['email' => 'customer@example.com'],
            [
                'name' => 'Rahul Sharma',
                'phone' => '+91 98123 45678',
                'password' => Hash::make('password'),
                'email_verified_at' => Carbon::now(),
            ]
        );
        $customer->roles()->syncWithoutDetaching([$customerRole->id]);

        // 3. Coupons
        Coupon::firstOrCreate(
            ['code' => 'PRINT10'],
            [
                'discount_type' => 'percentage',
                'percentage_basis_points' => 1000, // 10%
                'minimum_order_amount' => 499,
                'maximum_discount_amount' => 500,
                'currency' => 'INR',
                'is_active' => true,
                'starts_at' => Carbon::now()->subDay(),
                'expires_at' => Carbon::now()->addYear(),
            ]
        );

        Coupon::firstOrCreate(
            ['code' => 'WELCOME100'],
            [
                'discount_type' => 'fixed',
                'fixed_discount_amount' => 100,
                'minimum_order_amount' => 799,
                'currency' => 'INR',
                'is_active' => true,
                'starts_at' => Carbon::now()->subDay(),
                'expires_at' => Carbon::now()->addYear(),
            ]
        );

        // 4. Categories
        $categoriesData = [
            [
                'name' => 'Posters',
                'slug' => 'posters',
                'description' => 'Fine art wall posters, motivational quotes, typography, and gallery frames printed on archival paper.',
                'image_path' => 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=85',
                'sort_order' => 1,
            ],
            [
                'name' => 'Photo Prints',
                'slug' => 'photo-prints',
                'description' => 'High-definition photo prints, retro polaroids, square memory prints, and seamless layflat photo albums.',
                'image_path' => 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=85',
                'sort_order' => 2,
            ],
            [
                'name' => 'Mugs',
                'slug' => 'mugs',
                'description' => 'Dishwasher-safe ceramic coffee mugs, color changing magic mugs, couple sets, and travel mugs.',
                'image_path' => 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=85',
                'sort_order' => 3,
            ],
            [
                'name' => 'Bottles',
                'slug' => 'bottles',
                'description' => 'Stainless steel double-wall vacuum insulated bottles with precision laser engraving & UV color printing.',
                'image_path' => 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=85',
                'sort_order' => 4,
            ],
            [
                'name' => 'T-Shirts',
                'slug' => 't-shirts',
                'description' => '100% combed bio-washed cotton t-shirts, streetwear oversize tees, and custom hoodies with HD DTF prints.',
                'image_path' => 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=85',
                'sort_order' => 5,
            ],
            [
                'name' => 'Visiting Cards',
                'slug' => 'visiting-cards',
                'description' => 'Professional visiting cards with velvet matte touch, spot UV, gold foil, and rounded edges.',
                'image_path' => 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=85',
                'sort_order' => 6,
            ],
            [
                'name' => 'Business Cards',
                'slug' => 'business-cards',
                'description' => 'Luxury corporate business cards on 450 GSM cardstock, embossed textures, and metallic foil finishes.',
                'image_path' => 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=800&q=85',
                'sort_order' => 7,
            ],
            [
                'name' => 'Invitations',
                'slug' => 'invitations',
                'description' => 'Custom wedding invitations, birthday cards, event announcements, and gold-foiled envelopes.',
                'image_path' => 'https://images.unsplash.com/photo-1513159446162-54eb8bdaa79b?auto=format&fit=crop&w=800&q=85',
                'sort_order' => 8,
            ],
            [
                'name' => 'Photo Frames',
                'slug' => 'photo-frames',
                'description' => 'Solid natural wood frames, acrylic floating frames, and canvas gallery wraps with mounting hardware.',
                'image_path' => 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=800&q=85',
                'sort_order' => 9,
            ],
            [
                'name' => 'Keychains',
                'slug' => 'keychains',
                'description' => 'Personalized acrylic, metal, and leather keychains with custom photos, names, and vehicle numbers.',
                'image_path' => 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=85',
                'sort_order' => 10,
            ],
            [
                'name' => 'Custom Gifts',
                'slug' => 'custom-gifts',
                'description' => 'Custom Spotify song acrylic lamps, engraved wooden memory plaques, personalized clocks, and gift sets.',
                'image_path' => 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=85',
                'sort_order' => 11,
            ],
            [
                'name' => 'Stickers',
                'slug' => 'stickers',
                'description' => 'Waterproof die-cut vinyl stickers, holographic labels, logo sheets, and bumper decals.',
                'image_path' => 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&w=800&q=85',
                'sort_order' => 12,
            ],
            [
                'name' => 'Banners',
                'slug' => 'banners',
                'description' => 'Heavy-duty vinyl flex banners, standees, rollup banners, and event backdrops with eyelets.',
                'image_path' => 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=85',
                'sort_order' => 13,
            ],
            [
                'name' => 'Custom Printing',
                'slug' => 'custom-printing',
                'description' => 'Bespoke custom printing on diverse substrates, canvas, acrylic, ceramics, and textiles.',
                'image_path' => 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=85',
                'sort_order' => 14,
            ],
        ];

        $categoryMap = [];
        foreach ($categoriesData as $cData) {
            $cat = Category::firstOrCreate(
                ['slug' => $cData['slug']],
                [
                    'name' => $cData['name'],
                    'description' => $cData['description'],
                    'image_disk' => 'url',
                    'image_path' => $cData['image_path'],
                    'is_active' => true,
                    'sort_order' => $cData['sort_order'],
                ]
            );
            $categoryMap[$cData['slug']] = $cat;
        }

        // 5. Products Catalog with Options
        $productsData = [
            // Posters
            [
                'category_slug' => 'posters',
                'name' => 'Abstract Sunset Gallery Art Poster',
                'slug' => 'abstract-sunset-gallery-art-poster',
                'sku' => 'PWD-PST-001',
                'short_description' => 'Museum-grade 300 GSM archival matte paper with fade-resistant pigment printing.',
                'description' => 'Turn your walls into an art gallery with our vibrant Abstract Sunset print. Crafted using genuine 12-color archival pigment inks on heavyweight 300 GSM acid-free fine art paper.',
                'base_price' => 599,
                'sale_price' => 399,
                'is_featured' => true,
                'is_customizable' => true,
                'stock_quantity' => 150,
                'images' => [
                    'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=85',
                    'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=800&q=85',
                ],
                'options' => [
                    [
                        'name' => 'Poster Size',
                        'code' => 'size',
                        'type' => 'select',
                        'is_required' => true,
                        'values' => [
                            ['label' => 'A4 (8.3 x 11.7 in)', 'value' => 'A4', 'price_adjustment' => 0],
                            ['label' => 'A3 (11.7 x 16.5 in)', 'value' => 'A3', 'price_adjustment' => 150],
                            ['label' => 'A2 (16.5 x 23.4 in)', 'value' => 'A2', 'price_adjustment' => 350],
                            ['label' => '18 x 24 inches', 'value' => '18x24', 'price_adjustment' => 450],
                        ],
                    ],
                    [
                        'name' => 'Paper & Finish',
                        'code' => 'paper_finish',
                        'type' => 'select',
                        'is_required' => true,
                        'values' => [
                            ['label' => '300 GSM Archival Matte', 'value' => 'archival_matte', 'price_adjustment' => 0],
                            ['label' => '300 GSM High-Gloss Luster', 'value' => 'glossy_luster', 'price_adjustment' => 50],
                            ['label' => '380 GSM Cotton Canvas', 'value' => 'cotton_canvas', 'price_adjustment' => 200],
                        ],
                    ],
                    [
                        'name' => 'Framing Option',
                        'code' => 'framing',
                        'type' => 'select',
                        'is_required' => false,
                        'values' => [
                            ['label' => 'Unframed (Rolled in Tube)', 'value' => 'unframed', 'price_adjustment' => 0],
                            ['label' => 'Classic Black Wood Frame', 'value' => 'black_frame', 'price_adjustment' => 350],
                            ['label' => 'Natural Oak Wood Frame', 'value' => 'oak_frame', 'price_adjustment' => 400],
                        ],
                    ],
                ],
            ],
            // Mugs
            [
                'category_slug' => 'mugs',
                'name' => 'Custom Ceramic Coffee Mug (350ml)',
                'slug' => 'custom-ceramic-coffee-mug-350ml',
                'sku' => 'PWD-MUG-001',
                'short_description' => 'High-fired durable stoneware ceramic mug with full wraparound sublimation print.',
                'description' => 'Enjoy your morning brew with a personalized touch. Microwave and dishwasher safe with rich, permanent colors that will never fade or peel.',
                'base_price' => 499,
                'sale_price' => 349,
                'is_featured' => true,
                'is_customizable' => true,
                'stock_quantity' => 200,
                'images' => [
                    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=85',
                    'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=85',
                ],
                'options' => [
                    [
                        'name' => 'Mug Capacity',
                        'code' => 'capacity',
                        'type' => 'select',
                        'is_required' => true,
                        'values' => [
                            ['label' => 'Standard 11 oz (325 ml)', 'value' => '11oz', 'price_adjustment' => 0],
                            ['label' => 'Large 15 oz (440 ml)', 'value' => '15oz', 'price_adjustment' => 80],
                        ],
                    ],
                    [
                        'name' => 'Print Side',
                        'code' => 'print_side',
                        'type' => 'select',
                        'is_required' => true,
                        'values' => [
                            ['label' => 'Front Side Only', 'value' => 'front', 'price_adjustment' => 0],
                            ['label' => 'Both Sides', 'value' => 'both_sides', 'price_adjustment' => 40],
                            ['label' => 'Full Wraparound (Panoramic)', 'value' => 'wraparound', 'price_adjustment' => 60],
                        ],
                    ],
                    [
                        'name' => 'Interior Color',
                        'code' => 'interior_color',
                        'type' => 'select',
                        'is_required' => false,
                        'values' => [
                            ['label' => 'Pure White', 'value' => 'white', 'price_adjustment' => 0],
                            ['label' => 'Midnight Black', 'value' => 'black', 'price_adjustment' => 50],
                            ['label' => 'Crimson Red', 'value' => 'red', 'price_adjustment' => 50],
                        ],
                    ],
                ],
            ],
            // Bottles
            [
                'category_slug' => 'bottles',
                'name' => 'Laser Engraved Thermal Matte Bottle (750ml)',
                'slug' => 'laser-engraved-thermal-matte-bottle-750ml',
                'sku' => 'PWD-BTL-001',
                'short_description' => 'Double-walled vacuum insulated 304 food-grade stainless steel with precision laser engraving.',
                'description' => 'Keeps beverages cold for 24 hours or hot for 12 hours. Features sweat-free matte powder coat finish and permanent precision laser engraved personalization.',
                'base_price' => 999,
                'sale_price' => 699,
                'is_featured' => true,
                'is_customizable' => true,
                'stock_quantity' => 120,
                'images' => [
                    'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=85',
                    'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=800&q=85',
                ],
                'options' => [
                    [
                        'name' => 'Bottle Color',
                        'code' => 'color',
                        'type' => 'select',
                        'is_required' => true,
                        'values' => [
                            ['label' => 'Matte Onyx Black', 'value' => 'black', 'price_adjustment' => 0],
                            ['label' => 'Brushed Stainless Silver', 'value' => 'silver', 'price_adjustment' => 0],
                            ['label' => 'Forest Green', 'value' => 'green', 'price_adjustment' => 50],
                            ['label' => 'Rose Gold', 'value' => 'rosegold', 'price_adjustment' => 80],
                        ],
                    ],
                    [
                        'name' => 'Engraving Placement',
                        'code' => 'placement',
                        'type' => 'select',
                        'is_required' => true,
                        'values' => [
                            ['label' => 'Vertical Monogram / Name', 'value' => 'vertical', 'price_adjustment' => 0],
                            ['label' => 'Horizontal Centered Logo', 'value' => 'horizontal', 'price_adjustment' => 0],
                            ['label' => 'Full Height Custom Graphic', 'value' => 'full_height', 'price_adjustment' => 100],
                        ],
                    ],
                ],
            ],
            // T-Shirts
            [
                'category_slug' => 't-shirts',
                'name' => 'Heavyweight Bio-Washed Graphic Cotton Tee',
                'slug' => 'heavyweight-bio-washed-graphic-cotton-tee',
                'sku' => 'PWD-TEE-001',
                'short_description' => '240 GSM 100% combed cotton with breathable, high-definition digital DTF print.',
                'description' => 'Ultra-soft, pre-shrunk, bio-washed cotton engineered for premium drape and durability. Your custom design is printed with vibrant, stretch-resistant inks.',
                'base_price' => 899,
                'sale_price' => 599,
                'is_featured' => true,
                'is_customizable' => true,
                'stock_quantity' => 300,
                'images' => [
                    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=85',
                    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=85',
                ],
                'options' => [
                    [
                        'name' => 'Size',
                        'code' => 'size',
                        'type' => 'select',
                        'is_required' => true,
                        'values' => [
                            ['label' => 'S (Chest 38 in)', 'value' => 'S', 'price_adjustment' => 0],
                            ['label' => 'M (Chest 40 in)', 'value' => 'M', 'price_adjustment' => 0],
                            ['label' => 'L (Chest 42 in)', 'value' => 'L', 'price_adjustment' => 0],
                            ['label' => 'XL (Chest 44 in)', 'value' => 'XL', 'price_adjustment' => 50],
                            ['label' => 'XXL (Chest 46 in)', 'value' => 'XXL', 'price_adjustment' => 100],
                        ],
                    ],
                    [
                        'name' => 'T-Shirt Color',
                        'code' => 'color',
                        'type' => 'select',
                        'is_required' => true,
                        'values' => [
                            ['label' => 'Solid Black', 'value' => 'black', 'price_adjustment' => 0],
                            ['label' => 'Crisp White', 'value' => 'white', 'price_adjustment' => 0],
                            ['label' => 'Navy Blue', 'value' => 'navy', 'price_adjustment' => 0],
                            ['label' => 'Heather Grey', 'value' => 'grey', 'price_adjustment' => 30],
                        ],
                    ],
                    [
                        'name' => 'Print Location',
                        'code' => 'print_location',
                        'type' => 'select',
                        'is_required' => true,
                        'values' => [
                            ['label' => 'Front Chest (Large)', 'value' => 'front_large', 'price_adjustment' => 0],
                            ['label' => 'Left Pocket (Minimalist)', 'value' => 'pocket', 'price_adjustment' => 0],
                            ['label' => 'Front + Back Print', 'value' => 'front_and_back', 'price_adjustment' => 150],
                        ],
                    ],
                ],
            ],
            // Visiting Cards
            [
                'category_slug' => 'visiting-cards',
                'name' => 'Luxury Velvet Matte Visiting Cards (100 pcs)',
                'slug' => 'luxury-velvet-matte-visiting-cards-100-pcs',
                'sku' => 'PWD-CRD-001',
                'short_description' => '450 GSM ultra-thick cardstock with soft-touch velvet lamination.',
                'description' => 'Leave a lasting impression with ultra-premium 450 GSM business cards. Finished with water-resistant velvet lamination and crisp high-resolution double-sided printing.',
                'base_price' => 799,
                'sale_price' => 499,
                'is_featured' => true,
                'is_customizable' => true,
                'stock_quantity' => 500,
                'images' => [
                    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=85',
                    'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=85',
                ],
                'options' => [
                    [
                        'name' => 'Quantity Pack',
                        'code' => 'quantity_pack',
                        'type' => 'select',
                        'is_required' => true,
                        'values' => [
                            ['label' => '100 Cards Pack', 'value' => '100', 'price_adjustment' => 0],
                            ['label' => '250 Cards Pack (Best Value)', 'value' => '250', 'price_adjustment' => 350],
                            ['label' => '500 Cards Pack', 'value' => '500', 'price_adjustment' => 700],
                            ['label' => '1000 Cards Corporate Pack', 'value' => '1000', 'price_adjustment' => 1300],
                        ],
                    ],
                    [
                        'name' => 'Finish & Foil Accent',
                        'code' => 'finish',
                        'type' => 'select',
                        'is_required' => true,
                        'values' => [
                            ['label' => 'Soft-Touch Velvet Matte', 'value' => 'velvet_matte', 'price_adjustment' => 0],
                            ['label' => 'Metallic Gold Foil Accents', 'value' => 'gold_foil', 'price_adjustment' => 200],
                            ['label' => 'Raised Spot UV Gloss Detailing', 'value' => 'spot_uv', 'price_adjustment' => 180],
                        ],
                    ],
                    [
                        'name' => 'Corner Styling',
                        'code' => 'corners',
                        'type' => 'select',
                        'is_required' => false,
                        'values' => [
                            ['label' => 'Standard Square Corners', 'value' => 'square', 'price_adjustment' => 0],
                            ['label' => 'Rounded Die-Cut Corners', 'value' => 'rounded', 'price_adjustment' => 50],
                        ],
                    ],
                ],
            ],
            // Photo Prints
            [
                'category_slug' => 'photo-prints',
                'name' => 'Retro Polaroid Photo Keepsake Box (30 Prints)',
                'slug' => 'retro-polaroid-photo-keepsake-box-30-prints',
                'sku' => 'PWD-PHT-001',
                'short_description' => 'Genuine Fuji Crystal Archive luster photo paper with classic borders and metal tin.',
                'description' => 'Relive your favorite memories with authentic polaroid style prints. Includes 30 high-definition glossy prints presented in an embossed protective metal keepsake tin.',
                'base_price' => 449,
                'sale_price' => 299,
                'is_featured' => true,
                'is_customizable' => true,
                'stock_quantity' => 250,
                'images' => [
                    'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=85',
                    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=85',
                ],
                'options' => [
                    [
                        'name' => 'Print Quantity',
                        'code' => 'quantity_prints',
                        'type' => 'select',
                        'is_required' => true,
                        'values' => [
                            ['label' => '30 Prints + Metal Tin', 'value' => '30', 'price_adjustment' => 0],
                            ['label' => '50 Prints + Metal Tin', 'value' => '50', 'price_adjustment' => 150],
                            ['label' => '100 Prints + Twin Tins', 'value' => '100', 'price_adjustment' => 350],
                        ],
                    ],
                    [
                        'name' => 'Paper Texture',
                        'code' => 'paper_texture',
                        'type' => 'select',
                        'is_required' => true,
                        'values' => [
                            ['label' => 'Luster Satin (Fingerprint Resistant)', 'value' => 'luster', 'price_adjustment' => 0],
                            ['label' => 'Glossy Pearl High-Vibrance', 'value' => 'pearl_gloss', 'price_adjustment' => 30],
                        ],
                    ],
                ],
            ],
            // Custom Gifts
            [
                'category_slug' => 'custom-gifts',
                'name' => 'Custom Spotify Acrylic Song Lamp with Wooden LED Base',
                'slug' => 'custom-spotify-acrylic-song-lamp-with-wooden-led-base',
                'sku' => 'PWD-GFT-001',
                'short_description' => 'Cast acrylic with scannable Spotify code, custom photo and warm LED wooden base.',
                'description' => 'The perfect personalized gift for birthdays, anniversaries, and special moments. High-clarity optical grade acrylic illuminated by warm white LED beechwood base.',
                'base_price' => 1199,
                'sale_price' => 799,
                'is_featured' => true,
                'is_customizable' => true,
                'stock_quantity' => 180,
                'images' => [
                    'https://images.unsplash.com/photo-1513159446162-54eb8bdaa79b?auto=format&fit=crop&w=800&q=85',
                    'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=85',
                ],
                'options' => [
                    [
                        'name' => 'LED Base Light',
                        'code' => 'led_light',
                        'type' => 'select',
                        'is_required' => true,
                        'values' => [
                            ['label' => 'Warm Cozy White Light', 'value' => 'warm_white', 'price_adjustment' => 0],
                            ['label' => 'Multi-Color RGB with Remote (7 Colors)', 'value' => 'rgb_remote', 'price_adjustment' => 200],
                        ],
                    ],
                    [
                        'name' => 'Plaque Dimension',
                        'code' => 'dimension',
                        'type' => 'select',
                        'is_required' => true,
                        'values' => [
                            ['label' => 'Standard A5 (6 x 8.5 in)', 'value' => 'A5', 'price_adjustment' => 0],
                            ['label' => 'Grand A4 (8.5 x 12 in)', 'value' => 'A4', 'price_adjustment' => 250],
                        ],
                    ],
                ],
            ],
            // Stickers
            [
                'category_slug' => 'stickers',
                'name' => 'Custom Die-Cut Vinyl Sticker Pack (50 Pcs)',
                'slug' => 'custom-die-cut-vinyl-sticker-pack-50-pcs',
                'sku' => 'PWD-STK-001',
                'short_description' => 'Waterproof, UV-resistant, precision die-cut vinyl stickers for laptops, bottles & branding.',
                'description' => 'Durable vinyl stickers that withstand outdoor elements, water, and sun exposure. Precision contour cut to the exact shape of your artwork or logo.',
                'base_price' => 399,
                'sale_price' => 249,
                'is_featured' => false,
                'is_customizable' => true,
                'stock_quantity' => 300,
                'images' => [
                    'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&w=800&q=85',
                ],
                'options' => [
                    [
                        'name' => 'Finish Effect',
                        'code' => 'finish',
                        'type' => 'select',
                        'is_required' => true,
                        'values' => [
                            ['label' => 'Matte Vinyl', 'value' => 'matte', 'price_adjustment' => 0],
                            ['label' => 'Glossy Water-Shield', 'value' => 'glossy', 'price_adjustment' => 30],
                            ['label' => 'Rainbow Holographic Foil', 'value' => 'holographic', 'price_adjustment' => 120],
                        ],
                    ],
                ],
            ],
        ];

        foreach ($productsData as $pData) {
            $cat = $categoryMap[$pData['category_slug']] ?? null;
            if (!$cat) {
                continue;
            }

            $product = Product::firstOrCreate(
                ['slug' => $pData['slug']],
                [
                    'category_id' => $cat->id,
                    'name' => $pData['name'],
                    'sku' => $pData['sku'],
                    'short_description' => $pData['short_description'],
                    'description' => $pData['description'],
                    'currency' => 'INR',
                    'base_price' => $pData['base_price'],
                    'sale_price' => $pData['sale_price'],
                    'manage_stock' => true,
                    'stock_quantity' => $pData['stock_quantity'],
                    'low_stock_threshold' => 10,
                    'status' => 'active',
                    'is_featured' => $pData['is_featured'],
                    'is_customizable' => $pData['is_customizable'],
                ]
            );

            // Images
            foreach ($pData['images'] as $idx => $imgUrl) {
                ProductImage::firstOrCreate(
                    [
                        'product_id' => $product->id,
                        'path' => $imgUrl,
                    ],
                    [
                        'disk' => 'url',
                        'alt_text' => $product->name,
                        'sort_order' => $idx,
                        'is_primary' => $idx === 0,
                    ]
                );
            }

            // Options
            if (!empty($pData['options'])) {
                foreach ($pData['options'] as $oIdx => $optData) {
                    $opt = ProductOption::firstOrCreate(
                        [
                            'product_id' => $product->id,
                            'code' => $optData['code'],
                        ],
                        [
                            'name' => $optData['name'],
                            'type' => $optData['type'],
                            'is_required' => $optData['is_required'],
                            'is_active' => true,
                            'sort_order' => $oIdx,
                        ]
                    );

                    foreach ($optData['values'] as $vIdx => $valData) {
                        ProductOptionValue::firstOrCreate(
                            [
                                'product_option_id' => $opt->id,
                                'value' => $valData['value'],
                            ],
                            [
                                'label' => $valData['label'],
                                'price_adjustment' => $valData['price_adjustment'],
                                'is_active' => true,
                                'sort_order' => $vIdx,
                            ]
                        );
                    }
                }
            }
        }
    }
}

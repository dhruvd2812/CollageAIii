<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductOption;
use App\Models\ProductOptionValue;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminProductController extends Controller
{
    private function authorizeAdmin(Request $request): void
    {
        if (!$request->user() || !$request->user()->isAdmin()) {
            abort(403, 'Unauthorized. Admin access required.');
        }
    }

    public function index(Request $request): Response
    {
        $this->authorizeAdmin($request);

        $query = Product::with(['category', 'images', 'primaryImage'])->latest();

        // Search filter
        if ($request->filled('q')) {
            $term = trim($request->input('q'));
            $query->where(function ($q) use ($term) {
                $q->where('name', 'like', "%{$term}%")
                    ->orWhere('sku', 'like', "%{$term}%")
                    ->orWhere('short_description', 'like', "%{$term}%");
            });
        }

        // Category filter
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->input('category_id'));
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        // Stock status filter
        if ($request->filled('stock_status')) {
            $stockStatus = $request->input('stock_status');
            if ($stockStatus === 'in_stock') {
                $query->where(function ($q) {
                    $q->where('manage_stock', false)
                        ->orWhere('stock_quantity', '>', 0);
                });
            } elseif ($stockStatus === 'out_of_stock') {
                $query->where('manage_stock', true)->where('stock_quantity', '<=', 0);
            }
        }

        $products = $query->paginate(12)->withQueryString();
        $categories = Category::orderBy('name')->get();

        return Inertia::render('admin/products/index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => [
                'q' => $request->input('q', ''),
                'category_id' => $request->input('category_id', ''),
                'status' => $request->input('status', ''),
                'stock_status' => $request->input('stock_status', ''),
            ],
        ]);
    }

    public function create(Request $request): Response
    {
        $this->authorizeAdmin($request);

        $categories = Category::where('is_active', true)->orderBy('sort_order')->orderBy('name')->get();

        return Inertia::render('admin/products/create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:200',
            'sku' => 'nullable|string|max:100|unique:products,sku',
            'short_description' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'base_price' => 'required|integer|min:0',
            'sale_price' => 'nullable|integer|min:0',
            'manage_stock' => 'boolean',
            'stock_quantity' => 'required|integer|min:0',
            'low_stock_threshold' => 'nullable|integer|min:0',
            'status' => 'required|string|in:draft,active,inactive,archived',
            'is_featured' => 'boolean',
            'is_customizable' => 'boolean',
            'images.*' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:10240',
            'options' => 'nullable|array',
            'options.*.name' => 'required|string|max:120',
            'options.*.code' => 'required|string|max:100',
            'options.*.type' => 'required|string|max:40',
            'options.*.is_required' => 'boolean',
            'options.*.values' => 'nullable|array',
            'options.*.values.*.label' => 'required|string|max:150',
            'options.*.values.*.value' => 'required|string|max:150',
            'options.*.values.*.price_adjustment' => 'nullable|integer',
        ]);

        $slug = Str::slug($validated['name']);
        $uniqueSlug = $slug;
        $counter = 1;
        while (Product::where('slug', $uniqueSlug)->exists()) {
            $uniqueSlug = $slug . '-' . $counter;
            $counter++;
        }

        $sku = !empty($validated['sku'])
            ? strtoupper(trim($validated['sku']))
            : 'PWD-' . strtoupper(Str::random(6));

        DB::transaction(function () use ($validated, $uniqueSlug, $sku, $request) {
            $product = Product::create([
                'category_id' => $validated['category_id'],
                'name' => $validated['name'],
                'slug' => $uniqueSlug,
                'sku' => $sku,
                'short_description' => $validated['short_description'] ?? null,
                'description' => $validated['description'] ?? null,
                'currency' => 'INR',
                'base_price' => $validated['base_price'],
                'sale_price' => !empty($validated['sale_price']) ? $validated['sale_price'] : null,
                'manage_stock' => $validated['manage_stock'] ?? true,
                'stock_quantity' => $validated['stock_quantity'] ?? 0,
                'low_stock_threshold' => $validated['low_stock_threshold'] ?? 5,
                'status' => $validated['status'] ?? 'active',
                'is_featured' => $validated['is_featured'] ?? false,
                'is_customizable' => $validated['is_customizable'] ?? false,
            ]);

            // Handle uploaded images
            if ($request->hasFile('images')) {
                $isFirst = true;
                $sort = 0;
                foreach ($request->file('images') as $file) {
                    $path = $file->store('products', 'public');
                    ProductImage::create([
                        'product_id' => $product->id,
                        'disk' => 'public',
                        'path' => $path,
                        'alt_text' => $product->name,
                        'sort_order' => $sort++,
                        'is_primary' => $isFirst,
                    ]);
                    $isFirst = false;
                }
            }

            // Handle options
            if (!empty($validated['options']) && is_array($validated['options'])) {
                $optSort = 0;
                foreach ($validated['options'] as $optData) {
                    $code = Str::slug($optData['code'] ?: $optData['name'], '_');
                    $option = ProductOption::create([
                        'product_id' => $product->id,
                        'name' => $optData['name'],
                        'code' => $code,
                        'type' => $optData['type'] ?? 'select',
                        'is_required' => $optData['is_required'] ?? false,
                        'is_active' => true,
                        'sort_order' => $optSort++,
                    ]);

                    if (!empty($optData['values']) && is_array($optData['values'])) {
                        $valSort = 0;
                        foreach ($optData['values'] as $valData) {
                            $valKey = Str::slug($valData['value'] ?: $valData['label'], '_');
                            ProductOptionValue::create([
                                'product_option_id' => $option->id,
                                'label' => $valData['label'],
                                'value' => $valKey,
                                'price_adjustment' => (int) ($valData['price_adjustment'] ?? 0),
                                'is_active' => true,
                                'sort_order' => $valSort++,
                            ]);
                        }
                    }
                }
            }
        });

        return redirect()->route('admin.products.index')->with('success', 'Product created successfully.');
    }

    public function edit(Product $product, Request $request): Response
    {
        $this->authorizeAdmin($request);

        $product->load([
            'category',
            'images',
            'allOptions.values' => fn ($q) => $q->orderBy('sort_order'),
        ]);

        $categories = Category::where('is_active', true)->orderBy('sort_order')->orderBy('name')->get();

        return Inertia::render('admin/products/edit', [
            'product' => $product,
            'categories' => $categories,
        ]);
    }

    public function update(Product $product, Request $request): RedirectResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:200',
            'sku' => "nullable|string|max:100|unique:products,sku,{$product->id}",
            'short_description' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'base_price' => 'required|integer|min:0',
            'sale_price' => 'nullable|integer|min:0',
            'manage_stock' => 'boolean',
            'stock_quantity' => 'required|integer|min:0',
            'low_stock_threshold' => 'nullable|integer|min:0',
            'status' => 'required|string|in:draft,active,inactive,archived',
            'is_featured' => 'boolean',
            'is_customizable' => 'boolean',
            'images.*' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:10240',
            'remove_image_ids' => 'nullable|array',
            'remove_image_ids.*' => 'integer|exists:product_images,id',
            'primary_image_id' => 'nullable|integer',
            'options' => 'nullable|array',
            'options.*.name' => 'required|string|max:120',
            'options.*.code' => 'required|string|max:100',
            'options.*.type' => 'required|string|max:40',
            'options.*.is_required' => 'boolean',
            'options.*.values' => 'nullable|array',
            'options.*.values.*.label' => 'required|string|max:150',
            'options.*.values.*.value' => 'required|string|max:150',
            'options.*.values.*.price_adjustment' => 'nullable|integer',
        ]);

        DB::transaction(function () use ($product, $validated, $request) {
            // Update slug if name changed
            $slug = $product->slug;
            if ($product->name !== $validated['name']) {
                $baseSlug = Str::slug($validated['name']);
                $slug = $baseSlug;
                $counter = 1;
                while (Product::where('slug', $slug)->where('id', '!=', $product->id)->exists()) {
                    $slug = $baseSlug . '-' . $counter;
                    $counter++;
                }
            }

            $product->update([
                'category_id' => $validated['category_id'],
                'name' => $validated['name'],
                'slug' => $slug,
                'sku' => !empty($validated['sku']) ? strtoupper(trim($validated['sku'])) : $product->sku,
                'short_description' => $validated['short_description'] ?? null,
                'description' => $validated['description'] ?? null,
                'base_price' => $validated['base_price'],
                'sale_price' => !empty($validated['sale_price']) ? $validated['sale_price'] : null,
                'manage_stock' => $validated['manage_stock'] ?? true,
                'stock_quantity' => $validated['stock_quantity'] ?? 0,
                'low_stock_threshold' => $validated['low_stock_threshold'] ?? 5,
                'status' => $validated['status'],
                'is_featured' => $validated['is_featured'] ?? false,
                'is_customizable' => $validated['is_customizable'] ?? false,
            ]);

            // Remove selected images
            if (!empty($validated['remove_image_ids'])) {
                $imagesToRemove = ProductImage::where('product_id', $product->id)
                    ->whereIn('id', $validated['remove_image_ids'])
                    ->get();

                foreach ($imagesToRemove as $img) {
                    if ($img->disk === 'public') {
                        Storage::disk('public')->delete($img->path);
                    }
                    $img->delete();
                }
            }

            // Upload new images
            if ($request->hasFile('images')) {
                $lastSort = (int) $product->images()->max('sort_order') + 1;
                $hasExistingPrimary = $product->images()->where('is_primary', true)->exists();

                foreach ($request->file('images') as $idx => $file) {
                    $path = $file->store('products', 'public');
                    ProductImage::create([
                        'product_id' => $product->id,
                        'disk' => 'public',
                        'path' => $path,
                        'alt_text' => $product->name,
                        'sort_order' => $lastSort + $idx,
                        'is_primary' => !$hasExistingPrimary && $idx === 0,
                    ]);
                }
            }

            // Set primary image
            if (!empty($validated['primary_image_id'])) {
                $product->images()->update(['is_primary' => false]);
                $product->images()->where('id', $validated['primary_image_id'])->update(['is_primary' => true]);
            }

            // Synchronize options
            // Delete existing options & recreate with updated structure cleanly
            $product->options()->delete();

            if (!empty($validated['options']) && is_array($validated['options'])) {
                $optSort = 0;
                foreach ($validated['options'] as $optData) {
                    $code = Str::slug($optData['code'] ?: $optData['name'], '_');
                    $option = ProductOption::create([
                        'product_id' => $product->id,
                        'name' => $optData['name'],
                        'code' => $code,
                        'type' => $optData['type'] ?? 'select',
                        'is_required' => $optData['is_required'] ?? false,
                        'is_active' => true,
                        'sort_order' => $optSort++,
                    ]);

                    if (!empty($optData['values']) && is_array($optData['values'])) {
                        $valSort = 0;
                        foreach ($optData['values'] as $valData) {
                            $valKey = Str::slug($valData['value'] ?: $valData['label'], '_');
                            ProductOptionValue::create([
                                'product_option_id' => $option->id,
                                'label' => $valData['label'],
                                'value' => $valKey,
                                'price_adjustment' => (int) ($valData['price_adjustment'] ?? 0),
                                'is_active' => true,
                                'sort_order' => $valSort++,
                            ]);
                        }
                    }
                }
            }
        });

        return redirect()->route('admin.products.index')->with('success', 'Product updated successfully.');
    }

    public function toggleStatus(Product $product, Request $request): RedirectResponse
    {
        $this->authorizeAdmin($request);

        $newStatus = $product->status === 'active' ? 'inactive' : 'active';
        $product->update(['status' => $newStatus]);

        return redirect()->back()->with('success', "Product status changed to {$newStatus}.");
    }

    public function destroy(Product $product, Request $request): RedirectResponse
    {
        $this->authorizeAdmin($request);

        // Safe deletion logic: If product has order items, deactivate rather than hard breaking
        if ($product->orderItems()->exists()) {
            $product->update(['status' => 'inactive']);
            $product->delete(); // Soft-deletes product safely (orders still have access via withTrashed)
            return redirect()->back()->with('success', 'Product has historical orders. It has been deactivated and archived safely.');
        }

        // Otherwise soft-delete directly
        $product->delete();

        return redirect()->back()->with('success', 'Product deleted successfully.');
    }
}


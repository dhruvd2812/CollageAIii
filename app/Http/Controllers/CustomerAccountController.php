<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\EmailPreference;
use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CustomerAccountController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $recentOrders = $user->orders()->with('items')->latest()->take(5)->get();
        $defaultAddress = $user->defaultAddress;
        $totalOrdersCount = $user->orders()->count();
        $wishlistCount = $user->wishlists()->count();

        return Inertia::render('account/index', [
            'recentOrders' => $recentOrders,
            'defaultAddress' => $defaultAddress,
            'stats' => [
                'total_orders' => $totalOrdersCount,
                'wishlist_count' => $wishlistCount,
            ],
        ]);
    }

    public function profile(Request $request): Response
    {
        $user = $request->user();
        return Inertia::render('account/profile', [
            'user' => $user,
        ]);
    }

    public function updateProfile(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone' => ['nullable', 'string', 'max:30'],
            'current_password' => ['nullable', 'required_with:new_password', 'current_password'],
            'new_password' => ['nullable', 'string', 'min:8', 'confirmed'],
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->phone = $validated['phone'] ?? null;

        if (!empty($validated['new_password'])) {
            $user->password = Hash::make($validated['new_password']);
        }

        $user->save();

        return redirect()->back()->with('success', 'Profile updated successfully.');
    }

    public function orders(Request $request): Response
    {
        $user = $request->user();
        $orders = $user->orders()
            ->with(['items.customizations', 'items.uploads'])
            ->latest()
            ->paginate(10);

        return Inertia::render('account/orders', [
            'orders' => $orders,
        ]);
    }

    public function orderDetail(string $orderNumber, Request $request): Response
    {
        $user = $request->user();
        $order = Order::where('order_number', $orderNumber)
            ->where('user_id', $user->id)
            ->with(['items.customizations', 'items.uploads', 'items.review', 'statusHistories.user', 'payments'])
            ->firstOrFail();

        return Inertia::render('account/order-detail', [
            'order' => $order,
        ]);
    }

    public function addresses(Request $request): Response
    {
        $user = $request->user();
        $addresses = $user->addresses()->get();

        return Inertia::render('account/addresses', [
            'addresses' => $addresses,
        ]);
    }

    public function storeAddress(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'label' => 'nullable|string|max:100',
            'recipient_name' => 'required|string|max:150',
            'phone' => 'required|string|max:30',
            'line_one' => 'required|string|max:255',
            'line_two' => 'nullable|string|max:255',
            'landmark' => 'nullable|string|max:255',
            'city' => 'required|string|max:120',
            'state' => 'required|string|max:120',
            'postal_code' => 'required|string|max:20',
            'country_code' => 'nullable|string|max:2',
            'is_default' => 'nullable|boolean',
        ]);

        $isDefault = !empty($validated['is_default']) || $user->addresses()->count() === 0;

        if ($isDefault) {
            $user->addresses()->update(['is_default' => false]);
        }

        $user->addresses()->create([
            'label' => $validated['label'] ?? 'Home',
            'recipient_name' => $validated['recipient_name'],
            'phone' => $validated['phone'],
            'line_one' => $validated['line_one'],
            'line_two' => $validated['line_two'] ?? null,
            'landmark' => $validated['landmark'] ?? null,
            'city' => $validated['city'],
            'state' => $validated['state'],
            'postal_code' => $validated['postal_code'],
            'country_code' => $validated['country_code'] ?? 'IN',
            'is_default' => $isDefault,
        ]);

        return redirect()->back()->with('success', 'Address added successfully.');
    }

    public function updateAddress(Address $address, Request $request): RedirectResponse
    {
        $user = $request->user();
        if ($address->user_id !== $user->id) {
            abort(403);
        }

        $validated = $request->validate([
            'label' => 'nullable|string|max:100',
            'recipient_name' => 'required|string|max:150',
            'phone' => 'required|string|max:30',
            'line_one' => 'required|string|max:255',
            'line_two' => 'nullable|string|max:255',
            'landmark' => 'nullable|string|max:255',
            'city' => 'required|string|max:120',
            'state' => 'required|string|max:120',
            'postal_code' => 'required|string|max:20',
            'country_code' => 'nullable|string|max:2',
            'is_default' => 'nullable|boolean',
        ]);

        if (!empty($validated['is_default'])) {
            $user->addresses()->where('id', '!=', $address->id)->update(['is_default' => false]);
            $address->is_default = true;
        }

        $address->update([
            'label' => $validated['label'] ?? $address->label,
            'recipient_name' => $validated['recipient_name'],
            'phone' => $validated['phone'],
            'line_one' => $validated['line_one'],
            'line_two' => $validated['line_two'] ?? null,
            'landmark' => $validated['landmark'] ?? null,
            'city' => $validated['city'],
            'state' => $validated['state'],
            'postal_code' => $validated['postal_code'],
            'country_code' => $validated['country_code'] ?? 'IN',
        ]);

        return redirect()->back()->with('success', 'Address updated successfully.');
    }

    public function destroyAddress(Address $address, Request $request): RedirectResponse
    {
        $user = $request->user();
        if ($address->user_id !== $user->id) {
            abort(403);
        }

        $wasDefault = $address->is_default;
        $address->delete();

        if ($wasDefault) {
            $first = $user->addresses()->first();
            if ($first) {
                $first->update(['is_default' => true]);
            }
        }

        return redirect()->back()->with('success', 'Address deleted.');
    }

    public function setDefaultAddress(Address $address, Request $request): RedirectResponse
    {
        $user = $request->user();
        if ($address->user_id !== $user->id) {
            abort(403);
        }

        $user->addresses()->update(['is_default' => false]);
        $address->update(['is_default' => true]);

        return redirect()->back()->with('success', 'Default address updated.');
    }

    public function emailPreferences(Request $request): Response
    {
        $user = $request->user();
        $pref = $user->emailPreference ?? new EmailPreference([
            'order_updates_enabled' => true,
            'marketing_enabled' => false,
        ]);

        return Inertia::render('account/email-preferences', [
            'preferences' => $pref,
        ]);
    }

    public function updateEmailPreferences(Request $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validate([
            'order_updates_enabled' => 'required|boolean',
            'marketing_enabled' => 'required|boolean',
        ]);

        EmailPreference::updateOrCreate(
            ['user_id' => $user->id],
            [
                'order_updates_enabled' => $validated['order_updates_enabled'],
                'order_updates_consented_at' => $validated['order_updates_enabled'] ? Carbon::now() : null,
                'marketing_enabled' => $validated['marketing_enabled'],
                'marketing_consented_at' => $validated['marketing_enabled'] ? Carbon::now() : null,
            ]
        );

        return redirect()->back()->with('success', 'Notification preferences saved.');
    }
}

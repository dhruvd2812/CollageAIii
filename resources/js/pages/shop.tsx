import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Award,
    Check,
    ChevronDown,
    ChevronRight,
    Clock,
    CreditCard,
    Eye,
    Filter,
    Flame,
    Heart,
    HelpCircle,
    Image as ImageIcon,
    Info,
    Instagram,
    Layers,
    Menu,
    Minus,
    PackageCheck,
    Palette,
    Phone,
    Plus,
    Printer,
    RefreshCw,
    Search,
    Share2,
    ShieldCheck,
    ShoppingBag,
    Sparkles,
    Star,
    Tag,
    Trash2,
    Truck,
    UploadCloud,
    User,
    X,
    Zap,
} from 'lucide-react';
import { useId, useMemo, useState } from 'react';
import AppLogo from '@/components/app-logo';
import AppLogoIcon from '@/components/app-logo-icon';
import { dashboard, login, register } from '@/routes';

// Product type definition
export interface Product {
    id: string;
    name: string;
    category: string;
    categoryId: string;
    price: number;
    originalPrice: number;
    rating: number;
    reviewsCount: number;
    tag: string;
    badgeColor?: string;
    image: string;
    description: string;
    popular?: boolean;
    aspectRatio?: 'square' | 'tall' | 'wide' | 'portrait';
}

export interface CartItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    image: string;
    category: string;
    quantity: number;
    customText?: string;
    customColor?: string;
    customFinish?: string;
}

// Categories
const CATEGORIES = [
    {
        id: 'posters',
        name: 'Posters & Wall Art',
        shortTitle: 'Posters',
        tagline: 'Archival Matte & Framed Prints',
        fromPrice: 299,
        icon: Layers,
        image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=85',
        badge: 'Top Trend',
    },
    {
        id: 'mugs',
        name: 'Ceramic Mugs',
        shortTitle: 'Mugs',
        tagline: 'Dishwasher Safe, Custom Prints',
        fromPrice: 349,
        icon: Palette,
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=85',
        badge: 'Popular',
    },
    {
        id: 'bottles',
        name: 'Insulated Bottles',
        shortTitle: 'Bottles',
        tagline: 'Laser Engraved & UV Printed',
        fromPrice: 599,
        icon: Zap,
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=85',
        badge: 'Durable',
    },
    {
        id: 'apparel',
        name: 'Custom T-Shirts',
        shortTitle: 'T-Shirts',
        tagline: '100% Bio-Washed Cotton',
        fromPrice: 499,
        icon: Tag,
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=85',
        badge: 'Streetwear',
    },
    {
        id: 'cards',
        name: 'Visiting Cards',
        shortTitle: 'Visiting Cards',
        tagline: 'Matte, Glossy & Gold Foil (100 Pcs)',
        fromPrice: 249,
        icon: CreditCard,
        image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=85',
        badge: 'Corporate',
    },
    {
        id: 'photos',
        name: 'HD Photo Prints',
        shortTitle: 'Photo Prints',
        tagline: 'Polaroids, Squares & Albums',
        fromPrice: 149,
        icon: ImageIcon,
        image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=85',
        badge: 'Memories',
    },
    {
        id: 'gifts',
        name: 'Personalized Gifts',
        shortTitle: 'Custom Gifts',
        tagline: 'Acrylic Lamps, Plaques & Keepsakes',
        fromPrice: 399,
        icon: Sparkles,
        image: 'https://images.unsplash.com/photo-1513159446162-54eb8bdaa79b?auto=format&fit=crop&w=800&q=85',
        badge: 'Gifting',
    },
];

// Product catalog
const PRODUCTS: Product[] = [
    {
        id: 'prod-1',
        name: 'Abstract Sunset Gallery Art Poster',
        category: 'Posters & Wall Art',
        categoryId: 'posters',
        price: 399,
        originalPrice: 599,
        rating: 4.9,
        reviewsCount: 238,
        tag: 'Bestseller',
        badgeColor: 'bg-rose-500 text-white',
        image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=85',
        description: 'Museum-grade 300 GSM archival matte paper with fade-resistant pigment printing.',
        popular: true,
        aspectRatio: 'tall',
    },
    {
        id: 'prod-2',
        name: 'Minimalist Matte Ceramic Coffee Mug',
        category: 'Ceramic Mugs',
        categoryId: 'mugs',
        price: 349,
        originalPrice: 499,
        rating: 4.8,
        reviewsCount: 184,
        tag: 'Trending',
        badgeColor: 'bg-amber-500 text-white',
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=85',
        description: '350ml high-fired stoneware ceramic mug with durable wraparound sublimation print.',
        popular: true,
        aspectRatio: 'square',
    },
    {
        id: 'prod-3',
        name: 'Luxury Velvet Matte Visiting Cards (100 pcs)',
        category: 'Visiting Cards',
        categoryId: 'cards',
        price: 499,
        originalPrice: 799,
        rating: 5.0,
        reviewsCount: 310,
        tag: 'Premium Foil',
        badgeColor: 'bg-indigo-600 text-white',
        image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=85',
        description: '450 GSM ultra-thick cardstock with soft-touch lamination and optional metallic foil detailing.',
        popular: true,
        aspectRatio: 'wide',
    },
    {
        id: 'prod-4',
        name: 'Heavyweight Bio-Washed Graphic Tee',
        category: 'Custom T-Shirts',
        categoryId: 'apparel',
        price: 599,
        originalPrice: 899,
        rating: 4.9,
        reviewsCount: 420,
        tag: 'Streetwear',
        badgeColor: 'bg-emerald-600 text-white',
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=85',
        description: '240 GSM 100% combed cotton with breathable, high-definition DTF digital print.',
        popular: true,
        aspectRatio: 'portrait',
    },
    {
        id: 'prod-5',
        name: 'Laser Engraved Thermal Matte Bottle (750ml)',
        category: 'Insulated Bottles',
        categoryId: 'bottles',
        price: 699,
        originalPrice: 999,
        rating: 4.9,
        reviewsCount: 156,
        tag: 'Cold 24h / Hot 12h',
        badgeColor: 'bg-sky-600 text-white',
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=85',
        description: 'Double-walled vacuum insulated 304 food-grade stainless steel with precision laser engraving.',
        popular: true,
        aspectRatio: 'tall',
    },
    {
        id: 'prod-6',
        name: 'Retro Polaroid Photo Box (30 Prints)',
        category: 'HD Photo Prints',
        categoryId: 'photos',
        price: 299,
        originalPrice: 449,
        rating: 4.9,
        reviewsCount: 512,
        tag: 'Keepsake',
        badgeColor: 'bg-rose-600 text-white',
        image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=85',
        description: 'Genuine Fuji Crystal Archive luster photo paper with classic white borders and keepsake tin.',
        popular: true,
        aspectRatio: 'square',
    },
    {
        id: 'prod-7',
        name: 'Custom Spotify Acrylic Song Lamp',
        category: 'Personalized Gifts',
        categoryId: 'gifts',
        price: 799,
        originalPrice: 1199,
        rating: 4.8,
        reviewsCount: 289,
        tag: 'Custom Gift',
        badgeColor: 'bg-amber-600 text-white',
        image: 'https://images.unsplash.com/photo-1513159446162-54eb8bdaa79b?auto=format&fit=crop&w=800&q=85',
        description: 'High-clarity cast acrylic with scannable Spotify code, custom photo and warm LED wooden base.',
        popular: true,
        aspectRatio: 'tall',
    },
    {
        id: 'prod-8',
        name: 'Nordic Botanical Minimalist Framed Print',
        category: 'Posters & Wall Art',
        categoryId: 'posters',
        price: 499,
        originalPrice: 699,
        rating: 4.7,
        reviewsCount: 94,
        tag: 'Framed Ready',
        badgeColor: 'bg-teal-600 text-white',
        image: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=800&q=85',
        description: 'Includes solid natural pine frame with shatterproof acrylic glass and hanging hardware.',
        popular: false,
        aspectRatio: 'portrait',
    },
    {
        id: 'prod-9',
        name: 'Magic Color-Changing Heat Sensitive Mug',
        category: 'Ceramic Mugs',
        categoryId: 'mugs',
        price: 449,
        originalPrice: 599,
        rating: 4.8,
        reviewsCount: 177,
        tag: 'Magic Reveal',
        badgeColor: 'bg-purple-600 text-white',
        image: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=800&q=85',
        description: 'Black ceramic mug reveals your custom hidden photo/artwork when hot liquid is poured in.',
        popular: true,
        aspectRatio: 'square',
    },
    {
        id: 'prod-10',
        name: 'Textured Kraft Paper Eco Business Cards (100 pcs)',
        category: 'Visiting Cards',
        categoryId: 'cards',
        price: 349,
        originalPrice: 499,
        rating: 4.9,
        reviewsCount: 142,
        tag: '100% Recycled',
        badgeColor: 'bg-amber-700 text-white',
        image: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=800&q=85',
        description: '350 GSM rustic earthy kraft stock with deep black letterpress-style ink printing.',
        popular: false,
        aspectRatio: 'wide',
    },
    {
        id: 'prod-11',
        name: 'Hardcover Layflat Keepsake Photo Book',
        category: 'HD Photo Prints',
        categoryId: 'photos',
        price: 1199,
        originalPrice: 1599,
        rating: 5.0,
        reviewsCount: 388,
        tag: 'Luxury Book',
        badgeColor: 'bg-rose-700 text-white',
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=85',
        description: '24-page seamless layflat binding with ultra-thick satin paper and matte laminated cover.',
        popular: true,
        aspectRatio: 'portrait',
    },
    {
        id: 'prod-12',
        name: 'Personalized Engraved Wooden Memory Plaque',
        category: 'Personalized Gifts',
        categoryId: 'gifts',
        price: 649,
        originalPrice: 899,
        rating: 4.9,
        reviewsCount: 115,
        tag: 'Handcrafted',
        badgeColor: 'bg-amber-800 text-white',
        image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=85',
        description: 'Solid beechwood plaque laser-carved with your custom family portrait or anniversary milestone.',
        popular: false,
        aspectRatio: 'square',
    },
];

// Pinterest-style trending pins collection
const TRENDING_PINS = [
    {
        id: 'pin-1',
        title: 'Retro Typography Archival Poster',
        author: '@dwarkesh_print',
        saves: '4.2k saves',
        category: 'Wall Decor',
        image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=85',
        heightClass: 'h-80 sm:h-96',
        tag: '#AestheticPrints',
        price: '₹399',
    },
    {
        id: 'pin-2',
        title: 'Couple Ceramic Matching Mug Set',
        author: '@dwarkesh_studio',
        saves: '8.7k saves',
        category: 'Ceramics',
        image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=85',
        heightClass: 'h-64 sm:h-72',
        tag: '#CoupleGifts',
        price: '₹649',
    },
    {
        id: 'pin-3',
        title: 'Minimalist Black Business Card Stack',
        author: '@dwarkesh_brand',
        saves: '12.1k saves',
        category: 'Identity',
        image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=85',
        heightClass: 'h-72 sm:h-88',
        tag: '#BrandingDesign',
        price: '₹499',
    },
    {
        id: 'pin-4',
        title: 'Oversize Acid-Wash Custom Band Tee',
        author: '@dwarkesh_apparel',
        saves: '5.9k saves',
        category: 'Streetwear',
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=85',
        heightClass: 'h-96 sm:h-[420px]',
        tag: '#CustomTee',
        price: '₹699',
    },
    {
        id: 'pin-5',
        title: 'Gallery Acrylic Floating Frame',
        author: '@dwarkesh_gallery',
        saves: '6.3k saves',
        category: 'Wall Art',
        image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=85',
        heightClass: 'h-64 sm:h-80',
        tag: '#GalleryWall',
        price: '₹599',
    },
    {
        id: 'pin-6',
        title: 'Matte Black Laser Flask & Bottle',
        author: '@dwarkesh_drinkware',
        saves: '3.8k saves',
        category: 'Drinkware',
        image: 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=800&q=85',
        heightClass: 'h-80 sm:h-96',
        tag: '#LaserEngraved',
        price: '₹699',
    },
];

export default function Shop() {
    const pageProps = usePage().props;
    const auth = (pageProps as any)?.auth || {};

    // Interactive UI states
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [wishlistOpen, setWishlistOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const [couponCode, setCouponCode] = useState('');
    const [couponApplied, setCouponApplied] = useState(false);
    const [couponError, setCouponError] = useState('');
    const [checkoutSuccess, setCheckoutSuccess] = useState(false);

    // Likes / Wishlist state
    const [likedIds, setLikedIds] = useState<string[]>(['prod-1', 'prod-3']);

    // Cart items state with realistic initial items
    const [cartItems, setCartItems] = useState<CartItem[]>([
        {
            id: 'cart-1',
            productId: 'prod-1',
            name: 'Abstract Sunset Gallery Art Poster',
            price: 399,
            image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=85',
            category: 'Posters & Wall Art',
            quantity: 1,
            customFinish: 'Archival Matte (A3)',
        },
    ]);

    // Custom Design Studio interactive state
    const [customProductType, setCustomProductType] = useState('mug');
    const [customText, setCustomText] = useState('STAY CREATIVE');
    const [customColor, setCustomColor] = useState('#1e293b');
    const [customFinish, setCustomFinish] = useState('Matte UV');
    const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
    const [customAddedToast, setCustomAddedToast] = useState(false);

    // Toast notification
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    // Toggle Wishlist
    const toggleLike = (productId: string) => {
        setLikedIds((prev) => {
            const exists = prev.includes(productId);
            if (exists) {
                showToast('Removed from your saved inspiration');
                return prev.filter((id) => id !== productId);
            } else {
                showToast('Saved to your Wishlist ❤️');
                return [...prev, productId];
            }
        });
    };

    // Add to Cart
    const addToCart = (product: Product, options?: { customText?: string; customColor?: string; customFinish?: string }) => {
        setCartItems((prev) => {
            const existing = prev.find((item) => item.productId === product.id && !options?.customText);
            if (existing) {
                return prev.map((item) =>
                    item.id === existing.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            const newItem: CartItem = {
                id: `cart-${Date.now()}`,
                productId: product.id,
                name: product.name,
                price: product.price,
                image: options?.customText && uploadedImagePreview ? uploadedImagePreview : product.image,
                category: product.category,
                quantity: 1,
                customText: options?.customText,
                customColor: options?.customColor,
                customFinish: options?.customFinish,
            };
            return [newItem, ...prev];
        });
        showToast(`Added "${product.name.slice(0, 24)}..." to bag! 🛍️`);
    };

    // Customizer Add to Bag
    const handleAddCustomToCart = () => {
        const productMap: Record<string, { name: string; price: number; category: string; defaultImg: string }> = {
            mug: {
                name: 'Custom Printed Ceramic Coffee Mug',
                price: 349,
                category: 'Ceramic Mugs',
                defaultImg: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=85',
            },
            poster: {
                name: 'Custom HD Archival Wall Poster',
                price: 399,
                category: 'Posters & Wall Art',
                defaultImg: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=85',
            },
            bottle: {
                name: 'Custom Laser Engraved Stainless Bottle',
                price: 699,
                category: 'Insulated Bottles',
                defaultImg: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=85',
            },
            tee: {
                name: 'Custom Bio-Washed Graphic Cotton T-Shirt',
                price: 599,
                category: 'Custom T-Shirts',
                defaultImg: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=85',
            },
            card: {
                name: 'Custom Velvet Gold Foil Visiting Cards (100 pcs)',
                price: 499,
                category: 'Visiting Cards',
                defaultImg: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=85',
            },
            polaroid: {
                name: 'Custom Retro Polaroid Keepsake Prints (20 pcs)',
                price: 249,
                category: 'HD Photo Prints',
                defaultImg: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=85',
            },
        };

        const target = productMap[customProductType] || productMap.mug;
        const newItem: CartItem = {
            id: `custom-${Date.now()}`,
            productId: `custom-${customProductType}`,
            name: target.name,
            price: target.price,
            image: uploadedImagePreview || target.defaultImg,
            category: target.category,
            quantity: 1,
            customText: customText || 'Custom Print Artwork',
            customColor: customColor,
            customFinish: customFinish,
        };

        setCartItems((prev) => [newItem, ...prev]);
        setCustomAddedToast(true);
        setTimeout(() => setCustomAddedToast(false), 3500);
        showToast('✨ Custom creation added to your bag!');
        setCartOpen(true);
    };

    // Cart calculations
    const cartCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);
    const cartSubtotal = useMemo(() => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [cartItems]);
    const discountAmount = couponApplied ? Math.round(cartSubtotal * 0.1) : 0;
    const shippingFee = cartSubtotal >= 799 || cartSubtotal === 0 ? 0 : 79;
    const cartTotal = cartSubtotal - discountAmount + shippingFee;

    const handleApplyCoupon = (e: React.FormEvent) => {
        e.preventDefault();
        if (couponCode.trim().toUpperCase() === 'PRINT10') {
            setCouponApplied(true);
            setCouponError('');
            showToast('🎉 Coupon PRINT10 applied! 10% Discount saved.');
        } else {
            setCouponError('Invalid coupon code. Try code "PRINT10"');
        }
    };

    // Filtered products
    const filteredProducts = useMemo(() => {
        let list = PRODUCTS;
        if (selectedCategory !== 'all') {
            list = list.filter((p) => p.categoryId === selectedCategory);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.category.toLowerCase().includes(q) ||
                    p.description.toLowerCase().includes(q) ||
                    p.tag.toLowerCase().includes(q)
            );
        }
        return list;
    }, [selectedCategory, searchQuery]);

    // Wishlist products
    const wishlistProducts = useMemo(() => {
        return PRODUCTS.filter((p) => likedIds.includes(p.id));
    }, [likedIds]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setUploadedImagePreview(event.target?.result as string);
                showToast('Photo uploaded successfully to canvas! 🎨');
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            <Head>
                <title>PRINTWITHDWARKESH | Custom Printing, Posters, Mugs, T-Shirts & Photo Gifts</title>
                <meta
                    name="description"
                    content="India's modern custom printing destination. High-definition wall posters, customized ceramic mugs, insulated bottles, streetwear t-shirts, luxury visiting cards, and personalized keepsakes."
                />
            </Head>

            <div className="min-h-screen bg-[#faf8f5] text-neutral-900 font-sans antialiased selection:bg-rose-500 selection:text-white">
                {/* 1. TOP ANNOUNCEMENT BANNER */}
                <div className="bg-neutral-900 text-neutral-100 px-4 py-2 text-xs font-medium tracking-wide">
                    <div className="mx-auto flex max-w-7xl items-center justify-between">
                        <div className="hidden sm:flex items-center gap-2">
                            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-neutral-300">Fast 48h Dispatch across India</span>
                        </div>
                        <div className="mx-auto text-center sm:mx-0 font-medium">
                            <span className="text-rose-400 font-semibold">SPECIAL LAUNCH:</span> Use code{' '}
                            <button
                                onClick={() => {
                                    setCouponCode('PRINT10');
                                    showToast('Code PRINT10 copied! Open bag to apply.');
                                }}
                                className="font-bold underline decoration-rose-400 underline-offset-2 hover:text-white cursor-pointer"
                            >
                                PRINT10
                            </button>{' '}
                            for 10% OFF • Free shipping on orders over ₹799!
                        </div>
                        <div className="hidden lg:flex items-center gap-4 text-neutral-400 text-[11px]">
                            <a href="#custom-design" className="hover:text-white transition">
                                Studio Upload
                            </a>
                            <span>•</span>
                            <a href="#faq" className="hover:text-white transition">
                                Help & FAQ
                            </a>
                        </div>
                    </div>
                </div>

                {/* 2. STICKY HEADER */}
                <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 shadow-xs transition-all">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                        {/* Brand Logo */}
                        <a href="/" className="flex items-center gap-3 group">
                            <div className="flex aspect-square size-10 items-center justify-center rounded-2xl bg-neutral-900 shadow-md group-hover:bg-rose-600 transition-colors duration-300">
                                <AppLogoIcon className="size-6" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-extrabold tracking-tight text-neutral-900 text-lg sm:text-xl leading-none">
                                    PRINTWITHDWARKESH
                                </span>
                                <span className="text-[10px] font-semibold uppercase tracking-widest text-rose-600 mt-0.5">
                                    Custom Print & Gifts
                                </span>
                            </div>
                        </a>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-neutral-700">
                            <a href="/" className="text-rose-600 hover:text-rose-700 transition">
                                Home
                            </a>
                            <a href="#shop" className="hover:text-rose-600 transition">
                                Shop
                            </a>
                            <a href="#categories" className="hover:text-rose-600 transition">
                                Categories
                            </a>
                            <a
                                href="#custom-design"
                                className="flex items-center gap-1.5 text-neutral-900 hover:text-rose-600 transition bg-rose-50 px-3 py-1 rounded-full text-xs font-bold text-rose-600 border border-rose-200"
                            >
                                <Sparkles className="size-3.5" />
                                Custom Studio
                            </a>
                            <a href="#trending" className="hover:text-rose-600 transition">
                                Trending Pins
                            </a>
                            <a href="#why-us" className="hover:text-rose-600 transition">
                                Why Us
                            </a>
                            <a href="#contact" className="hover:text-rose-600 transition">
                                Contact
                            </a>
                        </nav>

                        {/* Action Icons */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            {/* Search Button */}
                            <button
                                onClick={() => setSearchOpen(true)}
                                aria-label="Search prints"
                                className="flex items-center justify-center size-10 rounded-full text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition"
                            >
                                <Search className="size-5" />
                            </button>

                            {/* Wishlist Button */}
                            <button
                                onClick={() => setWishlistOpen(true)}
                                aria-label="Wishlist"
                                className="relative flex items-center justify-center size-10 rounded-full text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition"
                            >
                                <Heart className="size-5" />
                                {likedIds.length > 0 && (
                                    <span className="absolute 1 top-1.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-xs">
                                        {likedIds.length}
                                    </span>
                                )}
                            </button>

                            {/* Shopping Bag Button */}
                            <button
                                onClick={() => setCartOpen(true)}
                                aria-label="Shopping Bag"
                                className="relative flex items-center gap-2 rounded-full bg-neutral-900 px-3.5 py-2 text-white hover:bg-neutral-800 transition shadow-sm"
                            >
                                <ShoppingBag className="size-4" />
                                <span className="hidden sm:inline text-xs font-semibold">Bag</span>
                                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[11px] font-bold text-white">
                                    {cartCount}
                                </span>
                            </button>

                            {/* Auth Link / Account */}
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="hidden sm:flex items-center gap-2 rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-100 transition"
                                >
                                    <User className="size-3.5" />
                                    <span>Account</span>
                                </Link>
                            ) : (
                                <Link
                                    href={login()}
                                    className="hidden sm:flex items-center gap-1.5 rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-800 hover:bg-neutral-100 transition"
                                >
                                    <User className="size-3.5" />
                                    <span>Log in</span>
                                </Link>
                            )}

                            {/* Mobile Hamburger Toggle */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label="Open navigation menu"
                                className="flex lg:hidden items-center justify-center size-10 rounded-xl text-neutral-700 hover:bg-neutral-100 transition"
                            >
                                {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation Dropdown */}
                    {mobileMenuOpen && (
                        <div className="lg:hidden border-t border-neutral-200 bg-white px-5 py-6 shadow-xl animate-in slide-in-from-top duration-200">
                            <nav className="flex flex-col gap-4 text-base font-medium">
                                <a
                                    href="/"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-rose-600 font-semibold"
                                >
                                    Home
                                </a>
                                <a
                                    href="#shop"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-neutral-800 hover:text-rose-600"
                                >
                                    Shop All Products
                                </a>
                                <a
                                    href="#categories"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-neutral-800 hover:text-rose-600"
                                >
                                    Categories
                                </a>
                                <a
                                    href="#custom-design"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-2 text-rose-600 font-semibold"
                                >
                                    <Sparkles className="size-4" />
                                    Custom Studio (Design Your Own)
                                </a>
                                <a
                                    href="#trending"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-neutral-800 hover:text-rose-600"
                                >
                                    Trending Pinterest Pins
                                </a>
                                <a
                                    href="#why-us"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-neutral-800 hover:text-rose-600"
                                >
                                    Why Choose Us
                                </a>
                                <a
                                    href="#contact"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-neutral-800 hover:text-rose-600"
                                >
                                    Contact & Support
                                </a>

                                <div className="mt-4 pt-4 border-t border-neutral-100 flex flex-col gap-2">
                                    {auth.user ? (
                                        <Link
                                            href={dashboard()}
                                            className="w-full text-center rounded-xl bg-neutral-900 py-3 text-sm font-semibold text-white"
                                        >
                                            Go to Dashboard
                                        </Link>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-3">
                                            <Link
                                                href={login()}
                                                className="text-center rounded-xl border border-neutral-300 py-2.5 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
                                            >
                                                Log In
                                            </Link>
                                            <Link
                                                href={register()}
                                                className="text-center rounded-xl bg-neutral-900 py-2.5 text-sm font-semibold text-white"
                                            >
                                                Register
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </nav>
                        </div>
                    )}
                </header>

                <main>
                    {/* 3. HERO SECTION (PINTEREST-INSPIRED STOREFRONT) */}
                    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
                        <div className="absolute top-1/4 -left-40 size-96 rounded-full bg-rose-200/40 blur-3xl pointer-events-none" />
                        <div className="absolute top-1/3 -right-40 size-96 rounded-full bg-amber-200/40 blur-3xl pointer-events-none" />

                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
                                {/* Hero Left Text */}
                                <div className="lg:col-span-6 space-y-6">
                                    <div className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 border border-neutral-200/90 shadow-xs">
                                        <span className="flex size-2 rounded-full bg-rose-500" />
                                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                                            Custom Print Studio • India
                                        </span>
                                    </div>

                                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-neutral-950 leading-[1.08]">
                                        Print Your World, <br />
                                        <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 bg-clip-text text-transparent">
                                            Exactly How You Imagined.
                                        </span>
                                    </h1>

                                    <p className="text-base sm:text-lg text-neutral-600 max-w-xl leading-relaxed">
                                        From gallery-grade wall posters and personalized ceramic mugs to insulated bottles,
                                        custom cotton tees, visiting cards & memory keepsakes. Crafted with precision for your home,
                                        brand & loved ones.
                                    </p>

                                    {/* Action CTAs */}
                                    <div className="flex flex-wrap items-center gap-4 pt-2">
                                        <a
                                            href="#shop"
                                            className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-7 py-3.5 text-sm font-bold text-white hover:bg-neutral-800 hover:shadow-lg transition-all duration-200 active:scale-95"
                                        >
                                            <span>Shop Best Sellers</span>
                                            <ArrowRight className="size-4" />
                                        </a>
                                        <a
                                            href="#custom-design"
                                            className="inline-flex items-center justify-center gap-2 rounded-full bg-white border-2 border-neutral-900 px-6 py-3 text-sm font-bold text-neutral-900 hover:bg-neutral-50 hover:shadow-md transition-all duration-200"
                                        >
                                            <Sparkles className="size-4 text-rose-500" />
                                            <span>Create Your Design</span>
                                        </a>
                                    </div>

                                    {/* Trust Stats */}
                                    <div className="pt-6 grid grid-cols-3 gap-4 border-t border-neutral-200/70">
                                        <div>
                                            <div className="flex items-center gap-1 text-amber-500">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className="size-3.5 fill-current" />
                                                ))}
                                            </div>
                                            <p className="mt-1 text-xs font-bold text-neutral-900">4.9 / 5 Rating</p>
                                            <p className="text-[11px] text-neutral-500">15,000+ Happy Orders</p>
                                        </div>
                                        <div className="border-l border-neutral-200 pl-4">
                                            <p className="font-extrabold text-neutral-900 text-lg">48 Hr</p>
                                            <p className="text-[11px] text-neutral-500">Express Dispatch</p>
                                        </div>
                                        <div className="border-l border-neutral-200 pl-4">
                                            <p className="font-extrabold text-neutral-900 text-lg">100%</p>
                                            <p className="text-[11px] text-neutral-500">Delight Guarantee</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Hero Right Visual / Pinterest Collage Moodboard */}
                                <div className="lg:col-span-6 relative">
                                    <div className="grid grid-cols-2 gap-4 sm:gap-6">
                                        {/* Card 1 - Poster */}
                                        <div className="group relative overflow-hidden rounded-3xl bg-white shadow-xl border border-neutral-100 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
                                            <div className="aspect-[3/4] overflow-hidden bg-neutral-100">
                                                <img
                                                    src="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=85"
                                                    alt="Wall Art Poster"
                                                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                                />
                                            </div>
                                            <div className="p-4">
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                                                    Wall Decor
                                                </span>
                                                <h3 className="font-bold text-sm text-neutral-900 truncate">
                                                    Archival Fine Art Poster
                                                </h3>
                                                <div className="mt-1 flex items-center justify-between">
                                                    <span className="text-xs font-extrabold text-neutral-900">₹399</span>
                                                    <button
                                                        onClick={() => addToCart(PRODUCTS[0])}
                                                        className="rounded-full bg-neutral-100 p-1.5 text-neutral-700 hover:bg-neutral-900 hover:text-white transition"
                                                    >
                                                        <Plus className="size-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Column 2 - Mug & T-Shirt stacked */}
                                        <div className="space-y-4 sm:space-y-6 pt-6 sm:pt-10">
                                            {/* Mug Card */}
                                            <div className="group relative overflow-hidden rounded-3xl bg-white shadow-lg border border-neutral-100 transition-all duration-300 hover:-translate-y-1.5">
                                                <div className="aspect-square overflow-hidden bg-neutral-100">
                                                    <img
                                                        src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=85"
                                                        alt="Custom Ceramic Mug"
                                                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                                    />
                                                </div>
                                                <div className="p-3.5">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                                                        Drinkware
                                                    </span>
                                                    <h3 className="font-bold text-xs text-neutral-900 truncate">
                                                        Matte Custom Mug
                                                    </h3>
                                                    <p className="text-xs font-extrabold text-neutral-900 mt-0.5">₹349</p>
                                                </div>
                                            </div>

                                            {/* Visiting Card Badge */}
                                            <div className="rounded-3xl bg-neutral-900 p-5 text-white shadow-xl relative overflow-hidden">
                                                <div className="absolute -right-6 -bottom-6 size-24 rounded-full bg-rose-500/30 blur-xl" />
                                                <div className="flex items-center gap-2 text-amber-400">
                                                    <Sparkles className="size-4" />
                                                    <span className="text-xs font-bold uppercase tracking-wider">
                                                        Self-Design
                                                    </span>
                                                </div>
                                                <h4 className="mt-2 text-base font-bold leading-tight">
                                                    Upload your photo or logo in seconds.
                                                </h4>
                                                <p className="mt-1 text-xs text-neutral-400">
                                                    Ultra-HD UV & archival inks.
                                                </p>
                                                <a
                                                    href="#custom-design"
                                                    className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-rose-400 hover:text-rose-300"
                                                >
                                                    <span>Open Studio</span>
                                                    <ChevronRight className="size-3.5" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 4. CATEGORY SECTION */}
                    <section id="categories" className="py-16 bg-white border-y border-neutral-200/60 scroll-mt-20">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-rose-600 flex items-center gap-1.5">
                                        <Sparkles className="size-3.5" />
                                        Explore Our Range
                                    </p>
                                    <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl text-neutral-950">
                                        Curated Print Categories
                                    </h2>
                                </div>
                                <p className="text-sm text-neutral-500 max-w-md">
                                    Choose from 7 bespoke printing categories made with premium materials & vibrant inks.
                                </p>
                            </div>

                            {/* Categories Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                                {CATEGORIES.map((cat) => {
                                    const IconComponent = cat.icon;
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => {
                                                setSelectedCategory(cat.id);
                                                const shopSec = document.getElementById('shop');
                                                shopSec?.scrollIntoView({ behavior: 'smooth' });
                                            }}
                                            className="group relative flex flex-col overflow-hidden rounded-3xl bg-[#faf8f5] border border-neutral-200/80 p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-neutral-300 cursor-pointer"
                                        >
                                            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-neutral-200 mb-4">
                                                <img
                                                    src={cat.image}
                                                    alt={cat.name}
                                                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                                                />
                                                <span className="absolute top-2.5 left-2.5 rounded-full bg-white/90 backdrop-blur-xs px-2.5 py-1 text-[10px] font-bold text-neutral-900 shadow-xs">
                                                    {cat.badge}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex size-7 items-center justify-center rounded-full bg-white shadow-xs text-rose-600">
                                                    <IconComponent className="size-3.5" />
                                                </div>
                                                <h3 className="font-bold text-neutral-900 text-sm sm:text-base group-hover:text-rose-600 transition-colors">
                                                    {cat.name}
                                                </h3>
                                            </div>
                                            <p className="mt-1 text-xs text-neutral-500 line-clamp-1">{cat.tagline}</p>
                                            <div className="mt-3 flex items-center justify-between pt-2 border-t border-neutral-200/60">
                                                <span className="text-xs font-semibold text-neutral-600">
                                                    From <span className="font-extrabold text-neutral-900">₹{cat.fromPrice}</span>
                                                </span>
                                                <span className="text-xs font-bold text-rose-600 group-hover:translate-x-1 transition-transform">
                                                    Explore →
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* 5. FEATURED PRODUCTS (STOREFRONT PRODUCTS) */}
                    <section id="shop" className="py-20 scroll-mt-20">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="text-center max-w-2xl mx-auto mb-10">
                                <span className="text-xs font-bold uppercase tracking-widest text-rose-600">
                                    Handcrafted Perfection
                                </span>
                                <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl text-neutral-950">
                                    Featured Custom Products
                                </h2>
                                <p className="mt-3 text-sm text-neutral-600">
                                    Select any item to customize or order directly with your personal touch.
                                </p>
                            </div>

                            {/* Category Filter Pills */}
                            <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
                                <button
                                    onClick={() => setSelectedCategory('all')}
                                    className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${
                                        selectedCategory === 'all'
                                            ? 'bg-neutral-900 text-white shadow-md'
                                            : 'bg-white border border-neutral-300 text-neutral-700 hover:border-neutral-400'
                                    }`}
                                >
                                    All Prints
                                </button>
                                {CATEGORIES.map((c) => (
                                    <button
                                        key={c.id}
                                        onClick={() => setSelectedCategory(c.id)}
                                        className={`rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap transition-all ${
                                            selectedCategory === c.id
                                                ? 'bg-neutral-900 text-white shadow-md'
                                                : 'bg-white border border-neutral-300 text-neutral-700 hover:border-neutral-400'
                                        }`}
                                    >
                                        {c.shortTitle}
                                    </button>
                                ))}
                            </div>

                            {/* Product Cards Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                                {filteredProducts.map((prod) => {
                                    const isLiked = likedIds.includes(prod.id);
                                    return (
                                        <div
                                            key={prod.id}
                                            className="group relative flex flex-col overflow-hidden rounded-3xl bg-white border border-neutral-200/80 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-neutral-300"
                                        >
                                            {/* Product Image Area */}
                                            <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                                                <img
                                                    src={prod.image}
                                                    alt={prod.name}
                                                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                                />

                                                {/* Badge */}
                                                <span
                                                    className={`absolute top-3 left-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                                                        prod.badgeColor || 'bg-neutral-900 text-white'
                                                    }`}
                                                >
                                                    {prod.tag}
                                                </span>

                                                {/* Wishlist Button */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleLike(prod.id);
                                                    }}
                                                    aria-label="Save to wishlist"
                                                    className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-white/95 text-neutral-700 backdrop-blur-xs shadow-md hover:bg-white hover:text-rose-600 transition"
                                                >
                                                    <Heart
                                                        className={`size-4 transition-colors ${
                                                            isLiked ? 'fill-rose-500 text-rose-500' : ''
                                                        }`}
                                                    />
                                                </button>

                                                {/* Quick View Button on Hover */}
                                                <button
                                                    onClick={() => setQuickViewProduct(prod)}
                                                    className="absolute inset-x-4 bottom-4 hidden group-hover:flex items-center justify-center gap-2 rounded-xl bg-white/95 py-2.5 text-xs font-bold text-neutral-900 shadow-md backdrop-blur-xs transition hover:bg-white"
                                                >
                                                    <Eye className="size-4" />
                                                    <span>Quick Customise</span>
                                                </button>
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex flex-1 flex-col p-5">
                                                <div className="flex items-center justify-between text-xs text-neutral-500">
                                                    <span>{prod.category}</span>
                                                    <span className="flex items-center gap-1 font-semibold text-neutral-800">
                                                        <Star className="size-3 fill-amber-400 text-amber-400" />
                                                        {prod.rating} ({prod.reviewsCount})
                                                    </span>
                                                </div>

                                                <h3 className="mt-1.5 font-bold text-neutral-900 text-base leading-snug line-clamp-1 group-hover:text-rose-600 transition-colors">
                                                    {prod.name}
                                                </h3>

                                                <p className="mt-1.5 text-xs text-neutral-500 line-clamp-2 leading-relaxed flex-1">
                                                    {prod.description}
                                                </p>

                                                {/* Price & Add to Cart */}
                                                <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
                                                    <div>
                                                        <span className="text-xs text-neutral-400 line-through mr-1.5">
                                                            ₹{prod.originalPrice}
                                                        </span>
                                                        <span className="text-lg font-extrabold text-neutral-900">
                                                            ₹{prod.price}
                                                        </span>
                                                    </div>

                                                    <button
                                                        onClick={() => addToCart(prod)}
                                                        className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-4 py-2 text-xs font-bold text-white hover:bg-rose-600 transition active:scale-95 shadow-sm"
                                                    >
                                                        <ShoppingBag className="size-3.5" />
                                                        <span>Add to Bag</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {filteredProducts.length === 0 && (
                                <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200">
                                    <Search className="size-12 mx-auto text-neutral-300" />
                                    <h3 className="mt-4 text-lg font-bold text-neutral-800">No matching prints found</h3>
                                    <p className="mt-1 text-sm text-neutral-500">
                                        Try adjusting your search or explore all categories.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setSelectedCategory('all');
                                            setSearchQuery('');
                                        }}
                                        className="mt-4 rounded-full bg-neutral-900 px-5 py-2 text-xs font-bold text-white"
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* 6. INTERACTIVE CUSTOM PRINTING STUDIO */}
                    <section id="custom-design" className="py-20 bg-neutral-950 text-white relative overflow-hidden scroll-mt-20">
                        <div className="absolute top-0 right-0 size-96 rounded-full bg-rose-600/20 blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 left-0 size-96 rounded-full bg-amber-600/20 blur-3xl pointer-events-none" />

                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                            <div className="max-w-3xl mx-auto text-center mb-14">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-rose-300 border border-rose-500/30">
                                    <Sparkles className="size-3.5" />
                                    Interactive Print Studio
                                </span>
                                <h2 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                                    Upload Your Photo & Design Your Custom Masterpiece
                                </h2>
                                <p className="mt-4 text-sm sm:text-base text-neutral-400">
                                    Experience real-time live mockup preview. Pick your canvas, upload your artwork, add custom
                                    text, and we will print it with archival precision.
                                </p>
                            </div>

                            {/* Studio Interactive Card */}
                            <div className="grid lg:grid-cols-12 gap-8 items-center rounded-3xl bg-neutral-900/90 border border-neutral-800 p-6 sm:p-10 shadow-2xl backdrop-blur-md">
                                {/* Left: Controls */}
                                <div className="lg:col-span-6 space-y-6">
                                    {/* Step 1: Canvas Type */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
                                            1. Choose Product Canvas
                                        </label>
                                        <div className="grid grid-cols-3 gap-2.5">
                                            {[
                                                { id: 'mug', label: 'Ceramic Mug', price: '₹349' },
                                                { id: 'poster', label: 'Wall Poster', price: '₹399' },
                                                { id: 'bottle', label: 'Steel Bottle', price: '₹699' },
                                                { id: 'tee', label: 'Cotton Tee', price: '₹599' },
                                                { id: 'card', label: 'Visiting Cards', price: '₹499' },
                                                { id: 'polaroid', label: 'Polaroids', price: '₹249' },
                                            ].map((item) => (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    onClick={() => setCustomProductType(item.id)}
                                                    className={`rounded-2xl p-3 text-left border transition-all ${
                                                        customProductType === item.id
                                                            ? 'bg-rose-600 border-rose-500 text-white shadow-md'
                                                            : 'bg-neutral-800/80 border-neutral-700 text-neutral-300 hover:border-neutral-600'
                                                    }`}
                                                >
                                                    <p className="font-bold text-xs">{item.label}</p>
                                                    <p className="text-[11px] opacity-80 mt-0.5">{item.price}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Step 2: Upload Artwork */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                                            2. Upload Photo or Artwork
                                        </label>
                                        <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-700 bg-neutral-800/50 p-5 text-center hover:border-rose-500 transition">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                            />
                                            <UploadCloud className="size-8 text-rose-400 mb-2" />
                                            <p className="text-xs font-bold text-white">
                                                Click to upload high-res image or drag & drop
                                            </p>
                                            <p className="text-[11px] text-neutral-400 mt-1">
                                                Supports PNG, JPG, WEBP, SVG (Up to 25MB)
                                            </p>
                                            {uploadedImagePreview && (
                                                <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                                                    <Check className="size-3" /> Image Loaded into Canvas
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Step 3: Custom Text */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                                            3. Add Custom Name or Typography
                                        </label>
                                        <input
                                            type="text"
                                            value={customText}
                                            onChange={(e) => setCustomText(e.target.value)}
                                            placeholder="e.g. DWARKESH STUDIO 2026"
                                            className="w-full rounded-2xl bg-neutral-800 border border-neutral-700 px-4 py-3 text-sm text-white focus:border-rose-500 focus:outline-none"
                                        />
                                    </div>

                                    {/* Step 4: Finish selection */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                                            4. Premium Print Finish
                                        </label>
                                        <div className="flex gap-2">
                                            {['Matte UV', 'Glossy Luster', 'Gold Foil Accent'].map((finish) => (
                                                <button
                                                    key={finish}
                                                    type="button"
                                                    onClick={() => setCustomFinish(finish)}
                                                    className={`rounded-full px-4 py-2 text-xs font-bold border transition ${
                                                        customFinish === finish
                                                            ? 'bg-white text-neutral-900 border-white'
                                                            : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white'
                                                    }`}
                                                >
                                                    {finish}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Add to Cart CTA */}
                                    <button
                                        onClick={handleAddCustomToCart}
                                        className="w-full rounded-full bg-gradient-to-r from-rose-600 to-amber-600 py-4 text-sm font-extrabold text-white shadow-lg hover:shadow-rose-600/30 hover:brightness-110 transition active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <Sparkles className="size-4" />
                                        <span>Add Custom Creation to Bag</span>
                                    </button>
                                </div>

                                {/* Right: Live Interactive Mockup Canvas */}
                                <div className="lg:col-span-6 flex flex-col items-center">
                                    <div className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-br from-neutral-800 to-neutral-900 p-6 border border-neutral-700 shadow-2xl flex flex-col items-center justify-center overflow-hidden">
                                        <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md">
                                            <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                                            <span>LIVE PREVIEW</span>
                                        </div>

                                        {/* Mockup Canvas Visual */}
                                        <div className="relative size-64 sm:size-72 rounded-2xl overflow-hidden shadow-2xl border-4 border-neutral-700/50 flex items-center justify-center bg-neutral-950">
                                            {/* Background Base */}
                                            {uploadedImagePreview ? (
                                                <img
                                                    src={uploadedImagePreview}
                                                    alt="Uploaded Custom Design"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full relative">
                                                    <img
                                                        src={
                                                            customProductType === 'mug'
                                                                ? 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=85'
                                                                : customProductType === 'poster'
                                                                ? 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=85'
                                                                : customProductType === 'bottle'
                                                                ? 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=85'
                                                                : customProductType === 'tee'
                                                                ? 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=85'
                                                                : 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=85'
                                                        }
                                                        alt="Mockup Base"
                                                        className="h-full w-full object-cover opacity-80"
                                                    />
                                                </div>
                                            )}

                                            {/* Dynamic Custom Text Overlay */}
                                            {customText && (
                                                <div className="absolute inset-x-4 bottom-6 rounded-xl bg-black/70 backdrop-blur-md p-3 text-center border border-white/20">
                                                    <p className="font-extrabold text-sm sm:text-base tracking-widest text-white uppercase drop-shadow-md">
                                                        {customText}
                                                    </p>
                                                    <span className="text-[9px] font-semibold text-rose-300 uppercase tracking-widest">
                                                        PRINTWITHDWARKESH • {customFinish}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <p className="mt-4 text-xs text-neutral-400 text-center">
                                            100% High-definition UV & Archival Pigment Inks Guaranteed.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 7. POPULAR / TRENDING DISCOVERY (PINTEREST MASONRY LAYOUT) */}
                    <section id="trending" className="py-20 scroll-mt-20">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-rose-600 flex items-center gap-1.5">
                                        <Flame className="size-3.5" />
                                        Inspiration Moodboard
                                    </span>
                                    <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl text-neutral-950">
                                        Popular & Trending Pins
                                    </h2>
                                </div>
                                <p className="text-sm text-neutral-500 max-w-md">
                                    Discover what creators and businesses are printing this week on PRINTWITHDWARKESH.
                                </p>
                            </div>

                            {/* Pinterest-Style Staggered Grid */}
                            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                                {TRENDING_PINS.map((pin) => (
                                    <div
                                        key={pin.id}
                                        className="group relative break-inside-avoid overflow-hidden rounded-3xl bg-white border border-neutral-200/80 shadow-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                                    >
                                        <div className={`relative ${pin.heightClass} overflow-hidden bg-neutral-100`}>
                                            <img
                                                src={pin.image}
                                                alt={pin.title}
                                                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                            />

                                            {/* Hover Pinterest Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5">
                                                <div className="flex justify-between items-center">
                                                    <span className="rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-neutral-900">
                                                        {pin.tag}
                                                    </span>
                                                    <button
                                                        onClick={() => showToast('📌 Saved to your Pinterest inspiration board!')}
                                                        className="flex size-9 items-center justify-center rounded-full bg-rose-600 text-white shadow-lg hover:bg-rose-700 transition"
                                                    >
                                                        <Heart className="size-4 fill-white" />
                                                    </button>
                                                </div>

                                                <div className="space-y-2">
                                                    <p className="text-xs font-semibold text-neutral-300">{pin.saves}</p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-extrabold text-white">
                                                            Starts {pin.price}
                                                        </span>
                                                        <a
                                                            href="#custom-design"
                                                            className="rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-neutral-900 hover:bg-neutral-100 transition"
                                                        >
                                                            Customize
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-white">
                                            <h3 className="font-bold text-sm text-neutral-900 truncate">{pin.title}</h3>
                                            <div className="mt-1 flex items-center justify-between text-xs text-neutral-500">
                                                <span>{pin.category}</span>
                                                <span className="font-medium">{pin.author}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* 8. WHY CHOOSE US */}
                    <section id="why-us" className="py-20 bg-white border-y border-neutral-200/80 scroll-mt-20">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="text-center max-w-2xl mx-auto mb-14">
                                <span className="text-xs font-bold uppercase tracking-widest text-rose-600">
                                    The Dwarkesh Standard
                                </span>
                                <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl text-neutral-950">
                                    Why Customers Choose Us
                                </h2>
                                <p className="mt-3 text-sm text-neutral-600">
                                    Commercial quality printing engineered with high-grade European papers, Japanese pigment
                                    inks, and dedicated artisan care.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {[
                                    {
                                        icon: Printer,
                                        title: 'Fine-Art Ultra HD Quality',
                                        desc: '2400 DPI ultra-high definition printing with archival 12-color pigment and durable UV curable inks.',
                                        color: 'text-rose-600 bg-rose-50',
                                    },
                                    {
                                        icon: Sparkles,
                                        title: '100% Custom Freedom',
                                        desc: 'Order 1 single personalized gift or 10,000 corporate pieces. Zero setup charges or hidden minimums.',
                                        color: 'text-amber-600 bg-amber-50',
                                    },
                                    {
                                        icon: Truck,
                                        title: '48h Express Dispatch',
                                        desc: 'Quick turnaround with multi-layer tamper-proof packaging to ensure your prints arrive pristine.',
                                        color: 'text-emerald-600 bg-emerald-50',
                                    },
                                    {
                                        icon: ShieldCheck,
                                        title: 'Delight Guarantee',
                                        desc: 'If your print is anything less than flawless, we will reprint and ship it free of charge.',
                                        color: 'text-indigo-600 bg-indigo-50',
                                    },
                                ].map((item, idx) => {
                                    const IconComp = item.icon;
                                    return (
                                        <div
                                            key={idx}
                                            className="rounded-3xl bg-[#faf8f5] p-7 border border-neutral-200/80 shadow-xs transition hover:shadow-lg hover:-translate-y-1"
                                        >
                                            <div
                                                className={`flex size-12 items-center justify-center rounded-2xl ${item.color} mb-5 shadow-xs`}
                                            >
                                                <IconComp className="size-6" />
                                            </div>
                                            <h3 className="font-bold text-neutral-900 text-lg">{item.title}</h3>
                                            <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{item.desc}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* 9. CUSTOMER STORIES & REVIEWS */}
                    <section className="py-20 bg-[#faf8f5]">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="text-center max-w-2xl mx-auto mb-14">
                                <span className="text-xs font-bold uppercase tracking-widest text-rose-600">
                                    Real Community Love
                                </span>
                                <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl text-neutral-950">
                                    Loved by 15,000+ Creators & Brands
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                                {[
                                    {
                                        name: 'Aarav Mehta',
                                        role: 'Interior Designer, Mumbai',
                                        comment:
                                            'The gallery posters turned out absolutely breathtaking. The paper texture and ink depth are superior to anything I ordered online before.',
                                        rating: 5,
                                        product: 'Archival Matte Posters',
                                    },
                                    {
                                        name: 'Pooja Sharma',
                                        role: 'E-commerce Founder, Bengaluru',
                                        comment:
                                            'Ordered 500 gold foil visiting cards and custom branded mugs for our startup team. Quality is premium and dispatch was super quick!',
                                        rating: 5,
                                        product: 'Velvet Gold Foil Cards & Mugs',
                                    },
                                    {
                                        name: 'Rohan Patel',
                                        role: 'Photographer, Ahmedabad',
                                        comment:
                                            'The polaroid photo box was a gift for our anniversary. My wife loved the clarity and the keepsake tin. PRINTWITHDWARKESH is our go-to print shop now!',
                                        rating: 5,
                                        product: 'Retro Polaroid Photo Box',
                                    },
                                ].map((rev, i) => (
                                    <div
                                        key={i}
                                        className="rounded-3xl bg-white p-7 border border-neutral-200/80 shadow-sm flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="flex items-center gap-1 text-amber-500 mb-4">
                                                {[...Array(rev.rating)].map((_, s) => (
                                                    <Star key={s} className="size-4 fill-current" />
                                                ))}
                                            </div>
                                            <p className="text-sm text-neutral-700 leading-relaxed italic">
                                                "{rev.comment}"
                                            </p>
                                        </div>
                                        <div className="mt-6 pt-4 border-t border-neutral-100">
                                            <p className="font-bold text-neutral-900 text-sm">{rev.name}</p>
                                            <p className="text-xs text-neutral-500">{rev.role}</p>
                                            <span className="mt-2 inline-block rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-600">
                                                Ordered: {rev.product}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* 10. FAQ SECTION */}
                    <section id="faq" className="py-20 bg-white border-t border-neutral-200/80 scroll-mt-20">
                        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-12">
                                <span className="text-xs font-bold uppercase tracking-widest text-rose-600">
                                    Got Questions?
                                </span>
                                <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl text-neutral-950">
                                    Frequently Asked Questions
                                </h2>
                            </div>

                            <div className="space-y-4">
                                {[
                                    {
                                        q: 'How do I upload my own photo or artwork for printing?',
                                        a: 'Simply scroll to our "Custom Print Studio" section or click "Create Your Design". Pick your product canvas, click "Upload Photo or Artwork", enter optional text, and see an instant live preview before ordering!',
                                    },
                                    {
                                        q: 'What is the delivery timeline across India?',
                                        a: 'All custom print orders are processed and printed within 24 to 48 hours. Express courier shipping takes 2-4 business days depending on your pincode.',
                                    },
                                    {
                                        q: 'Is there a minimum order quantity?',
                                        a: 'No! You can order just 1 single personalized mug, poster, bottle, or tee. For visiting cards, our minimum pack is 100 premium pieces.',
                                    },
                                    {
                                        q: 'What if my print arrives damaged or with incorrect colors?',
                                        a: 'We offer a 100% Delight Guarantee. If your order arrives damaged or defective in any way, send us a photo and we will reprint and dispatch a replacement immediately at no cost.',
                                    },
                                ].map((faq, idx) => (
                                    <details
                                        key={idx}
                                        className="group rounded-2xl bg-[#faf8f5] p-5 border border-neutral-200/80 transition [&_summary::-webkit-details-marker]:hidden"
                                    >
                                        <summary className="flex cursor-pointer items-center justify-between font-bold text-neutral-900 text-sm sm:text-base">
                                            <span>{faq.q}</span>
                                            <ChevronDown className="size-5 transition duration-300 group-open:-rotate-180 text-neutral-500" />
                                        </summary>
                                        <p className="mt-3 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-200/60 pt-3">
                                            {faq.a}
                                        </p>
                                    </details>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* 11. NEWSLETTER / PROMO BANNER */}
                    <section className="py-16 bg-neutral-900 text-white">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="grid lg:grid-cols-12 gap-8 items-center rounded-3xl bg-gradient-to-r from-rose-900/50 to-neutral-900 p-8 sm:p-12 border border-neutral-800">
                                <div className="lg:col-span-7 space-y-3">
                                    <span className="text-xs font-bold uppercase tracking-widest text-rose-400">
                                        Join The Print Club
                                    </span>
                                    <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                                        Get 10% Off Your First Custom Print
                                    </h3>
                                    <p className="text-sm text-neutral-300 max-w-lg">
                                        Subscribe for secret drops, design tips, and exclusive coupon codes delivered straight
                                        to your inbox.
                                    </p>
                                </div>
                                <div className="lg:col-span-5">
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            showToast('🎉 Thank you for subscribing! Your discount code is: PRINT10');
                                        }}
                                        className="flex flex-col sm:flex-row gap-2"
                                    >
                                        <input
                                            type="email"
                                            required
                                            placeholder="Enter your email address"
                                            className="w-full rounded-full bg-neutral-800 border border-neutral-700 px-5 py-3 text-sm text-white placeholder-neutral-400 focus:border-rose-500 focus:outline-none"
                                        />
                                        <button
                                            type="submit"
                                            className="rounded-full bg-rose-600 px-6 py-3 text-sm font-bold text-white hover:bg-rose-500 transition whitespace-nowrap"
                                        >
                                            Subscribe
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                {/* 12. FOOTER */}
                <footer id="contact" className="bg-neutral-950 text-neutral-300 pt-16 pb-12 border-t border-neutral-800">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-800">
                            {/* Brand Column */}
                            <div className="lg:col-span-2 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex aspect-square size-10 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-md">
                                        <AppLogoIcon className="size-6" />
                                    </div>
                                    <span className="font-extrabold tracking-tight text-white text-xl">
                                        PRINTWITHDWARKESH
                                    </span>
                                </div>
                                <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
                                    India's premier custom printing studio. We turn your digital photos, graphic artwork, and
                                    corporate branding into museum-grade physical products.
                                </p>
                                <div className="flex items-center gap-3 text-neutral-400 pt-2">
                                    <a
                                        href="https://instagram.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Instagram"
                                        className="flex size-9 items-center justify-center rounded-full bg-neutral-900 hover:bg-rose-600 hover:text-white transition"
                                    >
                                        <Instagram className="size-4" />
                                    </a>
                                    <a
                                        href="https://pinterest.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Pinterest"
                                        className="flex size-9 items-center justify-center rounded-full bg-neutral-900 hover:bg-rose-600 hover:text-white transition"
                                    >
                                        <Share2 className="size-4" />
                                    </a>
                                    <a
                                        href="tel:+919876543210"
                                        aria-label="Phone Support"
                                        className="flex size-9 items-center justify-center rounded-full bg-neutral-900 hover:bg-rose-600 hover:text-white transition"
                                    >
                                        <Phone className="size-4" />
                                    </a>
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div>
                                <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">
                                    Quick Links
                                </h4>
                                <ul className="space-y-2.5 text-xs">
                                    <li>
                                        <a href="/" className="hover:text-white transition">
                                            Home
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#shop" className="hover:text-white transition">
                                            Shop All Products
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#custom-design" className="hover:text-white transition">
                                            Custom Print Studio
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#trending" className="hover:text-white transition">
                                            Trending Pins
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#why-us" className="hover:text-white transition">
                                            Why Choose Us
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/* Categories */}
                            <div>
                                <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">
                                    Print Catalog
                                </h4>
                                <ul className="space-y-2.5 text-xs">
                                    <li>
                                        <a href="#shop" className="hover:text-white transition">
                                            Posters & Wall Art
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#shop" className="hover:text-white transition">
                                            Ceramic & Magic Mugs
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#shop" className="hover:text-white transition">
                                            Laser Engraved Bottles
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#shop" className="hover:text-white transition">
                                            Custom Cotton T-Shirts
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#shop" className="hover:text-white transition">
                                            Luxury Visiting Cards
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#shop" className="hover:text-white transition">
                                            HD Photo Polaroids
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/* Contact Info */}
                            <div>
                                <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">
                                    Studio & Support
                                </h4>
                                <div className="space-y-3 text-xs text-neutral-400">
                                    <p className="flex items-start gap-2">
                                        <span className="font-bold text-white">Email:</span>
                                        <span>hello@printwithdwarkesh.com</span>
                                    </p>
                                    <p className="flex items-start gap-2">
                                        <span className="font-bold text-white">WhatsApp:</span>
                                        <span>+91 98765 43210</span>
                                    </p>
                                    <p className="flex items-start gap-2">
                                        <span className="font-bold text-white">Studio:</span>
                                        <span>Printworks Hub, Gujarat, India</span>
                                    </p>
                                    <p className="text-[11px] text-neutral-500 pt-1">
                                        Hours: Mon - Sat: 9:00 AM – 8:00 PM IST
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Copyright */}
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
                            <p>© {new Date().getFullYear()} PRINTWITHDWARKESH. All rights reserved. Designed with pride.</p>
                            <div className="flex items-center gap-4 text-[11px]">
                                <span>100% Secure Checkout</span>
                                <span>•</span>
                                <span>UPI / Cards / NetBanking</span>
                                <span>•</span>
                                <span>India Shipping</span>
                            </div>
                        </div>
                    </div>
                </footer>

                {/* 13. INTERACTIVE SLIDE-OVER CART DRAWER */}
                {cartOpen && (
                    <div className="fixed inset-0 z-50 overflow-hidden">
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
                            onClick={() => setCartOpen(false)}
                        />
                        <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
                                {/* Drawer Header */}
                                <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-200">
                                    <div className="flex items-center gap-2">
                                        <ShoppingBag className="size-5 text-rose-600" />
                                        <h3 className="font-extrabold text-neutral-900 text-lg">Your Bag ({cartCount})</h3>
                                    </div>
                                    <button
                                        onClick={() => setCartOpen(false)}
                                        className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition"
                                    >
                                        <X className="size-5" />
                                    </button>
                                </div>

                                {/* Free Shipping Progress Bar */}
                                <div className="bg-[#faf8f5] px-6 py-3 border-b border-neutral-200/80">
                                    {cartSubtotal >= 799 ? (
                                        <p className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                                            <PackageCheck className="size-4" /> 🎉 You unlocked FREE Express Delivery!
                                        </p>
                                    ) : (
                                        <div>
                                            <p className="text-xs text-neutral-600">
                                                Add <span className="font-bold text-neutral-900">₹{799 - cartSubtotal}</span> more for{' '}
                                                <span className="font-bold text-rose-600">FREE Delivery</span>!
                                            </p>
                                            <div className="mt-2 h-1.5 w-full rounded-full bg-neutral-200 overflow-hidden">
                                                <div
                                                    className="h-full bg-rose-500 rounded-full transition-all duration-300"
                                                    style={{ width: `${Math.min(100, (cartSubtotal / 799) * 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Cart Items List */}
                                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                                    {cartItems.length === 0 ? (
                                        <div className="text-center py-16">
                                            <ShoppingBag className="size-12 mx-auto text-neutral-300" />
                                            <h4 className="mt-3 font-bold text-neutral-800">Your bag is empty</h4>
                                            <p className="text-xs text-neutral-500 mt-1">Explore our prints and customize your favorite.</p>
                                            <button
                                                onClick={() => setCartOpen(false)}
                                                className="mt-4 rounded-full bg-neutral-900 px-5 py-2 text-xs font-bold text-white"
                                            >
                                                Start Shopping
                                            </button>
                                        </div>
                                    ) : (
                                        cartItems.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex gap-4 p-3 rounded-2xl bg-neutral-50 border border-neutral-200/70"
                                            >
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="size-20 rounded-xl object-cover bg-white"
                                                />
                                                <div className="flex-1 flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex items-start justify-between gap-2">
                                                            <h4 className="font-bold text-xs sm:text-sm text-neutral-900 line-clamp-1">
                                                                {item.name}
                                                            </h4>
                                                            <button
                                                                onClick={() => {
                                                                    setCartItems((prev) => prev.filter((i) => i.id !== item.id));
                                                                    showToast('Removed from bag');
                                                                }}
                                                                className="text-neutral-400 hover:text-rose-500 transition"
                                                            >
                                                                <Trash2 className="size-3.5" />
                                                            </button>
                                                        </div>
                                                        {item.customText && (
                                                            <p className="text-[11px] text-rose-600 font-semibold mt-0.5 truncate">
                                                                Custom: "{item.customText}"
                                                            </p>
                                                        )}
                                                        {item.customFinish && (
                                                            <p className="text-[10px] text-neutral-500">{item.customFinish}</p>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center justify-between pt-2">
                                                        <span className="font-extrabold text-xs sm:text-sm text-neutral-900">
                                                            ₹{item.price * item.quantity}
                                                        </span>
                                                        <div className="flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-2 py-0.5">
                                                            <button
                                                                onClick={() => {
                                                                    if (item.quantity > 1) {
                                                                        setCartItems((prev) =>
                                                                            prev.map((i) =>
                                                                                i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
                                                                            )
                                                                        );
                                                                    } else {
                                                                        setCartItems((prev) => prev.filter((i) => i.id !== item.id));
                                                                    }
                                                                }}
                                                                className="text-neutral-600 hover:text-neutral-900"
                                                            >
                                                                <Minus className="size-3" />
                                                            </button>
                                                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                                            <button
                                                                onClick={() => {
                                                                    setCartItems((prev) =>
                                                                        prev.map((i) =>
                                                                            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                                                                        )
                                                                    );
                                                                }}
                                                                className="text-neutral-600 hover:text-neutral-900"
                                                            >
                                                                <Plus className="size-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Drawer Footer with Checkout */}
                                {cartItems.length > 0 && (
                                    <div className="border-t border-neutral-200 p-6 bg-neutral-50 space-y-4">
                                        {/* Coupon Box */}
                                        <form onSubmit={handleApplyCoupon} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value)}
                                                placeholder="Coupon code (Try PRINT10)"
                                                className="flex-1 rounded-xl bg-white border border-neutral-300 px-3 py-2 text-xs uppercase text-neutral-900 focus:outline-none focus:border-rose-500"
                                            />
                                            <button
                                                type="submit"
                                                className="rounded-xl bg-neutral-900 px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800"
                                            >
                                                Apply
                                            </button>
                                        </form>
                                        {couponError && <p className="text-[11px] text-rose-600">{couponError}</p>}
                                        {couponApplied && (
                                            <p className="text-[11px] text-emerald-600 font-bold">
                                                ✓ Code PRINT10 active (-10% off)
                                            </p>
                                        )}

                                        {/* Cost breakdown */}
                                        <div className="space-y-1.5 text-xs text-neutral-600">
                                            <div className="flex justify-between">
                                                <span>Subtotal</span>
                                                <span className="font-semibold text-neutral-900">₹{cartSubtotal}</span>
                                            </div>
                                            {couponApplied && (
                                                <div className="flex justify-between text-emerald-600 font-semibold">
                                                    <span>10% Discount</span>
                                                    <span>-₹{discountAmount}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between">
                                                <span>Shipping</span>
                                                <span className="font-semibold text-neutral-900">
                                                    {shippingFee === 0 ? <span className="text-emerald-600">FREE</span> : `₹${shippingFee}`}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm font-extrabold text-neutral-900 pt-2 border-t border-neutral-200">
                                                <span>Total Amount</span>
                                                <span>₹{cartTotal}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setCheckoutSuccess(true)}
                                            className="w-full rounded-full bg-neutral-900 py-3.5 text-sm font-extrabold text-white hover:bg-rose-600 transition shadow-lg"
                                        >
                                            Proceed to Checkout (₹{cartTotal})
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* 14. INTERACTIVE WISHLIST DRAWER */}
                {wishlistOpen && (
                    <div className="fixed inset-0 z-50 overflow-hidden">
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
                            onClick={() => setWishlistOpen(false)}
                        />
                        <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
                                <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-200">
                                    <div className="flex items-center gap-2">
                                        <Heart className="size-5 text-rose-500 fill-rose-500" />
                                        <h3 className="font-extrabold text-neutral-900 text-lg">
                                            Saved Wishlist ({likedIds.length})
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => setWishlistOpen(false)}
                                        className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 transition"
                                    >
                                        <X className="size-5" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                    {wishlistProducts.length === 0 ? (
                                        <div className="text-center py-16">
                                            <Heart className="size-12 mx-auto text-neutral-300" />
                                            <h4 className="mt-3 font-bold text-neutral-800">No saved inspiration yet</h4>
                                            <p className="text-xs text-neutral-500 mt-1">Tap the heart icon on any print to save it.</p>
                                        </div>
                                    ) : (
                                        wishlistProducts.map((p) => (
                                            <div
                                                key={p.id}
                                                className="flex gap-4 p-3 rounded-2xl bg-neutral-50 border border-neutral-200/70 items-center justify-between"
                                            >
                                                <img src={p.image} alt={p.name} className="size-16 rounded-xl object-cover" />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-xs text-neutral-900 truncate">{p.name}</h4>
                                                    <p className="text-xs font-extrabold text-neutral-900 mt-1">₹{p.price}</p>
                                                </div>
                                                <div className="flex flex-col gap-1.5">
                                                    <button
                                                        onClick={() => {
                                                            addToCart(p);
                                                            toggleLike(p.id);
                                                        }}
                                                        className="rounded-full bg-neutral-900 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-rose-600 transition"
                                                    >
                                                        Move to Bag
                                                    </button>
                                                    <button
                                                        onClick={() => toggleLike(p.id)}
                                                        className="text-[10px] text-neutral-400 hover:text-neutral-700 text-center"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 15. INTERACTIVE SEARCH MODAL */}
                {searchOpen && (
                    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
                            onClick={() => setSearchOpen(false)}
                        />
                        <div className="relative w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl z-10 border border-neutral-200 animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex items-center gap-3 border-b border-neutral-200 pb-4">
                                <Search className="size-5 text-neutral-400" />
                                <input
                                    type="text"
                                    autoFocus
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search posters, mugs, bottles, tees, visiting cards..."
                                    className="w-full text-base font-medium text-neutral-900 focus:outline-none placeholder-neutral-400"
                                />
                                <button
                                    onClick={() => setSearchOpen(false)}
                                    className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100"
                                >
                                    <X className="size-5" />
                                </button>
                            </div>

                            {/* Quick Suggestion Tags */}
                            <div className="mt-4 flex flex-wrap gap-2 text-xs">
                                <span className="font-bold text-neutral-500 py-1">Popular:</span>
                                {['Ceramic Mug', 'Wall Poster', 'Visiting Cards', 'T-Shirts', 'Polaroid Prints'].map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => {
                                            setSearchQuery(tag);
                                        }}
                                        className="rounded-full bg-neutral-100 px-3 py-1 text-neutral-700 hover:bg-rose-50 hover:text-rose-600 transition"
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>

                            {/* Live Results Preview */}
                            <div className="mt-6 max-h-64 overflow-y-auto space-y-2">
                                {filteredProducts.slice(0, 4).map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => {
                                            setSearchOpen(false);
                                            setQuickViewProduct(item);
                                        }}
                                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-50 cursor-pointer transition"
                                    >
                                        <img src={item.image} alt={item.name} className="size-12 rounded-lg object-cover" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-neutral-900 truncate">{item.name}</p>
                                            <p className="text-[11px] text-neutral-500">{item.category}</p>
                                        </div>
                                        <span className="text-xs font-extrabold text-neutral-900">₹{item.price}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* 16. QUICK VIEW / DETAIL MODAL */}
                {quickViewProduct && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
                            onClick={() => setQuickViewProduct(null)}
                        />
                        <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl z-10 border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <button
                                onClick={() => setQuickViewProduct(null)}
                                className="absolute top-4 right-4 rounded-full p-2 text-neutral-400 hover:bg-neutral-100"
                            >
                                <X className="size-5" />
                            </button>

                            <div className="grid sm:grid-cols-2 gap-6 items-center">
                                <div className="aspect-square rounded-2xl overflow-hidden bg-neutral-100">
                                    <img
                                        src={quickViewProduct.image}
                                        alt={quickViewProduct.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                                        {quickViewProduct.category}
                                    </span>
                                    <h3 className="text-xl font-extrabold text-neutral-900 leading-tight">
                                        {quickViewProduct.name}
                                    </h3>
                                    <div className="flex items-center gap-1.5 text-xs text-neutral-600">
                                        <Star className="size-4 fill-amber-400 text-amber-400" />
                                        <span className="font-bold">{quickViewProduct.rating}</span>
                                        <span>({quickViewProduct.reviewsCount} customer reviews)</span>
                                    </div>
                                    <p className="text-xs text-neutral-600 leading-relaxed">
                                        {quickViewProduct.description}
                                    </p>

                                    <div className="flex items-baseline gap-2 pt-2 border-t border-neutral-100">
                                        <span className="text-2xl font-extrabold text-neutral-900">
                                            ₹{quickViewProduct.price}
                                        </span>
                                        <span className="text-sm text-neutral-400 line-through">
                                            ₹{quickViewProduct.originalPrice}
                                        </span>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            onClick={() => {
                                                addToCart(quickViewProduct);
                                                setQuickViewProduct(null);
                                            }}
                                            className="flex-1 rounded-full bg-neutral-900 py-3 text-xs font-bold text-white hover:bg-rose-600 transition shadow-sm"
                                        >
                                            Add to Bag
                                        </button>
                                        <a
                                            href="#custom-design"
                                            onClick={() => setQuickViewProduct(null)}
                                            className="rounded-full border border-neutral-300 px-4 py-3 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition"
                                        >
                                            Customise
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 17. CHECKOUT SUCCESS SIMULATION MODAL */}
                {checkoutSuccess && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
                            onClick={() => setCheckoutSuccess(false)}
                        />
                        <div className="relative w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl z-10 border border-neutral-200">
                            <div className="size-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                                <Check className="size-8" />
                            </div>
                            <h3 className="text-2xl font-extrabold text-neutral-900">Order Placed Successfully!</h3>
                            <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                                Thank you for shopping with <span className="font-bold">PRINTWITHDWARKESH</span>! Your custom
                                prints are being queued for ultra-HD production.
                            </p>
                            <div className="my-4 rounded-2xl bg-[#faf8f5] p-4 text-left text-xs space-y-1 text-neutral-600 border border-neutral-200/80">
                                <p>
                                    <span className="font-bold">Order ID:</span> #DWRK-{Math.floor(100000 + Math.random() * 900000)}
                                </p>
                                <p>
                                    <span className="font-bold">Total Paid:</span> ₹{cartTotal}
                                </p>
                                <p>
                                    <span className="font-bold">Estimated Dispatch:</span> 48 Hours
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setCartItems([]);
                                    setCheckoutSuccess(false);
                                    setCartOpen(false);
                                }}
                                className="w-full rounded-full bg-neutral-900 py-3 text-xs font-bold text-white hover:bg-neutral-800 transition"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                )}

                {/* 18. FLOATING TOAST NOTIFICATION */}
                {toastMessage && (
                    <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-neutral-900 px-5 py-3 text-xs font-bold text-white shadow-2xl border border-neutral-700 animate-in fade-in slide-in-from-bottom-5 duration-300">
                        {toastMessage}
                    </div>
                )}
            </div>
        </>
    );
}

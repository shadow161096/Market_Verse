/**
 * Mock product data for MarketVerse.
 * In production, this would be replaced by API calls to your backend/Shopify/etc.
 * Unsplash images are used for realistic visuals.
 */

import type { Product } from "@/types/product";

export const MOCK_PRODUCTS: Product[] = [
    {
        id: "1",
        slug: "quantum-wireless-headphones",
        name: "Quantum Wireless Headphones",
        description: "Spatial audio meets neural DSP. 40hr battery, ANC 2.0.",
        longDescription:
            "Experience sound like never before. The Quantum Wireless features our proprietary Neural DSP algorithm that adapts to your hearing profile in real-time, combined with spatial audio that places instruments and voices exactly where they should be. 40 hours of battery with Adaptive Noise Cancellation 2.0.",
        price: 349.99,
        compareAtPrice: 449.99,
        images: [
            {
                id: "1a",
                url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
                alt: "Quantum Wireless Headphones",
            },
            {
                id: "1b",
                url: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80",
                alt: "Headphones side view",
            },
        ],
        category: "electronics",
        tags: ["audio", "wireless", "anc", "premium"],
        rating: 4.8,
        reviewCount: 2430,
        inStock: true,
        isFeatured: true,
        isNew: false,
        sku: "QWH-001",
        variants: [
            { id: "v1", name: "Color", value: "Void Black", inStock: true },
            { id: "v2", name: "Color", value: "Arctic White", inStock: true },
            { id: "v3", name: "Color", value: "Neon Violet", inStock: false },
        ],
    },
    {
        id: "2",
        slug: "holo-smartwatch-x9",
        name: "Holo Smartwatch X9",
        description: "Holographic micro-display, health AI, 60-day battery.",
        longDescription:
            "The X9 reimagines the smartwatch with a transparent holographic micro-display that projects vitals directly into your field of view when tilted. Powered by our Health AI chip that detects patterns before symptoms emerge.",
        price: 599.0,
        compareAtPrice: 799.0,
        images: [
            {
                id: "2a",
                url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
                alt: "Holo Smartwatch X9",
            },
        ],
        category: "electronics",
        tags: ["wearable", "smartwatch", "health", "holographic"],
        rating: 4.9,
        reviewCount: 1876,
        inStock: true,
        isFeatured: true,
        isNew: true,
        sku: "HSW-X9",
    },
    {
        id: "3",
        slug: "neon-drift-jacket",
        name: "NeonDrift Jacket",
        description: "Reactive fiber threads change color with movement.",
        longDescription:
            "Woven with electro-reactive fiber technology, the NeonDrift Jacket shifts between 16 million color states based on your movement velocity. Waterproof, breathable, and charged via USB-C sleeve port.",
        price: 289.0,
        images: [
            {
                id: "3a",
                url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
                alt: "NeonDrift Jacket",
            },
        ],
        category: "fashion",
        tags: ["jacket", "reactive", "tech-wear", "waterproof"],
        rating: 4.6,
        reviewCount: 534,
        inStock: true,
        isFeatured: false,
        isNew: true,
        sku: "NDJ-001",
        variants: [
            { id: "v4", name: "Size", value: "S", inStock: true },
            { id: "v5", name: "Size", value: "M", inStock: true },
            { id: "v6", name: "Size", value: "L", inStock: true },
            { id: "v7", name: "Size", value: "XL", inStock: false },
        ],
    },
    {
        id: "4",
        slug: "void-gaming-chair",
        name: "Void Gaming Chair Pro",
        description: "Zero-gravity recline, haptic feedback, lumbar AI.",
        longDescription:
            "Engineered for marathon sessions. Zero-gravity recline at 7 angles, built-in haptic feedback synchronized with game audio, and an AI-powered lumbar support system that adjusts every 12 minutes to prevent fatigue.",
        price: 1299.0,
        compareAtPrice: 1599.0,
        images: [
            {
                id: "4a",
                url: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80",
                alt: "Void Gaming Chair Pro",
            },
        ],
        category: "gaming",
        tags: ["chair", "gaming", "ergonomic", "haptic"],
        rating: 4.7,
        reviewCount: 892,
        inStock: true,
        isFeatured: true,
        isNew: false,
        sku: "VGC-PRO",
    },
    {
        id: "5",
        slug: "neural-desk-lamp",
        name: "Neural Desk Lamp",
        description: "Learns your lighting preferences. Voice + gesture control.",
        longDescription:
            "The Neural Lamp observes your work patterns over 7 days and autonomously adjusts color temperature and brightness throughout the day for peak cognitive performance. Responds to 36 gesture commands.",
        price: 189.0,
        images: [
            {
                id: "5a",
                url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
                alt: "Neural Desk Lamp",
            },
        ],
        category: "home",
        tags: ["lamp", "smart", "ai", "lighting"],
        rating: 4.5,
        reviewCount: 1204,
        inStock: true,
        isFeatured: false,
        isNew: false,
        sku: "NDL-001",
    },
    {
        id: "6",
        slug: "cryogen-skincare-set",
        name: "Cryogen Skincare Set",
        description: "Cryo-infused serums with AI skin analysis.",
        longDescription:
            "A 7-piece routine powered by cryogenic botanical extraction. Pairs with the Cryogen AI app for an 8-week personalized protocol based on your daily skin scan.",
        price: 219.0,
        compareAtPrice: 280.0,
        images: [
            {
                id: "6a",
                url: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80",
                alt: "Cryogen Skincare Set",
            },
        ],
        category: "beauty",
        tags: ["skincare", "cryo", "serum", "ai"],
        rating: 4.4,
        reviewCount: 3102,
        inStock: true,
        isFeatured: false,
        isNew: true,
        sku: "CGS-001",
    },
    {
        id: "7",
        slug: "hyperform-running-shoes",
        name: "HyperForm Running Shoes",
        description: "Carbon-fiber plate, adaptive cushioning, HRV tracking.",
        longDescription:
            "A full-length carbon fiber propulsion plate embedded in reactive foam that adapts stiffness in real-time based on your gait. Integrated HRV sensors stream biometric data to your watch mid-run.",
        price: 279.0,
        images: [
            {
                id: "7a",
                url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
                alt: "HyperForm Running Shoes",
            },
        ],
        category: "sports",
        tags: ["running", "carbon", "shoes", "biometric"],
        rating: 4.8,
        reviewCount: 2761,
        inStock: true,
        isFeatured: true,
        isNew: false,
        sku: "HFR-001",
        variants: [
            { id: "v8", name: "Size", value: "US 8", inStock: true },
            { id: "v9", name: "Size", value: "US 9", inStock: true },
            { id: "v10", name: "Size", value: "US 10", inStock: true },
            { id: "v11", name: "Size", value: "US 11", inStock: true },
            { id: "v12", name: "Size", value: "US 12", inStock: false },
        ],
    },
    {
        id: "8",
        slug: "phantom-mechanical-keyboard",
        name: "Phantom Mechanical Keyboard",
        description: "Per-key RGB, 8000Hz polling, magnetic switches.",
        longDescription:
            "Ultra-low latency 8000Hz polling with our custom magnetic Hall Effect switches rated for 100 million keystrokes. Per-key ARGB with 16 reactive lighting modes. Aluminum CNC chassis dampened with silicone gaskets.",
        price: 229.0,
        compareAtPrice: 269.0,
        images: [
            {
                id: "8a",
                url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
                alt: "Phantom Mechanical Keyboard",
            },
        ],
        category: "gaming",
        tags: ["keyboard", "mechanical", "rgb", "gaming"],
        rating: 4.9,
        reviewCount: 4521,
        inStock: true,
        isFeatured: true,
        isNew: false,
        sku: "PMK-001",
    },
];

export const FEATURED_PRODUCTS = MOCK_PRODUCTS.filter((p) => p.isFeatured);
export const NEW_PRODUCTS = MOCK_PRODUCTS.filter((p) => p.isNew);

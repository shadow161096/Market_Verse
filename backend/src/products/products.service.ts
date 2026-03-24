import { Injectable, Inject, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import type { Cache } from 'cache-manager';
import { DatabaseService } from '../database/database.service';
import { MeiliSearch } from 'meilisearch';

@Injectable()
export class ProductsService implements OnModuleInit {
    private meili: MeiliSearch;

    constructor(
        private db: DatabaseService,
        private configService: ConfigService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {
        this.meili = new MeiliSearch({
            host: this.configService.get<string>('MEILISEARCH_HOST')!,
            apiKey: this.configService.get<string>('MEILISEARCH_API_KEY'),
        });
    }

    async onModuleInit() {
        // Initial sync placeholder — in production, this should be a background job
        // await this.syncToMeili();
    }

    async search(query: string, page = 1, limit = 20) {
        const index = this.meili.index('products');
        const searchResults = await index.search(query, {
            offset: (page - 1) * limit,
            limit: limit,
        });

        return searchResults;
    }

    async syncToMeili() {
        const products = await this.db.product.findMany({
            where: { isActive: true },
            include: { category: true },
        });

        const index = this.meili.index('products');
        await index.updateDocuments(products.map(p => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            description: p.description,
            price: Number(p.price),
            category: p.category.name,
        })));
    }

    async findAll(page = 1, limit = 20) {
        // ...
        const cacheKey = `products_${page}_${limit}`;
        const cached = await this.cacheManager.get(cacheKey);

        if (cached) {
            return cached;
        }

        const skip = (page - 1) * limit;
        const products = await this.db.product.findMany({
            where: { isActive: true },
            skip,
            take: limit,
            include: { category: true },
        });

        // Cache for 5 minutes
        await this.cacheManager.set(cacheKey, products, 300000);

        return products;
    }

    async findOne(slug: string) {
        const cacheKey = `product_${slug}`;
        const cached = await this.cacheManager.get(cacheKey);

        if (cached) {
            return cached;
        }

        const product = await this.db.product.findUnique({
            where: { slug },
            include: { category: true, reviews: true },
        });

        if (!product || !product.isActive) {
            throw new NotFoundException('Product not found');
        }

        await this.cacheManager.set(cacheKey, product, 300000);

        return product;
    }

    async invalidateCache() {
        // Implement cache invalidation using keys
        // await this.cacheManager.del('cacheKey...')
    }
}

import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get()
    async findAll(
        @Query('page') page: number,
        @Query('limit') limit: number
    ) {
        return this.productsService.findAll(page, limit);
    }

    @Get('search')
    async search(@Query('q') query: string, @Query('page') page: number, @Query('limit') limit: number) {
        return this.productsService.search(query, page, limit);
    }

    @Get(':slug')
    async findOne(@Param('slug') slug: string) {
        return this.productsService.findOne(slug);
    }
}

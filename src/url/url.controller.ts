import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CreateUrlDto } from "./dto/create-url.dto";
import { UpdateUrlDto } from "./dto/update-url.dto";
import { UrlService } from "./url.service";


@Controller('shorten')
export class UrlController {
    constructor(private urlService: UrlService) { }

    @Post()
    createShortUrl(@Body() createUrlDto: CreateUrlDto) {
        return this.urlService.createShortUrl(createUrlDto.url);
    }


    @Get(':shortCode')
    retreiveOriginalUrl(@Param('shortCode') shortCode: string) {
        return this.urlService.findByShortCode(shortCode);
    }


    @Put(':shortCode')
    updateShortUrl(@Param('shortCode') shortCode: string, @Body() updateUrlDto: UpdateUrlDto) {
        return this.urlService.updateShortUrl(shortCode, updateUrlDto.url);
    }

    @Delete(':shortCode')
    deleteShortUrl(@Param('shortCode') shortCode: string) {
        return this.urlService.deleteShortUrl(shortCode);
    }

    @Get(':shortCode/stats')
    getShortUrlStats(@Param('shortCode') shortCode: string) {
        return this.urlService.getShortUrlStats(shortCode);
    }
}
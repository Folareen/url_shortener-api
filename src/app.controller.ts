import { Controller, Get, Param, Res } from "@nestjs/common";
import type { Response } from "express";
import { UrlService } from "./url/url.service";

@Controller()
export class AppController {
    constructor(private readonly urlService: UrlService) { }

    @Get(':shortCode')
    async redirectToUrl(@Res() res: Response, @Param('shortCode') shortCode: string) {
        const urlEntry = await this.urlService.findByShortCode(shortCode);
        if (urlEntry) {
            await this.urlService.incrementAccessCount(shortCode);
            return res.redirect(urlEntry.url);
        } else {
            return res.status(404).send('URL not found');
        }
    }
}
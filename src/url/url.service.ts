import { Injectable } from "@nestjs/common";
import { Url } from "./interfaces/url.interface";
import { PrismaService } from "src/prisma/prisma.service";


@Injectable()
export class UrlService {
    private readonly urls: Url[] = []
    constructor(private readonly prisma: PrismaService) { }

    async createShortUrl(originalUrl: string) {
        const result = await this.prisma.$transaction(async (prisma) => {
            const url = await prisma.url.create({
                data: {
                    url: originalUrl,
                    shortCode: '000000'
                },
            });

            let idValue = url.id;
            let shortCode = '';
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            do {
                shortCode = chars[idValue % 62] + shortCode;
                idValue = Math.floor(idValue / 62);
            } while (idValue > 0);
            shortCode = shortCode.padStart(6, '0');

            const updatedUrl = await prisma.url.update({
                where: { id: url.id },
                data: { shortCode: shortCode },
            });
            return updatedUrl;
        });
        return result;
    }

    async findByShortCode(shortCode: string) {
        const url = this.urls.find(url => url.shortCode === shortCode);
        return url
    }

    async updateShortUrl(shortCode: string, url: string) {
        const urlEntry = this.urls.find(url => url.shortCode === shortCode);
        if (urlEntry) {
            urlEntry.url = url;
            urlEntry.updatedAt = new Date().toISOString();
        }

        return urlEntry
    }

    async deleteShortUrl(shortCode: string) {
        const index = this.urls.findIndex(url => url.shortCode === shortCode);
        if (index !== -1) {
            this.urls.splice(index, 1);
        }
        return {
            "message": "Short URL deleted successfully"
        }
    }

    async getShortUrlStats(shortCode: string) {
        return this.urls.find(url => url.shortCode === shortCode);
    }

    async incrementAccessCount(shortCode: string) {
        const url = this.urls.find(url => url.shortCode === shortCode);
        if (url) {
            url.accessCount += 1;
        }
        return url;
    }
}
import { Injectable } from "@nestjs/common";
import { Url } from "./interfaces/url.interface";


@Injectable()
export class UrlService {
    private readonly urls: Url[] = []

    async createShortUrl(originalUrl: string) {

        const shortCode = Math.random().toString(36).substring(2, 8);
        const newUrl: Url = {
            id: Date.now().toString(),
            url: originalUrl,
            shortCode: shortCode,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            accessCount: 0
        }

        console.log('Created short URL:', newUrl);
        this.urls.push(newUrl);

        return newUrl
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
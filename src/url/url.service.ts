import { Injectable, NotFoundException } from "@nestjs/common";
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
        const url = await this.prisma.url.findUnique({ where: { shortCode } });
        if (!url) throw new NotFoundException('Short URL not found');
        return url;
    }

    async updateShortUrl(shortCode: string, url: string) {
        try {
            return await this.prisma.url.update({
                where: { shortCode },
                data: {
                    url,
                    updatedAt: new Date().toISOString(),
                },
            });
        } catch (e) {
            throw new NotFoundException('Short URL not found');
        }
    }

    async deleteShortUrl(shortCode: string) {
        try {
            await this.prisma.url.delete({ where: { shortCode } });
            return { message: "Short URL deleted successfully" };
        } catch (e) {
            throw new NotFoundException('Short URL not found');
        }
    }

    async getShortUrlStats(shortCode: string) {
        const url = await this.prisma.url.findUnique({ where: { shortCode } });
        if (!url) throw new NotFoundException('Short URL not found');
        return url;
    }

    async incrementAccessCount(shortCode: string) {
        try {
            return await this.prisma.url.update({
                where: { shortCode },
                data: { accessCount: { increment: 1 } },
            });
        } catch (e) {
            throw new NotFoundException('Short URL not found');
        }
    }
}
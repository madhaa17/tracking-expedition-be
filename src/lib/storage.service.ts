import { Injectable } from '@nestjs/common';
import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

@Injectable()
export class StorageService {
    private s3: S3Client;
    private bucket = process.env.R2_BUCKET_NAME!;
    private publicUrl = process.env.R2_PUBLIC_URL!;

    constructor() {
        const accessKeyId = process.env.R2_ACCESS_KEY_ID;
        const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
        const accountId = process.env.R2_ACCOUNT_ID;

        if (!accessKeyId || !secretAccessKey || !accountId) {
            throw new Error('Missing required R2 environment variables');
        }

        this.s3 = new S3Client({
            region: 'auto',
            endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });
    }

    private buildPublicUrl(fileKey: string): string {
        const base = this.publicUrl.replace(/\/$/, '');
        const bucketSegment = this.bucket?.trim();

        // If using r2.dev account-level domain without bucket segment, append the bucket
        if (
            /\.r2\.dev$/.test(base) &&
            bucketSegment &&
            !base.endsWith(`/${bucketSegment}`)
        ) {
            return `${base}/${bucketSegment}/${fileKey}`;
        }

        return `${base}/${fileKey}`;
    }

    private sanitizeFilename(originalName: string): string {
        const name = originalName
            .toLowerCase()
            .replace(/[^a-z0-9_.-]+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        return name || 'file';
    }

    async uploadFile(
        file: Express.Multer.File,
        folder = 'uploads',
    ): Promise<string> {
        const safeOriginal = this.sanitizeFilename(file.originalname);
        const fileKey = `${folder}/${randomUUID()}-${safeOriginal}`;
        await this.s3.send(
            new PutObjectCommand({
                Bucket: this.bucket,
                Key: fileKey,
                Body: file.buffer,
                ContentType: file.mimetype,
            }),
        );
        return this.buildPublicUrl(fileKey);
    }

    async deleteFile(fileUrl: string) {
        const base = this.publicUrl.replace(/\/$/, '');
        const prefixes = [
            `${base}/`,
            this.bucket ? `${base}/${this.bucket}/` : undefined,
        ].filter(Boolean) as string[];

        let fileKey = fileUrl;
        for (const prefix of prefixes) {
            if (fileKey.startsWith(prefix)) {
                fileKey = fileKey.slice(prefix.length);
                break;
            }
        }

        await this.s3.send(
            new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: fileKey,
            }),
        );
    }
}

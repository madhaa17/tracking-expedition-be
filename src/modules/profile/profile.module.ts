import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { StorageService } from 'src/lib/storage.service';

@Module({
    controllers: [ProfileController],
    providers: [ProfileService, PrismaService, StorageService],
})
export class ProfileModule {}

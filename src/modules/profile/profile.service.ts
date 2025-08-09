import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ProfileResponse } from './response/profile.response';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { StorageService } from 'src/lib/storage.service';

@Injectable()
export class ProfileService {
    constructor(
        private prismaService: PrismaService,
        private storageService: StorageService,
    ) {}

    async findOne(id: number): Promise<ProfileResponse> {
        const user = await this.prismaService.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
                phoneNumber: true,
            },
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return plainToInstance(ProfileResponse, user);
    }

    async update(
        id: number,
        updateProfileDto: UpdateProfileDto,
        file?: Express.Multer.File | null,
    ): Promise<ProfileResponse> {
        const user = await this.prismaService.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        const updatedData: Partial<UpdateProfileDto> & {
            password?: string;
            avatar?: string | null;
        } = {
            ...(updateProfileDto.name && { name: updateProfileDto.name }),
            ...(updateProfileDto.email && { email: updateProfileDto.email }),
            ...(updateProfileDto.phone_number && {
                phoneNumber: updateProfileDto.phone_number,
            }),
        };

        if (file && user.avatar) {
            await this.storageService.deleteFile(user.avatar);
        }

        if (file) {
            const avatarUrl = await this.storageService.uploadFile(
                file,
                'avatars',
            );
            updatedData.avatar = avatarUrl;
        }

        if (updateProfileDto.password) {
            updatedData.password = await bcrypt.hash(
                updateProfileDto.password,
                12,
            );
        }

        const updatedUser = await this.prismaService.user.update({
            where: { id },
            data: updatedData as any,
            select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
                phoneNumber: true,
            },
        });

        return plainToInstance(ProfileResponse, updatedUser, {
            excludeExtraneousValues: true,
        });
    }
}

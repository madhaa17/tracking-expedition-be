import {
    Controller,
    Get,
    Body,
    Patch,
    UseGuards,
    Req,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/logged-in.guard';
import { ProfileResponse } from './response/profile.response';
import { BaseResponse } from 'src/common/interface/base-response.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @Get()
    async findOne(
        @Req() req: Request & { user?: { id: number } },
    ): Promise<BaseResponse<ProfileResponse>> {
        const profile = await this.profileService.findOne(req?.user?.id!);
        return {
            message: 'Profile retrieved successfully',
            data: profile,
        };
    }

    @Patch()
    @UseInterceptors(FileInterceptor('avatar', { storage: memoryStorage() }))
    async update(
        @Req() req: Request & { user?: { id: number } },
        @Body() updateProfileDto: UpdateProfileDto,
        @UploadedFile() file?: Express.Multer.File,
    ): Promise<BaseResponse<ProfileResponse>> {
        return {
            message: 'Profile updated successfully',
            data: await this.profileService.update(
                req?.user?.id!,
                updateProfileDto,
                file ?? null,
            ),
        };
    }
}

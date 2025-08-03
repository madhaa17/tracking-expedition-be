import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Permission } from '@prisma/client';

@Injectable()
export class PermissionsService {
    constructor(private readonly prismaService: PrismaService) {}

    async findAll(): Promise<Permission[]> {
        const permissions = await this.prismaService.permission.findMany();
        return permissions.map((permission) => ({
            id: permission.id,
            name: permission.name,
            key: permission.key,
            resource: permission.resource,
            createdAt: permission.createdAt,
            updatedAt: permission.updatedAt,
        }));
    }

    async findOne(id: number): Promise<Permission> {
        const permission = await this.prismaService.permission.findUnique({
            where: { id },
        });

        if (!permission) {
            throw new NotFoundException(`Permission with ID ${id} not found`);
        }

        return {
            id: permission.id,
            name: permission.name,
            key: permission.key,
            resource: permission.resource,
            createdAt: permission.createdAt,
            updatedAt: permission.updatedAt,
        };
    }
}

import { Expose, Type } from 'class-transformer';

export class RoleResponse {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    key: string;

    @Expose()
    @Type(() => PermissionsResponse)
    permissions: PermissionsResponse[];
}

export class PermissionsResponse {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    key: string;

    @Expose()
    resource: string;
}

export class UserResponse {
    @Expose()
    id: number;

    @Expose()
    email: string;

    @Expose()
    name: string;

    @Expose()
    avatar: string;

    @Expose()
    phoneNumber: string;

    @Expose()
    @Type(() => RoleResponse)
    role: RoleResponse[];
}

export class AuthResponse {
    @Expose()
    accessToken: string;

    @Expose()
    @Type(() => UserResponse)
    user: UserResponse;
}

import { Expose } from 'class-transformer';
import { RoleResponse } from 'src/modules/auth/response/auth-login-response';

export class ProfileResponse {
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
}

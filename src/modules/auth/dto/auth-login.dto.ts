import { z, ZodObject } from 'zod';

const authLoginSchema = z.object({
    email: z
        .string({
            required_error: 'Email is required',
            invalid_type_error: 'Email must be a string',
        })
        .email({
            message: 'Invalid email format',
        }),
    password: z.string({
        required_error: 'Password is required',
        invalid_type_error: 'Password must be a string',
    }),
});

export class AuthLoginDto {
    static schema: ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
    }> = authLoginSchema;

    constructor(
        public readonly email: string,
        public readonly password: string,
    ) {}
}

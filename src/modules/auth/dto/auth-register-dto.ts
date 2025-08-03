import { z, ZodObject } from 'zod';

const authRegisterSchema = z.object({
    name: z
        .string({
            required_error: 'Name is required',
            invalid_type_error: 'Name must be a string',
        })
        .min(1, {
            message: 'Name is required',
        }),
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
    phone_number: z
        .string({
            required_error: 'Phone number is required',
            invalid_type_error: 'Phone number must be a string',
        })
        .min(10, {
            message: 'Phone number must be at least 10 characters long',
        }),
});

export class AuthRegisterDto {
    static schema: ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
    }> = authRegisterSchema;

    constructor(
        public readonly name: string,
        public readonly email: string,
        public readonly password: string,
        public readonly phone_number: string,
    ) {}
}

import { z } from 'zod';

export const updateProfileSchema = z.object({
    name: z
        .string({
            required_error: 'Name is required',
            invalid_type_error: 'Name must be a string',
        })
        .optional(),
    email: z
        .string({
            required_error: 'Email is required',
            invalid_type_error: 'Email must be a string',
        })
        .email('Invalid email format')
        .optional(),
    password: z
        .string({
            required_error: 'Password is required',
            invalid_type_error: 'Password must be a string',
        })
        .min(6, 'Password must be at least 6 characters long')
        .optional(),

    phone_number: z
        .string({
            required_error: 'Phone number is required',
            invalid_type_error: 'Phone number must be a string',
        })
        .min(10, 'Phone number must be at least 10 characters long')
        .optional(),

    avatar: z
        .string({
            required_error: 'Avatar is required',
            invalid_type_error: 'Avatar must be a string',
        })
        .optional()
        .nullable(),
});

export class UpdateProfileDto {
    static schema: typeof updateProfileSchema = updateProfileSchema;

    constructor(
        public name?: string,
        public email?: string,
        public password?: string,
        public phone_number?: string,
        public avatar?: string | null,
    ) {}
}

import type { z } from 'zod';

export function createValidator<T extends z.ZodType>(schema: T) {
	return (value: unknown): value is z.infer<T> => {
		return schema.safeParse(value).success;
	};
}

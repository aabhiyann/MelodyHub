import { z } from "zod";

export const authCallbackSchema = z.object({
    id: z.string().min(1, "Clerk ID is required"),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    imageUrl: z.string().optional(),
});

export const paginationSchema = z.object({
    page: z.string().optional().transform((val) => val ? parseInt(val) : 1),
    limit: z.string().optional().transform((val) => val ? parseInt(val) : 20),
});

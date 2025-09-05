import { string, z } from "zod";

export const UserZodSchema = z.object({
    username: z.string().min(3).max(10),
    password: z.string().min(8).max(20)
})
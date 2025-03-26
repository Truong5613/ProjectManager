import { describe } from 'node:test';
import {z} from 'zod';

export const emogiSchema = z.string().trim().optional();

export const nameSchema = z.string().min(1).max(255).trim();

export const descriptionSchema = z.string().min(1).max(255).trim().optional();

export const projectIdSchema = z.string().trim().min(1);

export const createProjectSchema = z.object({
    emoji:  emogiSchema,
    name: nameSchema,
    description: descriptionSchema
});


export const updateProjectSchema = z.object({
    emoji:  emogiSchema,
    name: nameSchema,
    description: descriptionSchema
});
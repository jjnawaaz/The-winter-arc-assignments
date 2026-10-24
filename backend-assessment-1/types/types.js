import { z } from "zod";

/**
 * Validate signup data
 *
 * @param username - Username of the new user
 * @param password - Password of the new user with a minimum of 6 characters
 * @returns - Validated username and password
 */
export const SignupSchema = z.object({
  username: z.string(),
  password: z.string().min(6),
});

/**
 * Validate signin data
 *
 * @param username - Username of the existing user
 * @param password - Password of the user with a minimum of 6 characters
 * @returns - Validated username and password
 */
export const SigninSchema = z.object({
  username: z.string(),
  password: z.string().min(6),
});

/**
 * Validate workspace creation data
 *
 * @param name - Name of the workspace
 * @returns - Validated workspace name
 */
export const workspaceSchema = z.object({
  name: z.string(),
});

/**
 * Validate task creation data
 *
 * @param title - Title of the task
 * @param description - Description of the task
 * @param dueDate - Due date in ISO date format that cannot be in the past
 * @returns - Validated task title, description, and due date
 */
export const taskSchema = z.object({
  title: z.string(),
  description: z.string(),
  dueDate: z.iso
    .date()
    .refine((date) => date >= new Date().toISOString().slice(0, 10), {
      message: "Due date cannot be in the past",
    }),
});

/**
 * Validate task completion update data
 *
 * @param completed - Boolean indicating whether the task is completed
 * @returns - Validated task completion status
 */
export const updateTaskSchema = z.object({
  completed: z.boolean(),
});

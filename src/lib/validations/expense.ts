import { z } from "zod";

export const createExpenseSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Amount must be positive"),
  date: z.string().min(1, "Date is required"),
  categoryId: z.string().min(1, "Category is required"),
  description: z.string().max(500).optional(),
  tagIds: z.array(z.string()).optional(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).default("PENDING"),
});

export const updateExpenseSchema = createExpenseSchema.partial();

export const expenseFilterSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  categoryId: z.string().optional(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  search: z.string().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
export type ExpenseFilterInput = z.infer<typeof expenseFilterSchema>;

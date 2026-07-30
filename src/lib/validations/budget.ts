import { z } from "zod";

export const createBudgetSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Amount must be positive"),
  period: z.enum(["WEEKLY", "MONTHLY", "QUARTERLY", "YEARLY", "CUSTOM"]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  categoryId: z.string().optional(),
});

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;

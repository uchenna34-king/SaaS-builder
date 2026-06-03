import type { Expense, Category, Budget, Organization, User, Tag } from "@prisma/client";

export type ExpenseWithRelations = Expense & {
  category: Category;
  createdBy: Pick<User, "id" | "name" | "image">;
  tags: Array<{ tag: Tag }>;
};

export type BudgetWithRelations = Budget & {
  category: Category | null;
};

export type OrganizationWithMembers = Organization & {
  members: Array<{
    user: Pick<User, "id" | "name" | "email" | "image">;
    role: string;
  }>;
};

export type DashboardStats = {
  totalExpenses: number;
  totalExpensesCount: number;
  monthlyExpenses: number;
  prevMonthExpenses: number;
  budgetUtilization: number;
  categoryBreakdown: Array<{
    categoryId: string;
    categoryName: string;
    color: string;
    total: number;
    count: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    total: number;
  }>;
  recentExpenses: ExpenseWithRelations[];
};

export type ApiResponse<T> = {
  data: T;
  message?: string;
};

export type ApiError = {
  error: string;
  details?: unknown;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

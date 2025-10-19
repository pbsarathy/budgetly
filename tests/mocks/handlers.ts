import { http, HttpResponse } from 'msw';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';

// Mock data store
let mockExpenses: any[] = [];
let mockBudgets: any[] = [];
let mockRecurringExpenses: any[] = [];
let mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
};

export const handlers = [
  // Auth endpoints
  http.post(`${SUPABASE_URL}/auth/v1/token`, async () => {
    return HttpResponse.json({
      access_token: 'mock-access-token',
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: 'mock-refresh-token',
      user: mockUser,
    });
  }),

  http.get(`${SUPABASE_URL}/auth/v1/user`, async () => {
    return HttpResponse.json(mockUser);
  }),

  http.post(`${SUPABASE_URL}/auth/v1/logout`, async () => {
    return HttpResponse.json({}, { status: 204 });
  }),

  // Expenses endpoints
  http.get(`${SUPABASE_URL}/rest/v1/expenses`, async ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get('user_id');

    const filteredExpenses = mockExpenses.filter(
      (exp) => exp.user_id === userId
    );

    return HttpResponse.json(filteredExpenses);
  }),

  http.post(`${SUPABASE_URL}/rest/v1/expenses`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    const newExpense = {
      ...body,
      id: `expense-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    mockExpenses.push(newExpense);

    return HttpResponse.json(newExpense, { status: 201 });
  }),

  http.patch(`${SUPABASE_URL}/rest/v1/expenses`, async ({ request }) => {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const body = await request.json() as Record<string, unknown>;

    const index = mockExpenses.findIndex((exp) => exp.id === id);
    if (index !== -1) {
      mockExpenses[index] = { ...mockExpenses[index], ...body };
      return HttpResponse.json(mockExpenses[index]);
    }

    return HttpResponse.json({ error: 'Not found' }, { status: 404 });
  }),

  http.delete(`${SUPABASE_URL}/rest/v1/expenses`, async ({ request }) => {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    const index = mockExpenses.findIndex((exp) => exp.id === id);
    if (index !== -1) {
      mockExpenses.splice(index, 1);
      return HttpResponse.json({}, { status: 204 });
    }

    return HttpResponse.json({ error: 'Not found' }, { status: 404 });
  }),

  // Budgets endpoints
  http.get(`${SUPABASE_URL}/rest/v1/budgets`, async ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get('user_id');

    const filteredBudgets = mockBudgets.filter(
      (budget) => budget.user_id === userId
    );

    return HttpResponse.json(filteredBudgets);
  }),

  http.post(`${SUPABASE_URL}/rest/v1/budgets`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    const newBudget = {
      ...body,
      id: `budget-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    mockBudgets.push(newBudget);

    return HttpResponse.json(newBudget, { status: 201 });
  }),

  http.delete(`${SUPABASE_URL}/rest/v1/budgets`, async ({ request }) => {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    const index = mockBudgets.findIndex((budget) => budget.id === id);
    if (index !== -1) {
      mockBudgets.splice(index, 1);
      return HttpResponse.json({}, { status: 204 });
    }

    return HttpResponse.json({ error: 'Not found' }, { status: 404 });
  }),

  // Recurring expenses endpoints
  http.get(`${SUPABASE_URL}/rest/v1/recurring_expenses`, async ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get('user_id');

    const filteredRecurring = mockRecurringExpenses.filter(
      (rec) => rec.user_id === userId
    );

    return HttpResponse.json(filteredRecurring);
  }),

  http.post(`${SUPABASE_URL}/rest/v1/recurring_expenses`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    const newRecurring = {
      ...body,
      id: `recurring-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    mockRecurringExpenses.push(newRecurring);

    return HttpResponse.json(newRecurring, { status: 201 });
  }),

  http.patch(`${SUPABASE_URL}/rest/v1/recurring_expenses`, async ({ request }) => {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const body = await request.json() as Record<string, unknown>;

    const index = mockRecurringExpenses.findIndex((rec) => rec.id === id);
    if (index !== -1) {
      mockRecurringExpenses[index] = { ...mockRecurringExpenses[index], ...body };
      return HttpResponse.json(mockRecurringExpenses[index]);
    }

    return HttpResponse.json({ error: 'Not found' }, { status: 404 });
  }),

  http.delete(`${SUPABASE_URL}/rest/v1/recurring_expenses`, async ({ request }) => {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    const index = mockRecurringExpenses.findIndex((rec) => rec.id === id);
    if (index !== -1) {
      mockRecurringExpenses.splice(index, 1);
      return HttpResponse.json({}, { status: 204 });
    }

    return HttpResponse.json({ error: 'Not found' }, { status: 404 });
  }),
];

// Helper functions to reset mock data
export const resetMockData = () => {
  mockExpenses = [];
  mockBudgets = [];
  mockRecurringExpenses = [];
};

export const setMockExpenses = (expenses: any[]) => {
  mockExpenses = expenses;
};

export const setMockBudgets = (budgets: any[]) => {
  mockBudgets = budgets;
};

export const setMockRecurringExpenses = (recurring: any[]) => {
  mockRecurringExpenses = recurring;
};

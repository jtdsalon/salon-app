// Billing Action Types
export const GET_PAYMENTS = 'GET_PAYMENTS' as const
export const GET_PAYMENTS_SUCCESS = 'GET_PAYMENTS_SUCCESS' as const
export const GET_PAYMENTS_ERROR = 'GET_PAYMENTS_ERROR' as const

export const GET_PAYMENT_BY_ID = 'GET_PAYMENT_BY_ID' as const
export const GET_PAYMENT_BY_ID_SUCCESS = 'GET_PAYMENT_BY_ID_SUCCESS' as const
export const GET_PAYMENT_BY_ID_ERROR = 'GET_PAYMENT_BY_ID_ERROR' as const

export const CREATE_PAYMENT = 'CREATE_PAYMENT' as const
export const CREATE_PAYMENT_SUCCESS = 'CREATE_PAYMENT_SUCCESS' as const
export const CREATE_PAYMENT_ERROR = 'CREATE_PAYMENT_ERROR' as const

export const PROCESS_PAYMENT = 'PROCESS_PAYMENT' as const
export const PROCESS_PAYMENT_SUCCESS = 'PROCESS_PAYMENT_SUCCESS' as const
export const PROCESS_PAYMENT_ERROR = 'PROCESS_PAYMENT_ERROR' as const

export const CLEAR_PAYMENT_SUCCESS = 'CLEAR_PAYMENT_SUCCESS' as const
export const CLEAR_PAYMENT_ERROR = 'CLEAR_PAYMENT_ERROR' as const

// Payment status enum
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'

// Payment interface
export interface Payment {
  id: string
  booking_id?: string
  order_id?: string
  user_id: string
  amount: number
  method?: string
  status: PaymentStatus
  created_at: string
  updated_at?: string
}

// Invoice interface
export interface Invoice {
  id: string
  booking_id?: string
  order_id?: string
  amount: number
  method: string
  status: PaymentStatus
  created_at: string
}

// Billing Statistics
export interface BillingStats {
  totalRevenue: number
  todaysRevenue: number
  monthlyBills: number
  completedBookings: number
  cancelledBookings: number
  activeStylists: number
  appointmentUsage: number
  appointmentLimit: number
  aiCreditsUsage: number
  aiCreditsLimit: number
}

export interface CreatePaymentPayload {
  booking_id?: string
  order_id?: string
  amount: number
  method?: string
}

export interface ProcessPaymentPayload {
  method: string
  card_number?: string
  expiry?: string
  cvc?: string
  holder_name?: string
}

export interface PaymentPagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface BillingState {
  payments: Payment[]
  invoices: Invoice[]
  currentPayment: Payment | null
  pagination: PaymentPagination | null
  billingStats: BillingStats | null
  loading: boolean
  itemLoading: boolean
  creating: boolean
  processing: boolean
  error: any
  success: boolean
  successMessage: string
}

export const INITIAL_STATE: BillingState = {
  payments: [],
  invoices: [],
  currentPayment: null,
  pagination: null,
  billingStats: null,
  loading: false,
  itemLoading: false,
  creating: false,
  processing: false,
  error: null,
  success: false,
  successMessage: '',
}

// Action types union
export type BillingAction =
  | { type: typeof GET_PAYMENTS; payload: { page?: number; limit?: number; status?: PaymentStatus } }
  | { type: typeof GET_PAYMENTS_SUCCESS; payload: { payments: Payment[]; pagination: PaymentPagination } }
  | { type: typeof GET_PAYMENTS_ERROR; payload: any }
  | { type: typeof GET_PAYMENT_BY_ID; payload: string }
  | { type: typeof GET_PAYMENT_BY_ID_SUCCESS; payload: Payment }
  | { type: typeof GET_PAYMENT_BY_ID_ERROR; payload: any }
  | { type: typeof CREATE_PAYMENT; payload: CreatePaymentPayload }
  | { type: typeof CREATE_PAYMENT_SUCCESS; payload: Payment }
  | { type: typeof CREATE_PAYMENT_ERROR; payload: any }
  | { type: typeof PROCESS_PAYMENT; payload: { paymentId: string; details: ProcessPaymentPayload } }
  | { type: typeof PROCESS_PAYMENT_SUCCESS; payload: Payment }
  | { type: typeof PROCESS_PAYMENT_ERROR; payload: any }
  | { type: typeof CLEAR_PAYMENT_SUCCESS }
  | { type: typeof CLEAR_PAYMENT_ERROR }

import { AxiosResponse } from 'axios'
import networkClient from './networkClient'
import { HTTP_METHOD } from '../../lib/enums/httpData'
import {
  GET_MY_PAYMENTS_URL,
  GET_PAYMENT_BY_ID_URL,
  CREATE_PAYMENT_URL,
  PROCESS_PAYMENT_URL,
} from './endPoints'

export interface PaymentMethod {
  type: string
  last4: string
  expiry: string
  holder?: string
}

export interface Invoice {
  id: string
  booking_id?: string
  order_id?: string
  amount: number
  method?: string
  status: string
  created_at: string
  updated_at?: string
}

export interface PaymentResponse {
  id: string
  booking_id?: string
  order_id?: string
  user_id: string
  amount: number
  method?: string
  status: string
  created_at: string
  updated_at: string
}

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

export interface GetPaymentsParams {
  page?: number
  limit?: number
  status?: string
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

// Get current user's payments/invoices
export function getMyPaymentsApi(
  params: GetPaymentsParams = {}
): Promise<AxiosResponse<{ data: { payments: PaymentResponse[]; total: number } }>> {
  const queryParams = new URLSearchParams()
  if (params.page) queryParams.append('page', params.page.toString())
  if (params.limit) queryParams.append('limit', params.limit.toString())
  if (params.status) queryParams.append('status', params.status)

  const url = queryParams.toString()
    ? `${GET_MY_PAYMENTS_URL}?${queryParams.toString()}`
    : GET_MY_PAYMENTS_URL

  return networkClient().request({
    method: HTTP_METHOD.GET,
    url,
  })
}

// Get payment by ID
export function getPaymentByIdApi(
  paymentId: string
): Promise<AxiosResponse<{ data: PaymentResponse }>> {
  return networkClient().request({
    method: HTTP_METHOD.GET,
    url: GET_PAYMENT_BY_ID_URL.replace('{id}', paymentId),
  })
}

// Create a new payment
export function createPaymentApi(
  paymentData: CreatePaymentPayload
): Promise<AxiosResponse<{ data: PaymentResponse }>> {
  return networkClient().request({
    method: HTTP_METHOD.POST,
    url: CREATE_PAYMENT_URL,
    data: paymentData,
  })
}

// Process payment with card details
export function processPaymentApi(
  paymentId: string,
  paymentDetails: ProcessPaymentPayload
): Promise<AxiosResponse<{ data: PaymentResponse }>> {
  return networkClient().request({
    method: HTTP_METHOD.POST,
    url: PROCESS_PAYMENT_URL.replace('{id}', paymentId),
    data: paymentDetails,
  })
}

// Helper function to format currency (Pakistani Rupees)
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Helper function to transform payment to invoice format
export function transformPaymentToInvoice(payment: PaymentResponse, index: number): Invoice {
  const invoiceId = `INV-${new Date(payment.created_at).getFullYear()}-${String(index + 1).padStart(3, '0')}`
  const date = new Date(payment.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return {
    id: invoiceId,
    booking_id: payment.booking_id,
    order_id: payment.order_id,
    amount: payment.amount,
    method: payment.method || 'Unknown',
    status: payment.status || 'Pending',
    created_at: date,
  }
}

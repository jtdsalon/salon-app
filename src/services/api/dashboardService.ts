import { AxiosResponse } from 'axios';
import networkClient from './networkClient';
import { HTTP_METHOD } from '../../lib/enums/httpData';
import { GET_DASHBOARD_STATS_URL } from './endPoints';

export interface DashboardStats {
  dailyRevenue: number;
  dailyRevenueFormatted: string;
  totalAppointments: number;
  appointmentsToday: number;
  staffCount: number;
  staffActiveFormatted: string;
  retailSales: number;
  retailSalesFormatted: string;
}

export interface ChartDataPoint {
  day: string;
  revenue: number;
  target: number;
}

export interface RecentInvoice {
  id: string;
  date: string;
  amount: string;
  method: string;
}

export interface DashboardStatsResponse {
  stats: DashboardStats;
  chartData: ChartDataPoint[];
  recentInvoices: RecentInvoice[];
}

export function getDashboardStatsApi(
  salonId: string
): Promise<AxiosResponse<{ data: DashboardStatsResponse }>> {
  const url = GET_DASHBOARD_STATS_URL.replace('{salonId}', salonId);
  return networkClient().request({
    method: HTTP_METHOD.GET,
    url,
  });
}

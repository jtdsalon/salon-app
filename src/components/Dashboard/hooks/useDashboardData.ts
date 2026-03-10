import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '@/state/auth';
import { useStaff } from '@/state/staff';
import { getDashboardStatsApi } from '@/services/api/dashboardService';
import { getSalonAppointmentsApi } from '@/services/api/appointmentService';
import type { DashboardStatsResponse } from '@/services/api/dashboardService';

/** Staff ID -> set of hour indices (0-23) when they have a booking today */
export type StaffUtilizationToday = Record<string, number[]>;

export interface UseDashboardDataReturn {
  stats: DashboardStatsResponse['stats'] | null;
  chartData: DashboardStatsResponse['chartData'];
  recentInvoices: DashboardStatsResponse['recentInvoices'];
  staff: Array<{ id: string; name: string; avatar?: string }>;
  staffUtilizationToday: StaffUtilizationToday;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDashboardData(): UseDashboardDataReturn {
  const { user } = useAuthContext();
  const salonId = user?.salonId ?? user?.roles?.[0]?.salonId ?? null;
  const { staffList, handleGetStaff } = useStaff();

  const [stats, setStats] = useState<DashboardStatsResponse['stats'] | null>(null);
  const [chartData, setChartData] = useState<DashboardStatsResponse['chartData']>([]);
  const [recentInvoices, setRecentInvoices] = useState<DashboardStatsResponse['recentInvoices']>([]);
  const [staffUtilizationToday, setStaffUtilizationToday] = useState<StaffUtilizationToday>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    if (!salonId) {
      setStats(null);
      setChartData([]);
      setRecentInvoices([]);
      setStaffUtilizationToday({});
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      handleGetStaff(salonId);
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

      const [response, bookingsResponse] = await Promise.all([
        getDashboardStatsApi(salonId),
        getSalonAppointmentsApi(salonId, todayStr).catch(() => ({ data: { data: [] } })),
      ]);

      const data = response.data?.data;
      if (data) {
        setStats(data.stats);
        setChartData(data.chartData ?? []);
        setRecentInvoices(data.recentInvoices ?? []);
      }

      const bookings = Array.isArray(bookingsResponse?.data?.data) ? bookingsResponse.data.data : [];
      const utilization: StaffUtilizationToday = {};
      bookings.forEach((b: any) => {
        if (!b || (b.status && ['CANCELLED', 'NO_SHOW'].includes(b.status))) return;
        const staffId = b.staff_id ?? '__unassigned__';
        let hour: number;
        if (b.start_time) {
          if (typeof b.start_time === 'string' && b.start_time.includes('T')) {
            hour = new Date(b.start_time).getUTCHours();
          } else if (typeof b.start_time === 'string' && /^\d{1,2}:\d{2}/.test(b.start_time)) {
            hour = parseInt(b.start_time.split(':')[0], 10) || 9;
          } else {
            hour = 9;
          }
        } else {
          hour = 9;
        }
        if (!utilization[staffId]) utilization[staffId] = [];
        if (!utilization[staffId].includes(hour)) utilization[staffId].push(hour);
      });
      setStaffUtilizationToday(utilization);
    } catch (err: any) {
      setError(err?.errorMessage || 'Failed to load dashboard');
      setStats(null);
      setChartData([]);
      setRecentInvoices([]);
      setStaffUtilizationToday({});
    } finally {
      setIsLoading(false);
    }
  }, [salonId, handleGetStaff]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const staff = staffList.map((s) => ({
    id: s.id,
    name: s.name || (s as any).display_name || 'Staff',
    avatar: s.avatar || (s as any).avatar_url,
  }));

  return { stats, chartData, recentInvoices, staff, staffUtilizationToday, isLoading, error, refetch: fetchDashboard };
}

import { Order } from '../../orders/models/order.model';

export interface ChartDataPoint {
    label: string;
    value: number;
}

export interface TopProduct {
    id: number;
    name: string;
    qtySold: number;
    revenue: number;
}

export interface DashboardStats {
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalRevenue: number;
    totalProducts: number;
    totalCustomers: number;
    salesChartData: ChartDataPoint[];
    topProducts: TopProduct[];
    latestOrders: Order[];
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign,
  Package,
  Users,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Tag,
  Truck,
} from "lucide-react";

interface StatItem {
  name: string;
  value: string;
  change: string;
  trend: string;
  color: string;
}

interface RecentOrder {
  id: string;
  customer: string;
  date: string;
  total: string;
  status: string;
  payment: string;
}

interface LowStockItem {
  sku: string;
  name: string;
  variant: string;
  stock: number;
}

interface ChartDay {
  date: string;
  amount: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [lowStock, setLowStock] = useState<LowStockItem[]>([]);
  const [chartData, setChartData] = useState<ChartDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
          setRecentOrders(data.recentOrders);
          setLowStock(data.lowStockList);
          setChartData(data.chartData || []);
        }
      } catch (err) {
        console.error("Failed to load dashboard metrics:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const getStatIcon = (name: string) => {
    if (name.includes("Revenue")) return DollarSign;
    if (name.includes("Orders")) return Package;
    if (name.includes("Customers")) return Users;
    return AlertTriangle;
  };

  // Generate SVG Line Chart coordinates
  const renderSalesChart = () => {
    if (chartData.length === 0) return null;

    const width = 500;
    const height = 180;
    const paddingLeft = 40;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 30;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    const maxAmount = Math.max(...chartData.map((d) => d.amount), 5000);

    const points = chartData.map((d, idx) => {
      const x = paddingLeft + (idx / (chartData.length - 1)) * chartWidth;
      const y = height - paddingBottom - (maxAmount > 0 ? (d.amount / maxAmount) * chartHeight : 0);
      return { x, y, ...d };
    });

    const linePath =
      `M ${points[0].x} ${points[0].y} ` +
      points
        .slice(1)
        .map((p) => `L ${p.x} ${p.y}`)
        .join(" ");

    const areaPath =
      `M ${points[0].x} ${height - paddingBottom} ` +
      points.map((p) => `L ${p.x} ${p.y}`).join(" ") +
      ` L ${points[points.length - 1].x} ${height - paddingBottom} Z`;

    return (
      <div className="bg-white border border-slate-200/60 rounded-2xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Sales Trend (Last 7 Days)
          </h3>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
            Live
          </span>
        </div>
        <div className="relative w-full h-48">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((r, idx) => {
              const y = paddingTop + r * chartHeight;
              return (
                <line
                  key={idx}
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                  strokeDasharray="4"
                />
              );
            })}

            {/* Area under the line */}
            <path d={areaPath} fill="url(#chartGrad)" />

            {/* Line graph */}
            <path d={linePath} fill="none" stroke="#10b981" strokeWidth="2.5" />

            {/* Data Dots */}
            {points.map((p, idx) => (
              <g key={idx} className="group/dot cursor-pointer">
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="4"
                  fill="#ffffff"
                  stroke="#10b981"
                  strokeWidth="2"
                  className="transition-all group-hover/dot:r-6"
                />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="8"
                  fill="#10b981"
                  fillOpacity="0"
                  className="hover:fill-opacity-10 transition-all"
                />
                {/* Tooltip on hover */}
                <title>{`${p.date}: ₹${p.amount}`}</title>
              </g>
            ))}

            {/* X Axis Labels */}
            {points.map((p, idx) => (
              <text
                key={idx}
                x={p.x}
                y={height - 10}
                textAnchor="middle"
                className="text-[9px] font-bold fill-slate-400"
              >
                {p.date}
              </text>
            ))}

            {/* Y Axis Max Label */}
            <text
              x={paddingLeft - 8}
              y={paddingTop + 4}
              textAnchor="end"
              className="text-[9px] font-bold fill-slate-400"
            >
              ₹{Math.round(maxAmount).toLocaleString("en-IN")}
            </text>
            <text
              x={paddingLeft - 8}
              y={height - paddingBottom + 4}
              textAnchor="end"
              className="text-[9px] font-bold fill-slate-400"
            >
              ₹0
            </text>
          </svg>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse p-6">
        <div className="h-8 bg-slate-100 rounded-lg w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-2xl" />
          ))}
        </div>
        <div className="h-64 bg-slate-100 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back, Admin!
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Here is what&apos;s happening with your store details.
          </p>
        </div>
        <div className="bg-white px-4 py-2 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-600 shadow-xs">
          📅 {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = getStatIcon(stat.name);
          return (
            <div
              key={idx}
              className="bg-white border border-slate-200/60 rounded-2xl p-6 flex items-start justify-between shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  {stat.name}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900">{stat.value}</span>
                  {stat.trend === "up" ? (
                    <span className="text-emerald-600 text-xs font-bold flex items-center gap-0.5">
                      <ArrowUpRight size={14} /> {stat.change}
                    </span>
                  ) : stat.trend === "warning" ? (
                    <span className="text-amber-600 text-[10px] font-bold uppercase tracking-wider bg-amber-50 px-1.5 py-0.5 rounded-md">
                      {stat.change}
                    </span>
                  ) : (
                    <span className="text-red-500 text-xs font-bold flex items-center gap-0.5">
                      <ArrowDownRight size={14} /> {stat.change}
                    </span>
                  )}
                </div>
              </div>
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  stat.color === "emerald"
                    ? "bg-emerald-50 text-emerald-600"
                    : stat.color === "blue"
                    ? "bg-blue-50 text-blue-600"
                    : stat.color === "purple"
                    ? "bg-purple-50 text-purple-600"
                    : "bg-amber-50 text-amber-600"
                }`}
              >
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Sales Trend Chart */}
      {renderSalesChart()}

      {/* Quick Actions Panel */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-all hover:scale-[1.02] active:scale-95"
          >
            <Plus size={14} /> Add New Product
          </Link>
          <Link
            href="/admin/promotions"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-all hover:scale-[1.02] active:scale-95"
          >
            <Tag size={14} /> Create Coupon
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-all"
          >
            <Truck size={14} /> View Orders
          </Link>
        </div>
      </div>

      {/* Bottom Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white border border-slate-200/60 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Recent Orders
            </h3>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-500"
            >
              View All Orders
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider pb-3">
                  <th className="pb-3 pr-2">Order ID</th>
                  <th className="pb-3 pr-2">Customer</th>
                  <th className="pb-3 pr-2">Total</th>
                  <th className="pb-3 pr-2">Order Status</th>
                  <th className="pb-3">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 group">
                    <td className="py-4 font-bold text-slate-900 pr-2">{order.id}</td>
                    <td className="py-4 text-slate-600 pr-2">{order.customer}</td>
                    <td className="py-4 font-bold text-slate-900 pr-2">{order.total}</td>
                    <td className="py-4 pr-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          order.status === "DELIVERED"
                            ? "bg-emerald-50 text-emerald-700"
                            : order.status === "PENDING"
                            ? "bg-slate-100 text-slate-600"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 text-slate-600">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          order.payment === "PAID"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {order.payment}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No orders placed yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Low Stock Alerts
          </h3>
          <div className="space-y-4">
            {lowStock.map((item) => (
              <div
                key={item.sku}
                className="flex items-center justify-between p-3 border border-slate-100 bg-slate-50/30 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="space-y-1 pr-2">
                  <p className="text-xs font-bold text-slate-900 line-clamp-1">{item.name}</p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    SKU: {item.sku} • Variant: {item.variant}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-red-50 text-red-600 font-bold text-xs">
                    {item.stock}
                  </span>
                  <p className="text-[9px] text-slate-400 mt-1 font-bold uppercase tracking-wider">
                    Left
                  </p>
                </div>
              </div>
            ))}
            {lowStock.length === 0 && (
              <div className="py-8 text-center text-slate-400 text-xs">
                All inventory levels are optimal.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

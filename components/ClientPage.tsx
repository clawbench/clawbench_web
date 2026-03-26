"use client";

// Force rebuild to resolve chunk loading issues
import Dashboard from '@/components/MainDashboard';
import { BenchmarkData } from '@/lib/data';

export default function ClientPage({ initialData }: { initialData: BenchmarkData[] }) {
  return <Dashboard initialData={initialData} />;
}

import TopBar from '@/components/dashboard/TopBar';
import Sidebar from '@/components/dashboard/Sidebar';
import KpiCards from '@/components/dashboard/KpiCards';
import AlertFeed from '@/components/dashboard/AlertFeed';
import GisMap from '@/components/dashboard/GisMap';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-oi-bg text-oi-on-surface font-body">
      <TopBar />
      <Sidebar />

      <main className="ml-64 mt-16 p-6 h-[calc(100vh-64px)] overflow-y-auto no-scrollbar">
        <KpiCards />

        <div className="grid grid-cols-12 gap-6 h-[680px]">
          <AlertFeed />
          <GisMap />
        </div>
      </main>
    </div>
  );
}

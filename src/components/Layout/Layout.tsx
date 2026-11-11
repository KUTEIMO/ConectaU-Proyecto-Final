import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { SupportModal } from '../Support/SupportModal';
import { useAuthStore } from '../../store/authStore';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const { currentUser, userData } = useAuthStore();

  return (
    <div className="min-h-screen bg-surface">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onOpenSupport={() => setSupportOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>
      <SupportModal
        isOpen={supportOpen}
        onClose={() => setSupportOpen(false)}
        userId={currentUser?.uid}
        userEmail={userData?.email || currentUser?.email || undefined}
        userName={userData?.companyName || userData?.name}
      />
    </div>
  );
}


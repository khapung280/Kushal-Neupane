import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import Dashboard from '@/pages/Dashboard';
import CRM from '@/pages/CRM';
import Projects from '@/pages/Projects';
import HR from '@/pages/HR';
import Tickets from '@/pages/Tickets';
import Chat from '@/pages/Chat';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import { Toaster } from '@/components/ui/sonner';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          {children}
        </main>
      </div>
      <Toaster richColors closeButton />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/crm" element={<CRM />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/hr" element={<HR />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

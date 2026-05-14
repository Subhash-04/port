import Portfolio from '@/pages/Portfolio';
import AdminPanel from '@/pages/AdminPanel';

export default function App() {
  const path = window.location.pathname;
  if (path === '/admin' || path === '/admin/') {
    return <AdminPanel />;
  }
  return <Portfolio />;
}

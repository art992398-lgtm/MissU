import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiHome, FiMessageCircle, FiGrid, FiHeart, FiUser } from 'react-icons/fi';

export default function BottomNav() {
  const { userProfile, incomingRequests, isLocal } = useAuth();
  const location = useLocation();
  const active = location.pathname;

  const hasPartner = isLocal || !!userProfile?.partnerId;
  const pendingCount = isLocal ? 0 : incomingRequests.length;

  const TABS = [
    { to: '/dashboard',    label: 'หน้าหลัก', Icon: FiHome },
    { to: '/chat',         label: 'แชท',      Icon: FiMessageCircle, locked: !hasPartner },
    { to: '/dashboard',    label: 'กิจกรรม',  Icon: FiGrid },
    { to: '/find-partner', label: 'คู่รัก',   Icon: FiHeart, badge: pendingCount },
    { to: '/profile',      label: 'โปรไฟล์',  Icon: FiUser },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(0,0,0,0.06)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        boxShadow: '0 -4px 30px rgba(0,0,0,0.07)',
      }}>
      <div className="flex items-center justify-around px-2 py-1.5">
        {TABS.map(({ to, label, Icon, badge, locked }) => {
          const isActive = active === to || (to === '/dashboard' && active === '/dashboard');
          return (
            <Link
              key={label}
              to={locked ? '/find-partner' : to}
              className="flex flex-col items-center gap-1 flex-1 py-2.5 px-1 rounded-2xl transition-all active:scale-90"
              style={isActive ? {background:'linear-gradient(135deg,#e8637a,#1da0bc)'} : {}}>
              <div className="relative">
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  color={isActive ? 'white' : locked ? '#c8d9e2' : '#5a7a8a'}
                />
                {badge > 0 && (
                  <span
                    className="absolute -top-1.5 -right-2 w-5 h-5 rounded-full text-white flex items-center justify-center font-black"
                    style={{fontSize:'0.58rem', background:'#e8637a', lineHeight:1}}>
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </div>
              <span
                className="font-bold leading-none"
                style={{
                  fontSize: '0.68rem',
                  color: isActive ? 'white' : locked ? '#c8d9e2' : '#5a7a8a',
                }}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

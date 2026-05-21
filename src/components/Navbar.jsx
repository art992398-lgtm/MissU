import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogout() { await logout(); navigate('/'); }

  const active = location.pathname;

  return (
    <nav className="glass-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <span className="text-xl group-hover:animate-heartbeat">💕</span>
          <span className="font-display font-bold text-xl text-gradient">MissU</span>
        </Link>

        {currentUser && (
          <div className="flex items-center gap-1">
            {[{to:'/dashboard',label:'หน้าหลัก'},{to:'/profile',label:'โปรไฟล์'}].map(({to,label})=>(
              <Link key={to} to={to}
                className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all ${active===to?'text-rose-500':'text-slate-400 hover:text-slate-700'}`}
                style={active===to?{background:'#fff1f3'}:{}}>
                {label}
              </Link>
            ))}
            <div className="w-px h-5 mx-2" style={{background:'rgba(244,63,94,.15)'}}/>
            <div className="flex items-center gap-2">
              {userProfile?.photoURL ? (
                <img src={userProfile.photoURL} alt="" className="w-7 h-7 rounded-full object-cover avatar-ring"/>
              ) : (
                <span className="text-xl">{userProfile?.avatarEmoji||'💕'}</span>
              )}
              <span className="text-sm font-semibold text-slate-600 hidden sm:block max-w-[90px] truncate">
                {userProfile?.displayName}
              </span>
              <button onClick={handleLogout} className="btn-ghost text-xs">ออก</button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

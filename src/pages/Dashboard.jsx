import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import {
  FiMail, FiClock, FiCheckSquare, FiCamera,
  FiHelpCircle, FiRefreshCw, FiEdit3, FiAward, FiMessageCircle,
} from 'react-icons/fi';

const ACTIVITIES = [
  { id:'love-letters', Icon:FiMail,        title:'จดหมายรัก',        from:'#e8637a', to:'#f472b6' },
  { id:'countdown',    Icon:FiClock,       title:'นับวัน',            from:'#8b5cf6', to:'#a78bfa' },
  { id:'bucket-list',  Icon:FiCheckSquare, title:'Bucket List',       from:'#f97316', to:'#fbbf24' },
  { id:'memory-wall',  Icon:FiCamera,      title:'ความทรงจำ',         from:'#14b8a6', to:'#1da0bc' },
  { id:'love-quiz',    Icon:FiHelpCircle,  title:'รู้จักกันดีแค่ไหน', from:'#6366f1', to:'#818cf8' },
  { id:'date-wheel',   Icon:FiRefreshCw,   title:'วงล้อเดท',          from:'#ec4899', to:'#e8637a' },
  { id:'daily-note',   Icon:FiEdit3,       title:'โน้ตรายวัน',        from:'#f59e0b', to:'#ef4444' },
  { id:'achievements', Icon:FiAward,       title:'ความสำเร็จ',        from:'#eab308', to:'#f97316' },
];

function StoryCircle({ a, hasPartner }) {
  const { Icon } = a;
  return (
    <Link
      to={hasPartner ? `/activity/${a.id}` : '/find-partner'}
      className="flex flex-col items-center gap-1.5 flex-shrink-0 active:scale-90 transition-transform">
      <div
        className="p-[3px] rounded-full"
        style={{background: hasPartner ? `linear-gradient(135deg,${a.from},${a.to})` : '#e5e7eb'}}>
        <div className="w-[58px] h-[58px] rounded-full bg-white flex items-center justify-center"
          style={{border:'2px solid white'}}>
          <Icon size={22} strokeWidth={1.8} color={hasPartner ? a.from : '#d1d5db'}/>
        </div>
      </div>
      <span
        className="text-center leading-tight font-semibold"
        style={{fontSize:'0.62rem', color: hasPartner ? '#374151' : '#9ca3af', width:68, display:'block'}}>
        {a.title}
      </span>
    </Link>
  );
}

function AvatarBubble({ profile, label, ringFrom, ringTo }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="p-[3px] rounded-full"
        style={{background:`linear-gradient(135deg,${ringFrom},${ringTo})`}}>
        {profile?.photoURL ? (
          <img src={profile.photoURL} alt=""
            className="w-16 h-16 rounded-full object-cover block"
            style={{border:'2.5px solid white'}}/>
        ) : (
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
            style={{background:'#fff', border:'2.5px solid white'}}>
            {profile?.avatarEmoji || '💕'}
          </div>
        )}
      </div>
      <span className="font-semibold text-gray-600 text-xs truncate" style={{maxWidth:72, textAlign:'center'}}>
        {profile?.displayName || label}
      </span>
    </div>
  );
}

export default function Dashboard() {
  const { userProfile, partnerProfile, isLocal } = useAuth();
  const days = userProfile?.relationshipStart
    ? Math.floor((Date.now() - new Date(userProfile.relationshipStart)) / 86400000) : null;
  const hasPartner = isLocal || !!userProfile?.partnerId;

  return (
    <div className="min-h-screen" style={{background:'#fafafa'}}>
      <Navbar/>

      {/* Mobile-only sticky top bar */}
      <div
        className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-12"
        style={{
          background:'rgba(255,255,255,0.97)',
          backdropFilter:'blur(16px)',
          WebkitBackdropFilter:'blur(16px)',
          borderBottom:'1px solid #f0f0f0',
        }}>
        <span className="font-display font-bold text-xl text-gradient">MissU</span>
        <Link
          to="/chat"
          className="w-9 h-9 flex items-center justify-center rounded-full"
          style={{background:'#fff0f3'}}>
          <FiMessageCircle size={20} color="#e8637a" strokeWidth={2}/>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-5 pt-5 pb-32 md:pb-12">

        {/* ── Couple header ── */}
        {(hasPartner && (partnerProfile || isLocal)) ? (
          <div className="flex items-center justify-between bg-white rounded-3xl p-5 mb-5"
            style={{boxShadow:'0 2px 16px rgba(0,0,0,0.05)', border:'1px solid #f5f5f5'}}>
            <AvatarBubble
              profile={userProfile}
              label="ฉัน"
              ringFrom="#e8637a"
              ringTo="#f472b6"
            />
            <div className="flex flex-col items-center flex-1">
              <div className="font-black leading-none text-gradient"
                style={{fontSize:'clamp(2.5rem,8vw,3.5rem)', fontFamily:"'Nunito',sans-serif"}}>
                {days !== null && days >= 0 ? days : '—'}
              </div>
              <div className="text-xs font-bold text-gray-400 mt-1">วันที่อยู่ด้วยกัน</div>
              <div className="animate-heartbeat text-base mt-1.5">💕</div>
            </div>
            <AvatarBubble
              profile={partnerProfile}
              label="คู่รัก"
              ringFrom="#1da0bc"
              ringTo="#6366f1"
            />
          </div>
        ) : !isLocal ? (
          <Link
            to="/find-partner"
            className="flex items-center gap-3 bg-white p-4 rounded-2xl mb-5 transition-all active:scale-[0.99]"
            style={{border:'1.5px dashed rgba(232,99,122,.3)', boxShadow:'0 2px 12px rgba(232,99,122,.05)'}}>
            <div className="text-3xl">💕</div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-700 text-sm">เชื่อมต่อกับคู่รักของคุณ</p>
              <p className="text-gray-400 text-xs mt-0.5">ทำกิจกรรมร่วมกันได้เลย</p>
            </div>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full text-white flex-shrink-0"
              style={{background:'linear-gradient(135deg,#e8637a,#1da0bc)'}}>
              เชื่อมต่อ
            </span>
          </Link>
        ) : null}

        {/* ── Story highlight circles ── */}
        <div className="bg-white rounded-3xl p-4 mb-5"
          style={{boxShadow:'0 2px 16px rgba(0,0,0,0.05)', border:'1px solid #f5f5f5'}}>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-1">กิจกรรมของเรา</p>
          <div className="flex gap-5 overflow-x-auto pb-1 hide-scrollbar">
            {ACTIVITIES.map(a => (
              <StoryCircle key={a.id} a={a} hasPartner={hasPartner}/>
            ))}
          </div>
        </div>

        {/* ── Activity grid (desktop 4-col, mobile 2-col) ── */}
        <div className="hidden md:grid grid-cols-4 gap-3">
          {ACTIVITIES.map(a => {
            const { Icon } = a;
            return (
              <Link
                key={a.id}
                to={hasPartner ? `/activity/${a.id}` : '/find-partner'}
                className="bg-white rounded-2xl p-4 flex flex-col items-center gap-3 transition-all hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]"
                style={{border:'1px solid #f0f0f0'}}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{background:`linear-gradient(135deg,${a.from},${a.to})`, boxShadow:`0 4px 12px ${a.from}40`}}>
                  <Icon size={22} strokeWidth={1.8} color="white"/>
                </div>
                <span className="font-bold text-gray-700 text-sm text-center leading-tight">{a.title}</span>
              </Link>
            );
          })}
        </div>

        <p className="text-center mt-8 font-display italic text-xs" style={{color:'#d1b3c0'}}>
          Made with 💕 for you two
        </p>
      </div>
    </div>
  );
}

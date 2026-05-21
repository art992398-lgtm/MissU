import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

const ACTIVITIES = [
  { id:'love-letters', emoji:'💌', title:'จดหมายรัก',       desc:'เขียนความรู้สึกให้กัน',     from:'#f43f5e', to:'#ec4899', glow:'rgba(244,63,94,.2)' },
  { id:'countdown',    emoji:'⏰', title:'นับวัน',           desc:'นับวันพิเศษของเรา',           from:'#7c3aed', to:'#a855f7', glow:'rgba(124,58,237,.2)' },
  { id:'bucket-list',  emoji:'🎯', title:'Bucket List',      desc:'สิ่งที่อยากทำด้วยกัน',       from:'#f97316', to:'#f59e0b', glow:'rgba(249,115,22,.2)' },
  { id:'memory-wall',  emoji:'📸', title:'ความทรงจำ',        desc:'เก็บทุกช่วงเวลาดีๆ',          from:'#14b8a6', to:'#06b6d4', glow:'rgba(20,184,166,.2)' },
  { id:'love-quiz',    emoji:'❓', title:'รู้จักกันดีแค่ไหน', desc:'ทดสอบความเข้าใจกัน',        from:'#6366f1', to:'#8b5cf6', glow:'rgba(99,102,241,.2)' },
  { id:'date-wheel',   emoji:'🎲', title:'วงล้อเดท',          desc:'สปินหาไอเดียเดท',            from:'#ec4899', to:'#f43f5e', glow:'rgba(236,72,153,.2)' },
  { id:'daily-note',   emoji:'💝', title:'โน้ตรายวัน',        desc:'บอกความรู้สึกทุกวัน',         from:'#f59e0b', to:'#f97316', glow:'rgba(245,158,11,.2)' },
  { id:'achievements', emoji:'🏆', title:'ความสำเร็จ',        desc:'ปลดล็อกความทรงจำ',            from:'#eab308', to:'#f59e0b', glow:'rgba(234,179,8,.2)' },
];

const QUOTES = [
  'ทุกวันที่มีคุณ คือวันที่ดีที่สุด',
  'รักคุณมากกว่าที่คำพูดจะอธิบายได้',
  'ขอบคุณที่อยู่เคียงข้างกันเสมอ',
  'คุณคือเหตุผลที่ฉันยิ้มทุกวัน',
  'ทุกนาทีกับคุณ มีค่ายิ่งกว่าสิ่งใด',
];

export default function Dashboard() {
  const { userProfile } = useAuth();
  const days = userProfile?.relationshipStart
    ? Math.floor((Date.now() - new Date(userProfile.relationshipStart)) / 86400000) : null;
  const quote = QUOTES[new Date().getDay() % QUOTES.length];

  return (
    <div className="min-h-screen" style={{background:'#f8f5f7'}}>
      <Navbar/>

      {/* Hero */}
      <div className="page-hero">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {userProfile?.photoURL ? (
                  <img src={userProfile.photoURL} alt="" className="w-11 h-11 rounded-full object-cover border-2 border-white/30"/>
                ) : (
                  <span className="text-3xl">{userProfile?.avatarEmoji||'💕'}</span>
                )}
                <div>
                  <p className="text-white/50 text-xs font-bold uppercase tracking-widest">ยินดีต้อนรับ</p>
                  <h1 className="font-display font-bold text-white" style={{fontSize:'1.75rem',lineHeight:1.1}}>
                    {userProfile?.displayName||'ที่รัก'}
                  </h1>
                </div>
              </div>
              <p className="font-display italic text-white/60 text-base">"{quote}"</p>
            </div>
            {days !== null && days >= 0 && (
              <div className="glass rounded-2xl px-6 py-3 text-center min-w-[110px] flex-shrink-0">
                <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-0.5">อยู่ด้วยกัน</p>
                <p className="font-display font-bold text-white leading-none" style={{fontSize:'2.75rem'}}>{days}</p>
                <p className="text-white/50 text-xs font-semibold mt-0.5">วัน</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-5xl mx-auto px-4 -mt-5 pb-10">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {ACTIVITIES.map(a => (
            <Link key={a.id} to={`/activity/${a.id}`}
              className="card card-hover group block overflow-hidden">
              {/* Color top bar */}
              <div className="h-1" style={{background:`linear-gradient(90deg,${a.from},${a.to})`}}/>
              <div className="p-5 text-center">
                <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center text-3xl transition-transform group-hover:scale-110"
                  style={{background:`linear-gradient(135deg,${a.from}15,${a.to}25)`}}>
                  {a.emoji}
                </div>
                <h3 className="font-bold text-slate-800 text-sm mb-1 leading-tight">{a.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{a.desc}</p>
              </div>
            </Link>
          ))}
        </div>
        <p className="text-center text-slate-300 text-xs mt-6 font-display italic">
          Made with 💕 for you two
        </p>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

const ACTIVITIES = [
  { id:'love-letters', emoji:'💌', title:'จดหมายรัก',       desc:'เขียนความรู้สึกให้กัน',   grad:'from-rose-400 to-pink-500',    glow:'rgba(244,63,94,0.25)' },
  { id:'countdown',    emoji:'⏰', title:'นับวัน',           desc:'นับวันพิเศษของเรา',        grad:'from-violet-400 to-purple-500', glow:'rgba(168,85,247,0.25)' },
  { id:'bucket-list',  emoji:'🎯', title:'Bucket List',      desc:'สิ่งที่อยากทำด้วยกัน',    grad:'from-orange-400 to-amber-500',  glow:'rgba(251,146,60,0.25)' },
  { id:'memory-wall',  emoji:'📸', title:'กำแพงความทรงจำ',  desc:'เก็บทุกช่วงเวลาดีๆ',      grad:'from-teal-400 to-cyan-500',     glow:'rgba(20,184,166,0.25)' },
  { id:'love-quiz',    emoji:'❓', title:'รู้จักกันดีแค่ไหน', desc:'ทดสอบความเข้าใจกัน',     grad:'from-blue-400 to-indigo-500',   glow:'rgba(99,102,241,0.25)' },
  { id:'date-wheel',   emoji:'🎲', title:'วงล้อเดท',         desc:'สปินหาไอเดียเดทสุดพิเศษ', grad:'from-pink-400 to-rose-500',     glow:'rgba(236,72,153,0.25)' },
  { id:'daily-note',   emoji:'💝', title:'โน้ตรายวัน',       desc:'บอกความรู้สึกทุกวัน',      grad:'from-yellow-400 to-orange-500', glow:'rgba(245,158,11,0.25)' },
  { id:'achievements', emoji:'🏆', title:'ความสำเร็จ',       desc:'ปลดล็อกความทรงจำร่วมกัน', grad:'from-amber-400 to-yellow-500',  glow:'rgba(251,191,36,0.25)' },
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
    ? Math.floor((new Date() - new Date(userProfile.relationshipStart)) / 86400000)
    : null;
  const quote = QUOTES[new Date().getDay() % QUOTES.length];

  return (
    <div className="min-h-screen" style={{ background:'linear-gradient(160deg,#fff1f3 0%,#fce7f3 40%,#f3e8ff 100%)' }}>
      <Navbar />

      {/* Hero banner */}
      <div className="page-hero text-white relative">
        {/* Deco dots */}
        {['top-3 right-6','bottom-4 left-8','top-8 left-1/2'].map((pos,i) => (
          <div key={i} className={`absolute ${pos} text-white/10 text-5xl pointer-events-none animate-float${i>0?i:''}`}>
            {['✦','◆','✦'][i]}
          </div>
        ))}

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-white/60 text-sm font-semibold uppercase tracking-widest mb-1">ยินดีต้อนรับ</p>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-2">
                {userProfile?.avatarEmoji} {userProfile?.displayName || 'ที่รัก'}
              </h1>
              <p className="text-pink-200 italic font-display text-lg">"{quote}"</p>
            </div>
            {days !== null && days >= 0 && (
              <div className="glass rounded-2xl px-6 py-4 text-center min-w-[100px]">
                <p className="text-white/60 text-xs uppercase tracking-wider mb-0.5">อยู่ด้วยกัน</p>
                <p className="font-display font-bold text-5xl text-white leading-none">{days}</p>
                <p className="text-white/60 text-xs mt-0.5">วัน</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cards area */}
      <div className="max-w-5xl mx-auto px-4 -mt-6 pb-10">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {ACTIVITIES.map((a, i) => (
            <Link key={a.id} to={`/activity/${a.id}`}
              className="block group rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2"
              style={{ boxShadow:`0 6px 28px ${a.glow}, 0 2px 8px rgba(0,0,0,0.06)` }}
              >
              {/* Gradient top strip */}
              <div className={`h-1.5 bg-gradient-to-r ${a.grad}`} />
              <div className="bg-white p-5 text-center">
                <div className={`text-4xl mb-3 transition-transform duration-300 group-hover:scale-125 inline-block`}>
                  {a.emoji}
                </div>
                <h3 className="font-bold text-gray-800 text-sm mb-1 leading-tight">{a.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{a.desc}</p>
                <div className={`mt-3 h-0.5 bg-gradient-to-r ${a.grad} rounded-full opacity-0 group-hover:opacity-100 transition-opacity`} />
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom decoration */}
        <p className="text-center text-gray-300 text-sm mt-8 font-display italic">
          Made with 💕 for you two
        </p>
      </div>
    </div>
  );
}

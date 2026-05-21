import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';

const ACHIEVEMENTS = [
  { id: 'first_day', emoji: '🌟', title: 'จุดเริ่มต้น', desc: 'วันแรกของความรัก', check: (d) => !!d.relationshipStart },
  { id: '7days', emoji: '🌈', title: '1 สัปดาห์แล้ว', desc: 'อยู่ด้วยกันมา 7 วัน', check: (d) => d.days >= 7 },
  { id: '30days', emoji: '🌸', title: '1 เดือนแล้ว', desc: 'อยู่ด้วยกันมา 30 วัน', check: (d) => d.days >= 30 },
  { id: '100days', emoji: '💯', title: '100 วัน!', desc: 'ผ่านมาแล้ว 100 วัน', check: (d) => d.days >= 100 },
  { id: '365days', emoji: '🎂', title: '1 ปีแล้ว!', desc: 'ครบรอบ 1 ปีแห่งความรัก', check: (d) => d.days >= 365 },
  { id: 'profile', emoji: '✨', title: 'ตกแต่งโปรไฟล์', desc: 'เพิ่ม bio ในโปรไฟล์', check: (d) => !!d.bio },
  { id: 'first_letter', emoji: '💌', title: 'จดหมายฉบับแรก', desc: 'เขียนจดหมายรักครั้งแรก', check: (d) => d.letterCount > 0 },
  { id: 'letters_5', emoji: '📮', title: 'นักเขียนตัวยง', desc: 'เขียนจดหมายครบ 5 ฉบับ', check: (d) => d.letterCount >= 5 },
  { id: 'first_memory', emoji: '📸', title: 'ความทรงจำแรก', desc: 'บันทึกความทรงจำชิ้นแรก', check: (d) => d.memoryCount > 0 },
  { id: 'memories_5', emoji: '🗃️', title: 'คลังความทรงจำ', desc: 'บันทึกความทรงจำครบ 5 ชิ้น', check: (d) => d.memoryCount >= 5 },
  { id: 'bucket_item', emoji: '🎯', title: 'ฝันแรก', desc: 'เพิ่ม Bucket List ข้อแรก', check: (d) => d.bucketCount > 0 },
  { id: 'bucket_done', emoji: '🏆', title: 'ทำสำเร็จแล้ว!', desc: 'ทำสิ่งใน Bucket List สำเร็จ 1 ข้อ', check: (d) => d.bucketDone > 0 },
  { id: 'first_note', emoji: '💝', title: 'ความรู้สึกวันนี้', desc: 'บันทึกอารมณ์วันแรก', check: (d) => d.noteCount > 0 },
  { id: 'notes_7', emoji: '📔', title: 'ไดอารี่คู่รัก', desc: 'บันทึกอารมณ์ครบ 7 วัน', check: (d) => d.noteCount >= 7 },
  { id: 'date_spun', emoji: '🎲', title: 'นักเดทสายลุย', desc: 'สปินวงล้อเดทครั้งแรก', check: (d) => d.dateSpun > 0 },
  { id: 'quiz_done', emoji: '🧠', title: 'รู้จักกันดี', desc: 'เล่นควิซรู้จักกัน', check: (d) => d.quizDone > 0 },
];

function getStats(uid, isLocal) {
  const prefix = isLocal ? '' : `_${uid}`;
  const letters = JSON.parse(localStorage.getItem('missu_letters') || '[]');
  const memories = JSON.parse(localStorage.getItem(`missu_memories${prefix}`) || '[]');
  const bucket = JSON.parse(localStorage.getItem(`missu_bucketlist${prefix}`) || '[]');
  const notes = JSON.parse(localStorage.getItem(`missu_dailynotes${prefix}`) || '[]');
  const dateSpun = parseInt(localStorage.getItem('missu_date_spun') || '0');
  const quizDone = parseInt(localStorage.getItem('missu_quiz_done') || '0');
  return {
    letterCount: letters.length,
    memoryCount: memories.length,
    bucketCount: bucket.length,
    bucketDone: bucket.filter(b => b.done).length,
    noteCount: notes.length,
    dateSpun,
    quizDone,
  };
}

export default function Achievements() {
  const { currentUser, userProfile, isLocal } = useAuth();
  const stats = getStats(currentUser?.uid, isLocal);
  const days = userProfile?.relationshipStart
    ? Math.floor((new Date() - new Date(userProfile.relationshipStart)) / (1000 * 60 * 60 * 24))
    : 0;
  const data = { ...stats, days, relationshipStart: userProfile?.relationshipStart, bio: userProfile?.bio };
  const unlocked = ACHIEVEMENTS.filter(a => a.check(data));
  const locked = ACHIEVEMENTS.filter(a => !a.check(data));

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      <Navbar />
      <div className="max-w-2xl mx-auto p-4 pt-6">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/dashboard" className="text-rose-400 hover:text-rose-500 text-sm">← กลับ</Link>
          <h1 className="text-2xl font-bold text-gray-700">🏆 ความสำเร็จคู่รัก</h1>
        </div>
        <div className="bg-white rounded-3xl shadow p-4 text-center mb-6">
          <div className="text-4xl font-bold text-amber-500">{unlocked.length} / {ACHIEVEMENTS.length}</div>
          <p className="text-gray-500 text-sm">ปลดล็อคแล้ว</p>
          <div className="h-2 bg-amber-100 rounded-full mt-3">
            <div className="h-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all" style={{ width: `${(unlocked.length / ACHIEVEMENTS.length) * 100}%` }} />
          </div>
        </div>
        {unlocked.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-gray-600 mb-3 px-1">ปลดล็อคแล้ว 🎉</h3>
            <div className="grid grid-cols-2 gap-3">
              {unlocked.map(a => (
                <div key={a.id} className="bg-gradient-to-br from-amber-100 to-yellow-100 border border-amber-200 rounded-2xl p-4 text-center shadow">
                  <div className="text-3xl mb-1">{a.emoji}</div>
                  <p className="font-bold text-gray-700 text-sm">{a.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{a.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {locked.length > 0 && (
          <div>
            <h3 className="font-bold text-gray-400 mb-3 px-1">ยังไม่ได้ปลดล็อค</h3>
            <div className="grid grid-cols-2 gap-3">
              {locked.map(a => (
                <div key={a.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center opacity-50">
                  <div className="text-3xl mb-1 grayscale">{a.emoji}</div>
                  <p className="font-bold text-gray-500 text-sm">{a.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{a.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

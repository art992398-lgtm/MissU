import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const EMOJIS = ['💕','🌹','🦋','🌸','💖','🍓','🌺','🐱','🐰','🌙','🎀','🍭','🌈','✨','🦄','🍒','🎸','🎹','🌊','🌿'];

export default function Profile() {
  const { currentUser, userProfile, updateUserProfile, updateLocalProfile, isLocal } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ displayName:'', bio:'', avatarEmoji:'💕', relationshipStart:'' });
  const [saved, setSaved] = useState(false);

  const days = userProfile?.relationshipStart
    ? Math.floor((new Date() - new Date(userProfile.relationshipStart)) / 86400000)
    : null;

  function startEdit() {
    setForm({
      displayName: userProfile?.displayName||'',
      bio: userProfile?.bio||'',
      avatarEmoji: userProfile?.avatarEmoji||'💕',
      relationshipStart: userProfile?.relationshipStart||'',
    });
    setEditing(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (isLocal) updateLocalProfile(form);
    else await updateUserProfile(currentUser.uid, form);
    setSaved(true); setEditing(false);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="min-h-screen" style={{ background:'linear-gradient(160deg,#fff1f3 0%,#fce7f3 40%,#f3e8ff 100%)' }}>
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-8">

        {/* Avatar hero card */}
        <div className="rounded-3xl overflow-hidden shadow-xl mb-5"
          style={{ boxShadow:'0 12px 48px rgba(244,63,94,0.18)' }}>
          <div className="page-hero text-center pb-16 pt-10">
            <div className="text-8xl mb-3 animate-pulse-soft">{userProfile?.avatarEmoji||'💕'}</div>
            <h2 className="font-display text-3xl font-bold text-white">{userProfile?.displayName}</h2>
            <p className="text-pink-200 text-sm mt-1">{userProfile?.email||'Local Account'}</p>
          </div>
          <div className="bg-white -mt-6 rounded-t-3xl px-6 pt-6 pb-5">
            {userProfile?.bio && (
              <p className="text-center text-gray-500 font-display italic text-lg mb-4">"{userProfile.bio}"</p>
            )}
            {days !== null && days >= 0 && (
              <div className="flex justify-center gap-6 mb-4">
                <div className="text-center px-6 py-3 rounded-2xl"
                  style={{ background:'linear-gradient(135deg,#fff1f3,#fce7f3)' }}>
                  <p className="text-3xl font-display font-bold text-gradient">{days}</p>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">วันด้วยกัน</p>
                </div>
                {userProfile?.relationshipStart && (
                  <div className="text-center px-6 py-3 rounded-2xl"
                    style={{ background:'linear-gradient(135deg,#f3e8ff,#ede9fe)' }}>
                    <p className="text-base font-bold text-purple-500 mt-1">
                      {new Date(userProfile.relationshipStart).toLocaleDateString('th-TH',{day:'2-digit',month:'short',year:'2-digit'})}
                    </p>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">วันแรก</p>
                  </div>
                )}
              </div>
            )}
            {isLocal && (
              <div className="mb-3 py-2 px-4 rounded-xl text-xs text-center"
                style={{ background:'#fefce8', border:'1px solid #fde68a', color:'#92400e' }}>
                โหมด Local — บันทึกเฉพาะในเบราว์เซอร์นี้
              </div>
            )}
            {saved && (
              <div className="mb-3 py-2 px-4 rounded-xl text-xs text-center"
                style={{ background:'#f0fdf4', border:'1px solid #86efac', color:'#166534' }}>
                ✓ บันทึกเรียบร้อยแล้ว
              </div>
            )}
            {!editing ? (
              <button onClick={startEdit} className="btn-love w-full py-3">แก้ไขโปรไฟล์</button>
            ) : (
              <form onSubmit={handleSave} className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 block">เลือก Emoji</label>
                  <div className="flex flex-wrap gap-2">
                    {EMOJIS.map(e => (
                      <button key={e} type="button" onClick={() => setForm(f=>({...f,avatarEmoji:e}))}
                        className={`text-2xl p-1.5 rounded-xl transition-all ${form.avatarEmoji===e?'bg-rose-100 scale-110 shadow-md':'hover:bg-pink-50'}`}>
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5 block">ชื่อเล่น</label>
                  <input value={form.displayName} onChange={e=>setForm(f=>({...f,displayName:e.target.value}))}
                    className="input-love" required />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5 block">Bio</label>
                  <textarea value={form.bio} onChange={e=>setForm(f=>({...f,bio:e.target.value}))}
                    placeholder="เขียนอะไรสักอย่างเกี่ยวกับตัวเอง..."
                    className="input-love resize-none h-20" style={{resize:'none'}} />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5 block">วันที่เริ่มคบกัน</label>
                  <input type="date" value={form.relationshipStart} onChange={e=>setForm(f=>({...f,relationshipStart:e.target.value}))}
                    className="input-love" />
                </div>
                <div className="flex gap-3 pt-1">
                  <button type="submit" className="btn-love flex-1 py-3">บันทึก</button>
                  <button type="button" onClick={()=>setEditing(false)}
                    className="flex-1 py-3 rounded-full font-bold text-gray-500 hover:text-gray-700 transition-colors"
                    style={{ background:'#f3f4f6' }}>
                    ยกเลิก
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

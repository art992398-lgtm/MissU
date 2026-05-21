import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const EMOJIS = ['💕','🌹','🦋','🌸','💖','🍓','🌺','🐱','🐰','🌙','🎀','🍭','🌈','✨','🦄','🍒','🎸','🎹','🌊','🌿'];

export default function Profile() {
  const { currentUser, userProfile, updateUserProfile, updateLocalProfile, isLocal } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    displayName: userProfile?.displayName || '',
    bio: userProfile?.bio || '',
    avatarEmoji: userProfile?.avatarEmoji || '💕',
    relationshipStart: userProfile?.relationshipStart || '',
  });
  const [saved, setSaved] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    if (isLocal) {
      updateLocalProfile(form);
    } else {
      await updateUserProfile(currentUser.uid, form);
    }
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2000);
  }

  const daysTogetherCount = userProfile?.relationshipStart
    ? Math.floor((new Date() - new Date(userProfile.relationshipStart)) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <Navbar />
      <div className="max-w-lg mx-auto p-4 pt-8">
        <div className="bg-white rounded-3xl shadow-lg p-6 text-center">
          <div className="text-7xl mb-4">{userProfile?.avatarEmoji || '💕'}</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">{userProfile?.displayName}</h2>
          <p className="text-gray-400 text-sm mb-4">{userProfile?.email || 'Local Account'}</p>
          {userProfile?.bio && <p className="text-gray-500 text-sm mb-4 italic">"{userProfile.bio}"</p>}
          {daysTogetherCount !== null && daysTogetherCount >= 0 && (
            <div className="bg-rose-50 rounded-2xl py-3 px-6 inline-block mb-4">
              <span className="text-rose-500 font-bold text-2xl">{daysTogetherCount}</span>
              <span className="text-rose-400 text-sm ml-2">วันที่อยู่ด้วยกัน</span>
            </div>
          )}
          {isLocal && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl py-2 px-4 mb-4">
              <p className="text-yellow-600 text-xs">โหมด Local - ข้อมูลบันทึกเฉพาะในเบราว์เซอร์นี้</p>
            </div>
          )}
          {saved && <p className="text-green-500 text-sm mb-3">บันทึกแล้ว!</p>}
          {!editing ? (
            <button
              onClick={() => { setEditing(true); setForm({ displayName: userProfile?.displayName || '', bio: userProfile?.bio || '', avatarEmoji: userProfile?.avatarEmoji || '💕', relationshipStart: userProfile?.relationshipStart || '' }); }}
              className="bg-rose-400 hover:bg-rose-500 text-white font-medium py-2 px-6 rounded-2xl transition-all"
            >
              แก้ไขโปรไฟล์
            </button>
          ) : (
            <form onSubmit={handleSave} className="text-left space-y-4 mt-4">
              <div>
                <label className="text-sm text-gray-500 mb-1 block">เลือก Emoji</label>
                <div className="flex flex-wrap gap-2">
                  {EMOJIS.map(e => (
                    <button key={e} type="button"
                      onClick={() => setForm(f => ({ ...f, avatarEmoji: e }))}
                      className={`text-2xl p-1.5 rounded-xl transition-all ${form.avatarEmoji === e ? 'bg-rose-100 scale-110 shadow' : 'hover:bg-pink-50'}`}
                    >{e}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">ชื่อเล่น</label>
                <input
                  value={form.displayName}
                  onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))}
                  className="w-full border border-pink-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Bio</label>
                <textarea
                  value={form.bio}
                  onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  placeholder="เขียนอะไรสักอย่างเกี่ยวกับตัวเอง..."
                  className="w-full border border-pink-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400 resize-none h-20"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">วันที่เริ่มคบกัน</label>
                <input
                  type="date"
                  value={form.relationshipStart}
                  onChange={e => setForm(f => ({ ...f, relationshipStart: e.target.value }))}
                  className="w-full border border-pink-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-rose-400 hover:bg-rose-500 text-white font-medium py-2.5 rounded-2xl transition-all">บันทึก</button>
                <button type="button" onClick={() => setEditing(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium py-2.5 rounded-2xl transition-all">ยกเลิก</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

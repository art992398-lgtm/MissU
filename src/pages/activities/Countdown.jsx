import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';

const LS_KEY = 'missu_countdowns';

export default function Countdown() {
  const { userProfile, isLocal, currentUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ name: '', date: '' });
  const [now, setNow] = useState(new Date());

  useEffect(() => { loadEvents(); }, []);
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  function loadEvents() {
    const key = isLocal ? LS_KEY : `${LS_KEY}_${currentUser?.uid}`;
    const stored = JSON.parse(localStorage.getItem(key) || '[]');
    setEvents(stored);
  }

  function handleAdd(e) {
    e.preventDefault();
    const key = isLocal ? LS_KEY : `${LS_KEY}_${currentUser?.uid}`;
    const stored = JSON.parse(localStorage.getItem(key) || '[]');
    stored.push({ ...form, id: Date.now().toString() });
    localStorage.setItem(key, JSON.stringify(stored));
    setForm({ name: '', date: '' });
    loadEvents();
  }

  function handleDelete(id) {
    const key = isLocal ? LS_KEY : `${LS_KEY}_${currentUser?.uid}`;
    const stored = JSON.parse(localStorage.getItem(key) || '[]').filter(e => e.id !== id);
    localStorage.setItem(key, JSON.stringify(stored));
    loadEvents();
  }

  function getDiff(dateStr) {
    const target = new Date(dateStr);
    const diff = target - now;
    if (diff < 0) {
      const past = Math.abs(diff);
      const d = Math.floor(past / (1000 * 60 * 60 * 24));
      return { past: true, days: d, label: `ผ่านมาแล้ว ${d} วัน` };
    }
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);
    return { past: false, days: d, hours: h, mins: m, secs: s };
  }

  const relStart = userProfile?.relationshipStart;
  const relDays = relStart ? Math.floor((now - new Date(relStart)) / (1000 * 60 * 60 * 24)) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      <Navbar />
      <div className="max-w-2xl mx-auto p-4 pt-6">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/dashboard" className="text-rose-400 hover:text-rose-500 text-sm">← กลับ</Link>
          <h1 className="text-2xl font-bold text-gray-700">⏰ นับวัน</h1>
        </div>
        {relDays !== null && (
          <div className="bg-gradient-to-r from-rose-400 to-pink-400 text-white rounded-3xl p-6 text-center mb-6 shadow-lg">
            <p className="text-sm opacity-80 mb-1">เราอยู่ด้วยกันมา</p>
            <p className="text-6xl font-bold">{relDays}</p>
            <p className="text-sm opacity-80 mt-1">วัน</p>
          </div>
        )}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <h3 className="font-bold text-gray-600 mb-4">เพิ่มวันสำคัญ</h3>
          <form onSubmit={handleAdd} className="flex gap-3">
            <input
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="ชื่อวันสำคัญ" required
              className="flex-1 border border-pink-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400"
            />
            <input
              type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required
              className="border border-pink-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400"
            />
            <button type="submit" className="bg-rose-400 hover:bg-rose-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all">+</button>
          </form>
        </div>
        <div className="space-y-4">
          {events.map(ev => {
            const d = getDiff(ev.date);
            return (
              <div key={ev.id} className="bg-white rounded-2xl shadow p-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-gray-700">{ev.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{new Date(ev.date).toLocaleDateString('th-TH')}</span>
                    <button onClick={() => handleDelete(ev.id)} className="text-gray-300 hover:text-rose-400 text-sm">×</button>
                  </div>
                </div>
                {d.past ? (
                  <p className="text-purple-400 font-medium">{d.label} 🎉</p>
                ) : (
                  <div className="flex gap-3">
                    {[{ v: d.days, l: 'วัน' }, { v: d.hours, l: 'ชั่วโมง' }, { v: d.mins, l: 'นาที' }, { v: d.secs, l: 'วินาที' }].map(({ v, l }) => (
                      <div key={l} className="text-center bg-rose-50 rounded-xl px-3 py-2 flex-1">
                        <p className="text-xl font-bold text-rose-500">{v}</p>
                        <p className="text-xs text-gray-400">{l}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {events.length === 0 && <p className="text-center text-gray-400 py-8">เพิ่มวันสำคัญของคุณ!</p>}
        </div>
      </div>
    </div>
  );
}

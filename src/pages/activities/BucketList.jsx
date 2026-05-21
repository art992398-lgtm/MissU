import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';

const LS_KEY = 'missu_bucketlist';

const SUGGESTIONS = [
  'ดูพระอาทิตย์ตกด้วยกัน', 'ทำอาหารด้วยกัน', 'ดูหนังกลางแปลง',
  'ไปเที่ยวทะเลด้วยกัน', 'ปลูกต้นไม้ด้วยกัน', 'เรียนทำเบเกอรี่',
  'ขี่จักรยานตอนเช้า', 'ถ่ายรูปคู่ในธีมพิเศษ', 'ไปดูคอนเสิร์ต',
  'วาดรูปด้วยกัน', 'ดูดาวตอนกลางคืน', 'ออกกำลังกายด้วยกัน 30 วัน',
];

export default function BucketList() {
  const { currentUser, isLocal } = useAuth();
  const [items, setItems] = useState([]);
  const [text, setText] = useState('');

  const key = isLocal ? LS_KEY : `${LS_KEY}_${currentUser?.uid}`;

  useEffect(() => {
    setItems(JSON.parse(localStorage.getItem(key) || '[]'));
  }, []);

  function save(newItems) {
    localStorage.setItem(key, JSON.stringify(newItems));
    setItems(newItems);
  }

  function addItem(t) {
    if (!t.trim()) return;
    save([...items, { id: Date.now().toString(), text: t.trim(), done: false, createdAt: new Date().toISOString() }]);
    setText('');
  }

  function toggle(id) {
    save(items.map(i => i.id === id ? { ...i, done: !i.done } : i));
  }

  function remove(id) {
    save(items.filter(i => i.id !== id));
  }

  const done = items.filter(i => i.done).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
      <Navbar />
      <div className="max-w-2xl mx-auto p-4 pt-6">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/dashboard" className="text-rose-400 hover:text-rose-500 text-sm">← กลับ</Link>
          <h1 className="text-2xl font-bold text-gray-700">🎯 Bucket List คู่รัก</h1>
        </div>
        {items.length > 0 && (
          <div className="bg-white rounded-3xl shadow p-4 text-center mb-6">
            <div className="text-3xl font-bold text-orange-400">{done} / {items.length}</div>
            <p className="text-gray-500 text-sm">ทำสำเร็จแล้ว</p>
            <div className="h-2 bg-orange-100 rounded-full mt-3">
              <div className="h-2 bg-gradient-to-r from-orange-400 to-rose-400 rounded-full transition-all" style={{ width: `${(done / items.length) * 100}%` }} />
            </div>
          </div>
        )}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <form onSubmit={e => { e.preventDefault(); addItem(text); }} className="flex gap-3">
            <input
              value={text} onChange={e => setText(e.target.value)}
              placeholder="เพิ่มสิ่งที่อยากทำ..."
              className="flex-1 border border-orange-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
            />
            <button type="submit" className="bg-orange-400 hover:bg-orange-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all">+</button>
          </form>
          <div className="mt-4">
            <p className="text-xs text-gray-400 mb-2">คำแนะนำ:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.slice(0, 6).map(s => (
                <button key={s} onClick={() => addItem(s)} className="text-xs bg-orange-50 hover:bg-orange-100 text-orange-600 px-3 py-1.5 rounded-full transition-all border border-orange-200">
                  + {s}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {items.length === 0 && <p className="text-center text-gray-400 py-8">เพิ่มสิ่งที่คุณอยากทำด้วยกัน!</p>}
          {items.map(item => (
            <div key={item.id} className={`bg-white rounded-2xl shadow p-4 flex items-center gap-3 transition-all ${item.done ? 'opacity-60' : ''}`}>
              <button
                onClick={() => toggle(item.id)}
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${item.done ? 'bg-green-400 border-green-400 text-white' : 'border-gray-300 hover:border-orange-400'}`}
              >
                {item.done && '✓'}
              </button>
              <span className={`flex-1 text-sm ${item.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>{item.text}</span>
              <button onClick={() => remove(item.id)} className="text-gray-300 hover:text-rose-400 text-lg leading-none">×</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

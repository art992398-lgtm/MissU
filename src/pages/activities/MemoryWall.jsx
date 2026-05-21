import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar';
import PageHeader from '../../components/PageHeader';

const LS_KEY = 'missu_memories';
const CARD_STYLES = [
  {bg:'#fff1f3',border:'#fda4af'},{bg:'#f3e8ff',border:'#d8b4fe'},
  {bg:'#ecfdf5',border:'#6ee7b7'},{bg:'#eff6ff',border:'#93c5fd'},
  {bg:'#fff7ed',border:'#fcd34d'},{bg:'#fdf4ff',border:'#f0abfc'},
];
const EMOJIS = ['📸','🌸','🎉','❤️','🌊','🎂','✈️','🎵','🌙','☀️','🍕','🎁'];

export default function MemoryWall() {
  const { currentUser, isLocal } = useAuth();
  const [memories, setMemories] = useState([]);
  const [form, setForm] = useState({ title:'', note:'', date:new Date().toISOString().split('T')[0], emoji:'📸' });
  const [showForm, setShowForm] = useState(false);
  const key = isLocal ? LS_KEY : `${LS_KEY}_${currentUser?.uid}`;

  useEffect(()=>{ setMemories(JSON.parse(localStorage.getItem(key)||'[]').reverse()); },[]);

  function save(list) {
    const rev=[...list].reverse();
    localStorage.setItem(key,JSON.stringify(list));
    setMemories(rev);
  }

  function addMemory(e) {
    e.preventDefault();
    const stored=JSON.parse(localStorage.getItem(key)||'[]');
    const style=CARD_STYLES[Math.floor(Math.random()*CARD_STYLES.length)];
    stored.push({...form,id:Date.now().toString(),...style});
    save(stored);
    setForm({title:'',note:'',date:new Date().toISOString().split('T')[0],emoji:'📸'});
    setShowForm(false);
  }

  function removeMemory(id){ save([...memories].reverse().filter(m=>m.id!==id)); }

  return (
    <div className="min-h-screen" style={{background:'linear-gradient(160deg,#ecfdf5,#d1fae5,#e0f2fe)'}}>
      <Navbar />
      <PageHeader emoji="📸" title="กำแพงความทรงจำ" subtitle="เก็บทุกช่วงเวลาที่ดีไว้ตลอดกาล" grad="from-teal-400 to-cyan-500" />

      <div className="max-w-2xl mx-auto px-4 -mt-6 pb-10">
        <div className="flex justify-end mb-4">
          <button onClick={()=>setShowForm(!showForm)} className="btn-love py-2.5 px-5 text-sm"
            style={{background:'linear-gradient(135deg,#14b8a6,#06b6d4)'}}>
            {showForm ? 'ยกเลิก' : '+ เพิ่มความทรงจำ'}
          </button>
        </div>

        {showForm && (
          <div className="card-love p-6 mb-5 animate-fade-up">
            <form onSubmit={addMemory} className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {EMOJIS.map(e=>(
                  <button key={e} type="button" onClick={()=>setForm(f=>({...f,emoji:e}))}
                    className={`text-2xl p-1.5 rounded-xl transition-all ${form.emoji===e?'bg-teal-100 scale-110 shadow':'hover:bg-gray-50'}`}>{e}</button>
                ))}
              </div>
              <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="หัวเรื่อง" required
                className="input-love" style={{borderColor:'#a7f3d0'}} />
              <textarea value={form.note} onChange={e=>setForm(f=>({...f,note:e.target.value}))} placeholder="บันทึกความทรงจำ..."
                className="input-love resize-none h-24" style={{borderColor:'#a7f3d0',resize:'none'}} />
              <input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))}
                className="input-love" style={{borderColor:'#a7f3d0'}} />
              <button type="submit" className="btn-love w-full py-3"
                style={{background:'linear-gradient(135deg,#14b8a6,#06b6d4)'}}>
                บันทึกความทรงจำ 📸
              </button>
            </form>
          </div>
        )}

        {memories.length===0 && !showForm && (
          <div className="text-center py-16 text-gray-300">
            <div className="text-6xl mb-3 opacity-40">📸</div>
            <p className="font-display italic text-xl">เริ่มเก็บความทรงจำดีๆ ของคุณ!</p>
          </div>
        )}

        <div className="columns-2 gap-4">
          {memories.map(m=>(
            <div key={m.id} className="break-inside-avoid mb-4 rounded-2xl p-4 group relative transition-all hover:shadow-lg"
              style={{background:m.bg||'#fff1f3', border:`1px solid ${m.border||'#fda4af'}`}}>
              <button onClick={()=>removeMemory(m.id)}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/80 text-gray-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all text-sm flex items-center justify-center shadow">
                ×
              </button>
              <div className="text-3xl mb-2">{m.emoji}</div>
              <h4 className="font-bold text-gray-800 text-sm mb-1">{m.title}</h4>
              {m.note && <p className="text-gray-500 text-xs leading-relaxed mb-2">{m.note}</p>}
              <p className="text-xs font-medium" style={{color:m.border||'#f43f5e'}}>
                {new Date(m.date).toLocaleDateString('th-TH')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

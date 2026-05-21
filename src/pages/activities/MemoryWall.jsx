import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar';
import PageHeader from '../../components/PageHeader';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../firebase/config';

const CARD_STYLES = [
  {bg:'#fff1f3',border:'#fda4af'},{bg:'#f3e8ff',border:'#d8b4fe'},
  {bg:'#ecfdf5',border:'#6ee7b7'},{bg:'#eff6ff',border:'#93c5fd'},
  {bg:'#fff7ed',border:'#fcd34d'},{bg:'#fdf4ff',border:'#f0abfc'},
];
const EMOJIS = ['📸','🌸','🎉','❤️','🌊','🎂','✈️','🎵','🌙','☀️','🍕','🎁'];

export default function MemoryWall() {
  const { currentUser, userProfile } = useAuth();
  const coupleId = currentUser && userProfile?.partnerId
    ? [currentUser.uid, userProfile.partnerId].sort().join('_') : null;

  const [memories, setMemories] = useState([]);
  const [form, setForm] = useState({ title:'', note:'', date:new Date().toISOString().split('T')[0], emoji:'📸' });
  const [showForm, setShowForm] = useState(false);
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!coupleId) return;
    const q = query(collection(db, 'couples', coupleId, 'memories'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, snap => {
      setMemories(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, [coupleId]);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
  }

  function clearMedia() {
    setMediaFile(null);
    setMediaPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function addMemory(e) {
    e.preventDefault();
    if (!coupleId) return;

    let mediaUrl = null;
    let mediaType = null;

    if (mediaFile) {
      const ext = mediaFile.name.split('.').pop();
      const path = `couples/${coupleId}/memories/${Date.now()}.${ext}`;
      const sRef = storageRef(storage, path);
      const task = uploadBytesResumable(sRef, mediaFile);

      await new Promise((resolve, reject) => {
        task.on('state_changed',
          snap => setUploadProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
          reject,
          async () => {
            mediaUrl = await getDownloadURL(task.snapshot.ref);
            mediaType = mediaFile.type.startsWith('video/') ? 'video' : 'image';
            setUploadProgress(null);
            resolve();
          }
        );
      });
    }

    const style = CARD_STYLES[Math.floor(Math.random()*CARD_STYLES.length)];
    await addDoc(collection(db, 'couples', coupleId, 'memories'), {
      ...form, ...style,
      authorId: currentUser.uid,
      createdAt: serverTimestamp(),
      ...(mediaUrl ? { mediaUrl, mediaType } : {}),
    });

    setForm({ title:'', note:'', date:new Date().toISOString().split('T')[0], emoji:'📸' });
    clearMedia();
    setShowForm(false);
  }

  async function removeMemory(m) {
    if (m.mediaUrl) {
      try {
        const path = `couples/${coupleId}/memories/${m.mediaUrl.split('%2F').pop().split('?')[0]}`;
        await deleteObject(storageRef(storage, decodeURIComponent(path)));
      } catch (_) { /* ignore if already deleted */ }
    }
    await deleteDoc(doc(db, 'couples', coupleId, 'memories', m.id));
  }

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

              {/* Media upload */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="memory-media"
                />
                {!mediaPreview ? (
                  <label htmlFor="memory-media"
                    className="flex items-center gap-2 cursor-pointer border-2 border-dashed rounded-2xl p-4 justify-center text-sm font-semibold transition-all hover:bg-teal-50"
                    style={{borderColor:'#a7f3d0', color:'#14b8a6'}}>
                    📷 เพิ่มรูปภาพหรือวิดีโอ
                  </label>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden">
                    {mediaFile?.type.startsWith('video/') ? (
                      <video src={mediaPreview} controls className="w-full max-h-56 object-cover rounded-2xl"/>
                    ) : (
                      <img src={mediaPreview} alt="" className="w-full max-h-56 object-cover rounded-2xl"/>
                    )}
                    <button type="button" onClick={clearMedia}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center text-sm">
                      ×
                    </button>
                  </div>
                )}
              </div>

              {uploadProgress !== null && (
                <div className="rounded-full overflow-hidden bg-teal-100 h-2">
                  <div className="h-2 rounded-full transition-all" style={{width:`${uploadProgress}%`, background:'linear-gradient(90deg,#14b8a6,#06b6d4)'}}/>
                </div>
              )}

              <button type="submit" disabled={uploadProgress !== null} className="btn-love w-full py-3"
                style={{background:'linear-gradient(135deg,#14b8a6,#06b6d4)', opacity: uploadProgress !== null ? 0.6 : 1}}>
                {uploadProgress !== null ? `กำลังอัปโหลด ${uploadProgress}%...` : 'บันทึกความทรงจำ 📸'}
              </button>
            </form>
          </div>
        )}

        {memories.length === 0 && !showForm && (
          <div className="text-center py-16 text-gray-300">
            <div className="text-6xl mb-3 opacity-40">📸</div>
            <p className="font-display italic text-xl">เริ่มเก็บความทรงจำดีๆ ของคุณ!</p>
          </div>
        )}

        <div className="columns-2 gap-4">
          {memories.map(m=>(
            <div key={m.id} className="break-inside-avoid mb-4 rounded-2xl overflow-hidden group relative transition-all hover:shadow-lg"
              style={{background:m.bg||'#fff1f3', border:`1px solid ${m.border||'#fda4af'}`}}>
              <button onClick={()=>removeMemory(m)}
                className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-white/80 text-gray-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all text-sm flex items-center justify-center shadow">
                ×
              </button>

              {m.mediaUrl && (
                m.mediaType === 'video' ? (
                  <video src={m.mediaUrl} controls className="w-full max-h-48 object-cover"/>
                ) : (
                  <img src={m.mediaUrl} alt="" className="w-full max-h-48 object-cover"/>
                )
              )}

              <div className="p-4">
                <div className="text-3xl mb-2">{m.emoji}</div>
                <h4 className="font-bold text-gray-800 text-sm mb-1">{m.title}</h4>
                {m.note && <p className="text-gray-500 text-xs leading-relaxed mb-2">{m.note}</p>}
                <p className="text-xs font-medium" style={{color:m.border||'#f43f5e'}}>
                  {new Date(m.date).toLocaleDateString('th-TH')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

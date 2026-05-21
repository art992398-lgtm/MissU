import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const EMOJIS = ['💕','🌹','🦋','🌸','💖','🍓','🌺','🐱','🐰','🌙'];

const HEARTS = [
  { emoji:'💕', size:'text-3xl', top:'8%',  left:'5%',  cls:'animate-float',  delay:'delay-0' },
  { emoji:'🌸', size:'text-2xl', top:'15%', left:'88%', cls:'animate-float2', delay:'delay-500' },
  { emoji:'💖', size:'text-4xl', top:'72%', left:'7%',  cls:'animate-float3', delay:'delay-1000' },
  { emoji:'✨', size:'text-xl',  top:'30%', left:'93%', cls:'animate-sparkle',delay:'delay-300' },
  { emoji:'🌹', size:'text-2xl', top:'85%', left:'82%', cls:'animate-float2', delay:'delay-1500' },
  { emoji:'💫', size:'text-xl',  top:'55%', left:'3%',  cls:'animate-sparkle',delay:'delay-700' },
  { emoji:'🦋', size:'text-2xl', top:'45%', left:'91%', cls:'animate-float',  delay:'delay-2000' },
  { emoji:'💝', size:'text-3xl', top:'20%', left:'50%', cls:'animate-float3', delay:'delay-200' },
];

export default function Landing() {
  const [mode, setMode] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('💕');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register, loginLocal } = useAuth();
  const navigate = useNavigate();

  async function handleEmailLogin(e) {
    e.preventDefault(); setError(''); setLoading(true);
    try { await login(email, password); navigate('/dashboard'); }
    catch { setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง'); }
    setLoading(false);
  }

  async function handleRegister(e) {
    e.preventDefault(); setError(''); setLoading(true);
    try { await register(email, password, name); navigate('/dashboard'); }
    catch(err) { setError(err.message.includes('email-already-in-use') ? 'อีเมลนี้ถูกใช้แล้ว' : 'เกิดข้อผิดพลาด ลองใหม่อีกครั้ง'); }
    setLoading(false);
  }

  function handleLocalLogin(e) {
    e.preventDefault();
    if (!name.trim()) { setError('กรุณาใส่ชื่อ'); return; }
    loginLocal(name.trim(), selectedEmoji);
    navigate('/dashboard');
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #3d0a20 0%, #1a0533 40%, #0f0a2e 70%, #1a1040 100%)' }}>

      {/* Floating decorations */}
      {HEARTS.map((h, i) => (
        <div key={i} className={`absolute pointer-events-none select-none ${h.size} ${h.cls} ${h.delay}`}
          style={{ top: h.top, left: h.left }}>
          {h.emoji}
        </div>
      ))}

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background:'radial-gradient(circle, rgba(244,63,94,0.15) 0%, transparent 70%)' }} />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{ background:'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)' }} />

      {/* Content */}
      <div className="relative z-10 w-full max-w-sm mx-auto px-4">
        {!mode ? (
          /* Hero screen */
          <div className="text-center animate-fade-up">
            <div className="text-7xl mb-4 animate-heartbeat">💕</div>
            <h1 className="font-display text-6xl font-bold text-white mb-2" style={{letterSpacing:'-1px'}}>
              MissU
            </h1>
            <p className="text-pink-300 text-lg mb-2 font-display italic">พื้นที่พิเศษสำหรับสองคน</p>
            <p className="text-white/40 text-sm mb-10">เก็บทุกช่วงเวลา ทุกความรู้สึก ทุกความทรงจำ</p>

            <div className="space-y-3">
              <button onClick={() => setMode('login')} className="btn-love w-full text-base py-3.5">
                เข้าสู่ระบบด้วยอีเมล
              </button>
              <button onClick={() => setMode('register')}
                className="w-full font-bold py-3.5 rounded-full text-base transition-all text-white/90 hover:text-white"
                style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)' }}>
                สมัครสมาชิกใหม่
              </button>
              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px" style={{background:'rgba(255,255,255,0.1)'}} />
                <span className="text-white/30 text-xs">หรือ</span>
                <div className="flex-1 h-px" style={{background:'rgba(255,255,255,0.1)'}} />
              </div>
              <button onClick={() => setMode('local')} className="btn-ghost w-full text-base py-3.5"
                style={{ borderColor:'rgba(244,63,94,0.5)', color:'#fda4af' }}>
                ใช้งานแบบออฟไลน์
              </button>
              <p className="text-white/20 text-xs">ข้อมูล Local บันทึกเฉพาะในเบราว์เซอร์นี้</p>
            </div>
          </div>
        ) : (
          /* Auth card */
          <div className="glass rounded-3xl p-7 animate-fade-up"
            style={{ background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)' }}>
            <button onClick={() => { setMode(null); setError(''); }}
              className="flex items-center gap-1.5 text-pink-300 hover:text-white transition-colors text-sm mb-5">
              ← กลับ
            </button>

            <div className="text-center mb-5">
              <div className="text-4xl mb-2">{mode==='login'?'🔑':mode==='register'?'✨':'📱'}</div>
              <h2 className="font-display text-2xl font-semibold text-white">
                {mode==='login'?'ยินดีต้อนรับกลับ':mode==='register'?'สร้างบัญชีใหม่':'เริ่มต้นแบบ Local'}
              </h2>
            </div>

            {error && (
              <div className="mb-4 py-2.5 px-4 rounded-2xl text-sm text-center"
                style={{ background:'rgba(244,63,94,0.2)', border:'1px solid rgba(244,63,94,0.3)', color:'#fda4af' }}>
                {error}
              </div>
            )}

            <form onSubmit={mode==='login'?handleEmailLogin:mode==='register'?handleRegister:handleLocalLogin}
              className="space-y-3">
              {(mode==='register'||mode==='local') && (
                <div>
                  <label className="text-pink-200/70 text-xs font-semibold uppercase tracking-wider mb-1.5 block">ชื่อเล่น</label>
                  <input value={name} onChange={e=>setName(e.target.value)} placeholder="ชื่อของคุณ" required
                    className="w-full rounded-2xl px-4 py-3 text-sm outline-none text-white placeholder-white/30"
                    style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)' }} />
                </div>
              )}
              {mode==='local' && (
                <div>
                  <label className="text-pink-200/70 text-xs font-semibold uppercase tracking-wider mb-2 block">เลือก Emoji</label>
                  <div className="flex flex-wrap gap-2">
                    {EMOJIS.map(e => (
                      <button key={e} type="button" onClick={() => setSelectedEmoji(e)}
                        className={`text-xl p-2 rounded-xl transition-all ${selectedEmoji===e?'scale-125 bg-white/20 shadow-lg':'opacity-60 hover:opacity-100 hover:bg-white/10'}`}>
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {mode!=='local' && (
                <>
                  <div>
                    <label className="text-pink-200/70 text-xs font-semibold uppercase tracking-wider mb-1.5 block">อีเมล</label>
                    <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="email@example.com" required
                      className="w-full rounded-2xl px-4 py-3 text-sm outline-none text-white placeholder-white/30"
                      style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)' }} />
                  </div>
                  <div>
                    <label className="text-pink-200/70 text-xs font-semibold uppercase tracking-wider mb-1.5 block">รหัสผ่าน</label>
                    <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required minLength={6}
                      className="w-full rounded-2xl px-4 py-3 text-sm outline-none text-white placeholder-white/30"
                      style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)' }} />
                  </div>
                </>
              )}
              <div className="pt-2">
                <button type="submit" disabled={loading} className="btn-love w-full py-3.5 text-base">
                  {loading ? '...' : mode==='login'?'เข้าสู่ระบบ':mode==='register'?'สร้างบัญชี':'เริ่มต้นเลย'}
                </button>
              </div>
            </form>

            {mode==='login' && (
              <p className="text-center text-sm mt-4" style={{color:'rgba(255,255,255,0.4)'}}>
                ยังไม่มีบัญชี?{' '}
                <button onClick={()=>{setMode('register');setError('');}}
                  className="font-bold" style={{color:'#fda4af'}}>สมัครสมาชิก</button>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

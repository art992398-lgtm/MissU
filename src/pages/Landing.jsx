import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const EMOJIS = ['💕', '🌹', '🦋', '🌸', '💖', '🍓', '🌺', '🐱', '🐰', '🌙'];

export default function Landing() {
  const [mode, setMode] = useState(null); // 'login' | 'register' | 'local'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('💕');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register, loginLocal } = useAuth();
  const navigate = useNavigate();

  async function handleEmailLogin(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }
    setLoading(false);
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await register(email, password, name);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message.includes('email-already-in-use') ? 'อีเมลนี้ถูกใช้แล้ว' : 'เกิดข้อผิดพลาด กรุณาลองใหม่');
    }
    setLoading(false);
  }

  function handleLocalLogin(e) {
    e.preventDefault();
    if (!name.trim()) { setError('กรุณาใส่ชื่อ'); return; }
    loginLocal(name.trim(), selectedEmoji);
    navigate('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex flex-col items-center justify-center p-4">
      {!mode ? (
        <div className="text-center max-w-sm w-full">
          <div className="text-6xl mb-4">💕</div>
          <h1 className="text-4xl font-bold text-rose-500 mb-2">MissU</h1>
          <p className="text-gray-500 mb-8">พื้นที่พิเศษสำหรับสองคน</p>
          <div className="space-y-3">
            <button
              onClick={() => setMode('login')}
              className="w-full bg-rose-400 hover:bg-rose-500 text-white font-medium py-3 px-6 rounded-2xl transition-all shadow-md hover:shadow-lg"
            >
              เข้าสู่ระบบด้วยอีเมล
            </button>
            <button
              onClick={() => setMode('register')}
              className="w-full bg-pink-100 hover:bg-pink-200 text-rose-600 font-medium py-3 px-6 rounded-2xl transition-all"
            >
              สมัครสมาชิกใหม่
            </button>
            <div className="flex items-center gap-3 my-2">
              <hr className="flex-1 border-pink-200" />
              <span className="text-gray-400 text-sm">หรือ</span>
              <hr className="flex-1 border-pink-200" />
            </div>
            <button
              onClick={() => setMode('local')}
              className="w-full border-2 border-pink-300 hover:border-rose-400 text-rose-500 font-medium py-3 px-6 rounded-2xl transition-all"
            >
              ใช้งานแบบออฟไลน์ (Local)
            </button>
            <p className="text-xs text-gray-400 mt-2">ข้อมูล Local บันทึกในเบราว์เซอร์นี้เท่านั้น</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-sm">
          <button onClick={() => { setMode(null); setError(''); }} className="text-gray-400 hover:text-rose-400 mb-4 text-sm flex items-center gap-1">
            ← กลับ
          </button>
          <div className="text-3xl mb-3 text-center">
            {mode === 'login' ? '🔑' : mode === 'register' ? '✨' : '📱'}
          </div>
          <h2 className="text-xl font-bold text-gray-700 text-center mb-6">
            {mode === 'login' ? 'เข้าสู่ระบบ' : mode === 'register' ? 'สมัครสมาชิก' : 'ใช้งานแบบ Local'}
          </h2>
          {error && <p className="text-red-400 text-sm mb-4 text-center bg-red-50 py-2 px-3 rounded-xl">{error}</p>}
          <form onSubmit={mode === 'login' ? handleEmailLogin : mode === 'register' ? handleRegister : handleLocalLogin} className="space-y-4">
            {(mode === 'register' || mode === 'local') && (
              <div>
                <label className="text-sm text-gray-500 mb-1 block">ชื่อเล่น</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="ชื่อของคุณ"
                  className="w-full border border-pink-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  required
                />
              </div>
            )}
            {mode === 'local' && (
              <div>
                <label className="text-sm text-gray-500 mb-2 block">เลือก Emoji โปรด</label>
                <div className="flex flex-wrap gap-2">
                  {EMOJIS.map(e => (
                    <button
                      key={e} type="button"
                      onClick={() => setSelectedEmoji(e)}
                      className={`text-2xl p-2 rounded-xl transition-all ${selectedEmoji === e ? 'bg-rose-100 scale-110 shadow' : 'hover:bg-pink-50'}`}
                    >{e}</button>
                  ))}
                </div>
              </div>
            )}
            {mode !== 'local' && (
              <>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">อีเมล</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full border border-pink-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">รหัสผ่าน</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-pink-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                    required minLength={6}
                  />
                </div>
              </>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-400 hover:bg-rose-500 disabled:bg-rose-200 text-white font-medium py-3 rounded-2xl transition-all shadow-md mt-2"
            >
              {loading ? '...' : mode === 'login' ? 'เข้าสู่ระบบ' : mode === 'register' ? 'สมัครสมาชิก' : 'เริ่มใช้งาน'}
            </button>
          </form>
          {mode === 'login' && (
            <p className="text-center text-sm text-gray-400 mt-4">
              ยังไม่มีบัญชี?{' '}
              <button onClick={() => { setMode('register'); setError(''); }} className="text-rose-400 font-medium">สมัครสมาชิก</button>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

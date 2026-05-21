import { useState } from 'react';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';

const DATE_IDEAS = [
  { emoji: '🍣', idea: 'ไปทานซูชิด้วยกัน', detail: 'หาร้านซูชิแสนอร่อย นั่งคุยกันชิวๆ' },
  { emoji: '🎬', idea: 'ดูหนังในโรงภาพยนตร์', detail: 'เลือกหนังที่ทั้งคู่อยากดู แล้วไปนั่งดูพร้อมกัน' },
  { emoji: '🌅', idea: 'ดูพระอาทิตย์ตก', detail: 'ไปหาจุดชมวิวสวยๆ แล้วดูพระอาทิตย์ตกด้วยกัน' },
  { emoji: '🍳', idea: 'ทำอาหารที่บ้าน', detail: 'เลือกเมนูพิเศษ แล้วลงมือทำด้วยกัน' },
  { emoji: '🎡', idea: 'ไปสวนสนุก', detail: 'ขึ้นเครื่องเล่น กินของว่าง สนุกสุดๆ' },
  { emoji: '🌳', idea: 'ปิกนิกในสวน', detail: 'เตรียมผ้าปูพื้นและอาหาร ไปนั่งเล่นในสวนสาธารณะ' },
  { emoji: '🎭', idea: 'ดูการแสดง', detail: 'หาคอนเสิร์ต ละคร หรือการแสดงสดที่น่าสนใจ' },
  { emoji: '🏖️', idea: 'ไปทะเล', detail: 'นั่งฟังเสียงคลื่น เดินเล่นริมหาด ถ่ายรูปสวยๆ' },
  { emoji: '🎨', idea: 'คลาสวาดรูปด้วยกัน', detail: 'ลงทะเบียนคลาสวาดรูป แล้วสร้างงานศิลปะด้วยกัน' },
  { emoji: '🌙', idea: 'ดูดาวตอนกลางคืน', detail: 'ไปที่ที่มืดและเงียบสงบ นอนดูดาวด้วยกัน' },
  { emoji: '☕', idea: 'คาเฟ่โฮป', detail: 'เดินเข้าคาเฟ่สวยๆ หลายเจ้าในวันเดียว' },
  { emoji: '🎮', idea: 'เล่นเกมด้วยกัน', detail: 'เลือกเกมที่เล่นสองคนได้ แล้วแข่งกันสนุกๆ' },
  { emoji: '🚲', idea: 'ขี่จักรยาน', detail: 'หาเส้นทางสวยๆ แล้วปั่นจักรยานชมวิว' },
  { emoji: '🍦', idea: 'ล่าไอศกรีม', detail: 'หาร้านไอศกรีมอร่อยๆ หรือทำไอศกรีมเองที่บ้าน' },
  { emoji: '📚', idea: 'อ่านหนังสือด้วยกัน', detail: 'ไปร้านหนังสือ เลือกเล่มที่ชอบ แล้วนั่งอ่านด้วยกัน' },
  { emoji: '🏊', idea: 'ว่ายน้ำด้วยกัน', detail: 'ไปสระว่ายน้ำหรือน้ำตก เล่นน้ำและผ่อนคลาย' },
];

export default function DateWheel() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [history, setHistory] = useState([]);

  function spin() {
    if (spinning) return;
    setSpinning(true);
    setResult(null);
    const extra = 720 + Math.random() * 720;
    const newRot = rotation + extra;
    setRotation(newRot);
    const index = Math.floor(((360 - (newRot % 360)) / 360) * DATE_IDEAS.length) % DATE_IDEAS.length;
    setTimeout(() => {
      const picked = DATE_IDEAS[index];
      setResult(picked);
      setHistory(h => [picked, ...h].slice(0, 5));
      setSpinning(false);
    }, 2500);
  }

  const segmentAngle = 360 / DATE_IDEAS.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50">
      <Navbar />
      <div className="max-w-lg mx-auto p-4 pt-6">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/dashboard" className="text-rose-400 hover:text-rose-500 text-sm">← กลับ</Link>
          <h1 className="text-2xl font-bold text-gray-700">🎲 วงล้อเดท</h1>
        </div>
        <div className="bg-white rounded-3xl shadow-lg p-6 text-center mb-6">
          <p className="text-gray-500 text-sm mb-6">สปินเพื่อรับไอเดียเดทสุดพิเศษ!</p>
          <div className="relative inline-block mb-6">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10 text-2xl">🔻</div>
            <div
              className="w-64 h-64 rounded-full border-4 border-white shadow-xl transition-transform"
              style={{ transition: spinning ? 'transform 2.5s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none', transform: `rotate(${rotation}deg)`, background: `conic-gradient(${DATE_IDEAS.map((d, i) => `${['#fda4af','#f9a8d4','#d8b4fe','#93c5fd','#6ee7b7','#fcd34d','#fb923c','#f87171'][i % 8]} ${i * segmentAngle}deg ${(i + 1) * segmentAngle}deg`).join(',')})` }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white rounded-full w-12 h-12 shadow-inner flex items-center justify-center text-xl">
                  💕
                </div>
              </div>
            </div>
          </div>
          <button onClick={spin} disabled={spinning}
            className={`px-8 py-3 rounded-2xl font-bold text-white text-lg transition-all shadow-lg ${spinning ? 'bg-gray-300' : 'bg-rose-400 hover:bg-rose-500 hover:scale-105'}`}>
            {spinning ? 'กำลังสปิน...' : '🎲 สปิน!'}
          </button>
        </div>
        {result && (
          <div className="bg-white rounded-3xl shadow-lg p-6 text-center mb-6 border-2 border-rose-200">
            <div className="text-5xl mb-3">{result.emoji}</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">{result.idea}</h3>
            <p className="text-gray-500 text-sm">{result.detail}</p>
          </div>
        )}
        {history.length > 1 && (
          <div className="bg-white rounded-2xl shadow p-4">
            <p className="text-sm font-medium text-gray-500 mb-3">ผลล่าสุด:</p>
            <div className="space-y-2">
              {history.slice(1).map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{h.emoji}</span><span>{h.idea}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

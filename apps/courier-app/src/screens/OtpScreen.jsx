import React, { useState, useEffect, useRef } from 'react';
import StatusBar from '../components/StatusBar';
import { ArrowLeft, Shield, RefreshCw } from '../components/Icons';

const OtpScreen = ({ phone, onVerify, onBack, T }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [ld, setLd] = useState(false);
  const [resent, setResent] = useState(false);
  const [timer, setTimer] = useState(30);
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  useEffect(() => { refs[0].current?.focus() }, []);
  useEffect(() => { if (timer > 0) { const i = setInterval(() => setTimer(t => t - 1), 1000); return () => clearInterval(i) } }, [timer]);

  const handleChange = (val, idx) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp]; next[idx] = val.slice(-1); setOtp(next);
    if (val && idx < 5) refs[idx + 1].current?.focus();
    if (next.every(d => d)) { setLd(true); setTimeout(onVerify, 1200) }
  };
  const handleKey = (e, idx) => { if (e.key === 'Backspace' && !otp[idx] && idx > 0) refs[idx - 1].current?.focus() };
  const resendOtp = () => { setResent(true); setTimer(30); setTimeout(() => setResent(false), 2000) };

  return <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', flexDirection: 'column' }}><StatusBar />
    <div style={{ padding: '8px 20px' }}><button onClick={onBack} className="tap" style={{ width: 40, height: 40, borderRadius: 20, background: T.fill, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ArrowLeft size={20} /></button></div>
    <div style={{ flex: 1, padding: '32px 24px 0' }}>
      <div className="fu" style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: T.blueBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><Shield size={28} style={{ color: T.blue }} /></div>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 6px' }}>Verify your number</h1>
        <p style={{ fontSize: 14, color: T.sec, margin: 0 }}>We sent a 6-digit code to</p>
        <p style={{ fontSize: 16, fontWeight: 700, margin: '4px 0 0' }}>+233 {phone}</p>
      </div>
      <div className="fu stg1" style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
        {otp.map((d, i) => (
          <input key={i} ref={refs[i]} value={d} onChange={e => handleChange(e.target.value, i)} onKeyDown={e => handleKey(e, i)}
            style={{ width: 48, height: 56, borderRadius: 12, border: `2px solid ${d ? T.blue : T.border}`, background: d ? T.blueBg : T.fill, textAlign: 'center', fontSize: 22, fontWeight: 700, color: T.text, transition: 'border .2s, background .2s' }}
            maxLength={1} inputMode="numeric" />
        ))}
      </div>
      {ld && <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}><RefreshCw size={20} className="sp" style={{ color: T.blue }} /></div>}
      <div className="fu stg2" style={{ textAlign: 'center' }}>
        {timer > 0 ? <p style={{ fontSize: 14, color: T.sec }}>Resend code in <b style={{ color: T.text }}>{timer}s</b></p>
          : <button onClick={resendOtp} className="tap" style={{ border: 'none', background: 'none', fontSize: 14, fontWeight: 700, color: T.blue }}>{resent ? 'Code resent!' : 'Resend Code'}</button>}
      </div>
    </div>
    <p style={{ padding: '0 24px 32px', textAlign: 'center', fontSize: 12, color: T.muted }}>Didn't receive the code? Check your SMS inbox</p>
  </div>;
};

export default OtpScreen;

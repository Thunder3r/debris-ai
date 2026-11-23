import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Plus, MessageSquare, Search, Settings, Crown, Sparkles, Send, Paperclip,
  Mic, Menu, X, ChevronDown, Bot, User, Zap, ShieldCheck, Image as ImageIcon,
  Globe, Code2, MoreHorizontal, ArrowUpRight, PanelLeftClose
} from 'lucide-react';
import './style.css';

const starter = [
  { role: 'assistant', content: "Hey! I'm DEBRIS, your personal AI. What are we building today?" }
];

function App() {
  const [messages, setMessages] = useState(starter);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showPlans, setShowPlans] = useState(false);
  const [toast, setToast] = useState('');
  const [chats, setChats] = useState(['New conversation']);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, busy]);
  useEffect(() => {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
  }, []);

  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2600); };
  const newChat = () => { setMessages(starter); setInput(''); setChats(c => ['New conversation', ...c].slice(0, 8)); setMenuOpen(false); };
  const send = async (text = input) => {
    const value = text.trim();
    if (!value || busy) return;
    const next = [...messages, { role: 'user', content: value }];
    setMessages(next); setInput(''); setBusy(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.filter(m => m.role !== 'assistant' || m.content !== starter[0].content) })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Something went wrong.');
      setMessages(m => [...m, { role: 'assistant', content: data.reply }]);
    } catch (e) {
      setMessages(m => [...m, { role: 'assistant', content: `**DEBRIS setup note:** ${e.message}\n\nYour interface is ready. Add your API key to the server `.concat('`.env`') + ' file to turn on live AI replies.' }]);
    } finally { setBusy(false); }
  };

  const suggestions = [
    { icon: <Sparkles size={17}/>, title: 'Brainstorm ideas', sub: 'Explore something creative', prompt: 'Help me brainstorm a creative project idea.' },
    { icon: <Code2 size={17}/>, title: 'Write some code', sub: 'Build or debug a project', prompt: 'Help me start a small coding project.' },
    { icon: <Globe size={17}/>, title: 'Explain a topic', sub: 'Make learning simpler', prompt: 'Explain an interesting topic in simple words.' },
    { icon: <ImageIcon size={17}/>, title: 'Create an image prompt', sub: 'Turn an idea into a prompt', prompt: 'Help me write a detailed AI image-generation prompt.' }
  ];

  return <div className="app-shell">
    {sidebarOpen && <aside className="sidebar">
      <div className="brand-row"><div className="brand-mark">D</div><div><div className="brand-name">DEBRIS</div><div className="brand-sub">PERSONAL AI</div></div><button className="icon-btn close-side" onClick={() => setSidebarOpen(false)}><PanelLeftClose size={17}/></button></div>
      <button className="new-chat" onClick={newChat}><Plus size={17}/> New chat <span>⌘ K</span></button>
      <div className="side-label">WORKSPACE</div>
      <button className="side-link active"><MessageSquare size={17}/> Chat</button>
      <button className="side-link" onClick={() => notify('Search is coming in the next build.')}><Search size={17}/> Search chats</button>
      <div className="side-label recent-label">RECENT</div>
      <div className="chat-list">{chats.map((c,i)=><button key={i} className="chat-item" onClick={newChat}><MessageSquare size={15}/><span>{i===0 && messages.length>1 ? messages.find(m=>m.role==='user')?.content?.slice(0,23) || c : c}</span></button>)}</div>
      <div className="sidebar-bottom">
        <div className="upgrade-card"><div className="upgrade-icon"><Crown size={17}/></div><div className="upgrade-title">Unlock DEBRIS Pro</div><p>More power for bigger ideas.</p><button onClick={() => setShowPlans(true)}>Explore plans <ArrowUpRight size={14}/></button></div>
        <button className="profile-row" onClick={() => setMenuOpen(!menuOpen)}><div className="avatar owner-avatar">O</div><div className="profile-text"><b>Owner account</b><span>Pro access · Free</span></div><MoreHorizontal size={18}/></button>
      </div>
    </aside>}
    <main className="main">
      <header className="topbar">
        <div className="top-left">{!sidebarOpen && <button className="icon-btn" onClick={() => setSidebarOpen(true)}><Menu size={19}/></button>}<span className="mobile-brand">DEBRIS</span><button className="model-pill" onClick={() => setMenuOpen(!menuOpen)}><span className="status-dot"></span> DEBRIS AI <ChevronDown size={14}/></button></div>
        <div className="top-actions"><div className="plan-chip"><Crown size={13}/> PRO</div><button className="icon-btn" onClick={() => setShowPlans(true)} title="Plans"><Settings size={18}/></button></div>
      </header>
      {menuOpen && <div className="model-menu"><b>DEBRIS AI</b><span>Personal assistant · v1.0</span><button onClick={() => {setMenuOpen(false);notify('Owner access is enabled in this starter preview.')}}><ShieldCheck size={15}/> Owner access</button></div>}
      <section className="conversation">
        {messages.length === 1 ? <div className="welcome">
          <div className="hero-orb"><div className="orb-core">D</div><div className="orb-ring ring-one"></div><div className="orb-ring ring-two"></div><Sparkles className="orb-spark" size={20}/></div>
          <div className="eyebrow"><span></span> YOUR PERSONAL AI IS READY</div>
          <h1>Hey, what’s on<br/><em>your mind?</em></h1>
          <p className="welcome-copy">I'm DEBRIS. Think of me as your creative partner,<br className="desktop-break"/> problem solver, and second brain.</p>
          <div className="suggestion-grid">{suggestions.map((s,i)=><button className="suggestion" key={i} onClick={() => send(s.prompt)}><div className="suggestion-icon">{s.icon}</div><div><b>{s.title}</b><span>{s.sub}</span></div><ArrowUpRight size={15} className="suggest-arrow"/></button>)}</div>
        </div> : <div className="message-list">{messages.map((m,i)=><div className={`message ${m.role}`} key={i}><div className={`message-avatar ${m.role}`} >{m.role==='assistant'?<Bot size={18}/>:<User size={17}/>}</div><div className="message-body"><div className="message-name">{m.role==='assistant'?'DEBRIS':'You'}</div><div className="message-content">{m.content.split('\n').map((line,j)=><p key={j}>{line.replace(/\*\*/g,'')}</p>)}</div></div></div>)}{busy && <div className="message assistant"><div className="message-avatar assistant"><Bot size={18}/></div><div className="message-body"><div className="message-name">DEBRIS</div><div className="typing"><i></i><i></i><i></i></div></div></div>}<div ref={endRef}/></div>}
      </section>
      <div className="composer-wrap">
        <div className="composer">
          <textarea ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}}} placeholder="Message DEBRIS..." rows="1"/>
          <div className="composer-bottom"><div className="composer-tools"><button className="tool-btn" onClick={() => notify('File uploads are coming soon.')}><Paperclip size={17}/><span>Attach</span></button><button className="tool-btn" onClick={() => notify('Voice mode is planned for the next version.')}><Mic size={17}/></button></div><div className="send-area"><span className="model-hint">DEBRIS AI</span><button className="send-btn" disabled={!input.trim()||busy} onClick={()=>send()}><Send size={17}/></button></div></div>
        </div>
        <div className="disclaimer">DEBRIS can make mistakes. Check important information. <span>Built for your world ✦</span></div>
      </div>
    </main>
    {showPlans && <div className="modal-backdrop" onClick={()=>setShowPlans(false)}><div className="plans-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setShowPlans(false)}><X size={19}/></button><div className="modal-kicker"><Crown size={15}/> DEBRIS MEMBERSHIP</div><h2>Choose your power.</h2><p className="modal-sub">A simple plan structure for the DEBRIS community.</p><div className="plan-options"><div className="plan-option"><div className="plan-heading">FREE <span>STARTER</span></div><div className="plan-price">₹0 <small>/ forever</small></div><p>Everyday AI essentials</p><ul><li>Basic AI chat</li><li>Standard response limits</li><li>Chat history</li></ul><button className="secondary-plan" onClick={()=>setShowPlans(false)}>Current plan</button></div><div className="plan-option featured"><div className="plan-heading">PRO <span>POPULAR</span></div><div className="plan-price">₹199 <small>/ month · example price</small></div><p>More room to create</p><ul><li>Higher AI usage limits</li><li>Advanced tools when enabled</li><li>Priority features</li></ul><button className="primary-plan" onClick={()=>notify('Payments are not connected yet. Add a payment provider before launch.')}>Coming soon</button></div></div><div className="owner-note"><ShieldCheck size={16}/> Owner account: Pro access is free in this starter build.</div><p className="legal-note">Subscription checkout, account verification, taxes and refunds must be configured before accepting payments.</p></div></div>}
    {toast && <div className="toast">{toast}</div>}
  </div>;
}

createRoot(document.getElementById('root')).render(<App/>);
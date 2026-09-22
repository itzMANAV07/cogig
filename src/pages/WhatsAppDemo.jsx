import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';

// Authentic WhatsApp Web / Mobile Sound Synthesizer via Web Audio API
function playSound(type = 'receive') {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'send') {
      // Light WhatsApp outgoing pop
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.06);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.06);
    } else if (type === 'receive') {
      // WhatsApp incoming double-chime
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.setValueAtTime(1050, ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.16);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.16);
    }
  } catch (e) {
    // AudioContext blocked or not supported
  }
}

// Speak vernacular text using Web Speech API if supported
function speakText(text, lang = 'kn-IN') {
  try {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  } catch (e) {
    // ignore
  }
}

export default function WhatsAppDemo() {
  const navigate = useNavigate();

  // Mode: 'mobile' or 'web'
  const [viewMode, setViewMode] = useState('mobile');
  // Worker Scenarios: 'dispatch', 'checkin', 'voice', 'welfare'
  const [scenario, setScenario] = useState('dispatch');
  // Sound FX toggle
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Chat message state
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [audioProgress, setAudioProgress] = useState(0);

  const messagesEndRef = useRef(null);

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Load initial messages when scenario changes
  useEffect(() => {
    resetScenario(scenario);
  }, [scenario]);

  const resetScenario = (scen) => {
    window.speechSynthesis?.cancel();
    setPlayingAudioId(null);
    setAudioProgress(0);

    if (scen === 'dispatch') {
      setMessages([
        {
          id: 101,
          sender: 'bot',
          time: '09:15 AM',
          text: `🔔 *ಹೊಸ ಕೆಲಸದ ಆಫರ್ / NEW GIG DISPATCH #BK-4587*\n\nನಮಸ್ಕಾರ ರಮೇಶ್ ಕುಮಾರ್ (Ramesh Kumar),\nSri Basaveshwara Labour Co-op Fair Allocation Engine has matched you to an active requirement in Davangere:\n\n📍 *Site Address*: Vidyanagar Main Road, Davangere (1.2 km away)\n🔧 *Trade Role*: AC Repair & Piping Leakage\n⏱️ *Client Preferred Time*: Today Morning (Sub-30m SLA)\n🏢 *Client*: Priya Sharma (Verified Household)\n\n💰 *YOUR GUARANTEED NET PAYOUT*: *₹511.50* (93% Direct)\n🏦 *Welfare Fund Allocation*: *₹27.50* (5%)\n🛡️ *0% Platform Take-Rate* (Governed by ICA Principle 3)\n\nDo you accept this assignment?`,
          quickReplies: [
            { text: '✅ Accept Gig (₹511.50 Guaranteed)', action: 'worker_accept' },
            { text: '❌ Pass to Next Cooperative Member', action: 'worker_decline' },
          ],
        },
      ]);
    } else if (scen === 'checkin') {
      setMessages([
        {
          id: 201,
          sender: 'bot',
          time: '07:30 AM',
          text: `🌅 *ದೈನಂದಿನ ಚೆಕ್-ಇನ್ / DAILY MORNING CHECK-IN*\n\nGood morning Ramesh Kumar!\nCooperative Roster: *Sri Basaveshwara Labour Co-op (KA-08)*\nLinked e-Shram UAN: *2847 8812 3901*\n\nAre you available for plumbing and AC repair dispatches in Davangere Hub today?`,
          quickReplies: [
            { text: '🟢 Yes, Available Today (Mark Online)', action: 'checkin_available' },
            { text: '🔴 Not Available Today (Take Leave)', action: 'checkin_offline' },
          ],
        },
      ]);
    } else if (scen === 'voice') {
      setMessages([
        {
          id: 301,
          sender: 'bot',
          time: '10:02 AM',
          text: `🎙️ *ಕನ್ನಡ ಮತ್ತು ಹಿಂದಿ ವಾಯ್ಸ್ ಇಂಟರ್ಫೇಸ್ / VERNACULAR PTT AUDIO*\n\nCoGig WhatsApp Dispatch operates completely via voice notes for informal workers who prefer not to read English. Tap a sample voice note below:`,
          quickReplies: [
            { text: '🗣️ Send Kannada Audio: "ಕೆಲಸ ಮುಗಿದಿದೆ" (Work Done)', action: 'send_kannada_voice' },
            { text: '🗣️ Send Hindi Audio: "काम पूरा हो गया" (Work Done)', action: 'send_hindi_voice' },
          ],
        },
      ]);
    } else if (scen === 'welfare') {
      setMessages([
        {
          id: 401,
          sender: 'bot',
          time: '08:45 AM',
          text: `🏦 *ರಮೇಶ್ ಕುಮಾರ್ - ಸಹಕಾರಿ ಖಾತೆ ವಿವರಗಳು / WORKER COOPERATIVE PASSBOOK*\n\nMember Name: *Ramesh Kumar*\nCooperative Society: *Sri Basaveshwara Labour Co-op*\nRegistration: *MSCS/CR/2026/KA-08 · NCDC Recognized*\n\nChoose an inquiry:`,
          quickReplies: [
            { text: '💰 View This Week\'s Earnings (93%)', action: 'view_earnings' },
            { text: '🏦 View Welfare Fund & Insurance (5%)', action: 'view_welfare' },
            { text: '★ View Year-End Patronage Dividend (AGM)', action: 'view_dividend' },
          ],
        },
      ]);
    }
  };

  const handleAction = (action, label) => {
    if (soundEnabled) playSound('send');

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: label,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      if (soundEnabled) playSound('receive');

      if (action === 'worker_accept') {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: `🎉 *GIG ACCEPTED & LOCKED! (Contract #BK-4587)*\n\nClient *Priya Sharma* has been notified that you are en-route. Escrow of ₹550 is safely locked.\n\n📸 *Digital Proof of Work Requirement*:\nWhen you reach the site at Vidyanagar, please send a camera photo of the damaged pipe/AC BEFORE beginning work:`,
            quickReplies: [
              { text: '📍 Arrived at Site & Send "Before" Photo', action: 'send_photo_before' },
            ],
          },
        ]);
      } else if (action === 'send_photo_before') {
        // Send user photo
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            image: '/wall-before.png',
            text: '📸 Before repair photo: Leaking main valve pipe inspection on-site.',
          },
          {
            id: Date.now() + 2,
            sender: 'bot',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: `✓ *Before-repair photo timestamped and synced to contract #BK-4587!*\nClient can view this on their portal. You are clear to begin repair work.\n\nWhen work is finished, send the after-repair photo to trigger instant payment:`,
            quickReplies: [
              { text: '🏁 Send "After" Photo & Request Payout', action: 'send_photo_after' },
            ],
          },
        ]);
      } else if (action === 'send_photo_after') {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            image: '/wall-after.png',
            text: '📸 Work finished: Leak sealed with high-pressure joint and tested.',
          },
          {
            id: Date.now() + 2,
            sender: 'bot',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: `🎉 *CLIENT INSPECTED & APPROVED MILESTONE!*\n\n💸 *INSTANT UPI SETTLEMENT RELEASED (0s SLA)*:\n━━━━━━━━━━━━━━━━━━━━\n• *₹511.50* transferred to your UPI (*ramesh.kumar@upi*)\n• *₹27.50* deposited into your 5% Welfare Fund balance\n• *₹30.00* estimated Year-End Patronage Dividend (AGM pool)\n• *₹0.00* platform extraction fee (Cost recovery only)\n━━━━━━━━━━━━━━━━━━━━\n⭐ Client Feedback: *5.0 ★*\n*"Ramesh arrived quickly, wore his cooperative badge, and did high quality repair without asking for cash!"*`,
            quickReplies: [
              { text: '💰 View Updated Wallet Balance', action: 'view_earnings' },
              { text: '🟢 Stay Online for Next Job', action: 'checkin_available' },
            ],
          },
        ]);
      } else if (action === 'worker_decline') {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: `Understood Ramesh. The assignment has been routed to the next available cooperative member (*Suresh Yadav*) via the Fair Allocation Engine.\n\n*Democratic Protection*: Your cooperative ranking is NEVER penalized for declining a gig.`,
            quickReplies: [
              { text: '🟢 Keep Me Available for Afternoon Slots', action: 'checkin_available' },
            ],
          },
        ]);
      } else if (action === 'checkin_available') {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: `✅ *STATUS: ONLINE & ACTIVE IN DAVANGERE HUB*\n\n• GPS Service Radius: *15.0 km (Davangere Urban)*\n• Verified Trades: *AC Tech & Painting (NSQF-4)*\n• Max Waiting Time Watchdog: *Active (Priority boost if idle > 30m)*\n\nYou will receive a WhatsApp message as soon as a customer request is dispatched!`,
            quickReplies: [
              { text: '🔔 Simulate Receiving Job Dispatch #BK-4587', action: 'simulate_job' },
            ],
          },
        ]);
      } else if (action === 'checkin_offline') {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: `🔴 *STATUS: OFFLINE / ON LEAVE*\n\nYou are marked unavailable for today. Have a restful day! You can type *"online"* anytime to resume receiving dispatches.`,
            quickReplies: [
              { text: '🟢 Go Online Now', action: 'checkin_available' },
            ],
          },
        ]);
      } else if (action === 'simulate_job') {
        resetScenario('dispatch');
      } else if (action === 'view_earnings') {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: `📊 *YOUR EARNINGS SUMMARY (Week of Sep 22)*:\n━━━━━━━━━━━━━━━━━━━━\n• *Completed Gigs*: 6 jobs\n• *Direct 93% Net Pay*: *₹3,069.00*\n• *Instant UPI Settlements*: 6 of 6 successful\n• *Average Rating*: *4.9 ★*\n• *Surge Windfall Retained*: 100% (No platform commission)\n━━━━━━━━━━━━━━━━━━━━\nNext direct bank reconciliation: *Instantaneous per job*.`,
            quickReplies: [
              { text: '🏦 View Welfare Fund (5%)', action: 'view_welfare' },
              { text: '★ View Year-End Dividend Pool', action: 'view_dividend' },
            ],
          },
        ]);
      } else if (action === 'view_welfare') {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: `🏥 *MEMBER WELFARE FUND BALANCE (ICA Principle 5)*:\n━━━━━━━━━━━━━━━━━━━━\n• *Accumulated Fund Balance*: *₹4,227.50*\n• *Health Insurance*: ₹1,00,000 Hospitalization Coverage (*Active*)\n• *Accidental Cover*: ₹2,00,000 PMSBY Policy (*Active*)\n• *Emergency Credit Eligibility*: Up to ₹5,000 at 0% interest\n━━━━━━━━━━━━━━━━━━━━\nFunded entirely by the democratic 5% allocation from completed gigs.`,
            quickReplies: [
              { text: '★ View Year-End Patronage Dividend', action: 'view_dividend' },
            ],
          },
        ]);
      } else if (action === 'view_dividend') {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: `★ *YEAR-END PATRONAGE DIVIDEND (सहकारी लाभांश)*:\n━━━━━━━━━━━━━━━━━━━━\n• *Completed Gigs (FY26-27)*: 142 jobs\n• *Accumulated Dividend*: *₹4,260.00*\n• *Rate*: ~₹30 per completed gig\n• *Disbursement*: 31st March 2027 (At AGM)\n━━━━━━━━━━━━━━━━━━━━\n*Cooperative Democracy*: Because CoGig has no private venture shareholders, 100% of our 2% platform operating surplus is refunded to worker members!`,
            quickReplies: [
              { text: '💰 Back to Earnings', action: 'view_earnings' },
            ],
          },
        ]);
      } else if (action === 'send_kannada_voice') {
        const audioMsg = {
          id: Date.now() + 1,
          sender: 'user',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAudio: true,
          duration: '0:11',
          audioText: 'ನಮಸ್ಕಾರ, ನಾನು ದಾವಣಗೆರೆ ವಿದ್ಯಾನಗರ ಸೈಟ್‌ನಲ್ಲಿ ಕೆಲಸ ಮುಗಿಸಿದ್ದೇನೆ. ದಯವಿಟ್ಟು ಪೇಮೆಂಟ್ ರಿಲೀಸ್ ಮಾಡಿ.',
          lang: 'kn-IN',
        };
        setMessages((prev) => [...prev, audioMsg]);

        setTimeout(() => {
          if (soundEnabled) playSound('receive');
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + 2,
              sender: 'bot',
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isAudio: true,
              duration: '0:14',
              audioText: 'ಧನ್ಯವಾದಗಳು ರಮೇಶ್. ನಿಮ್ಮ ಕೆಲಸದ ಆಫ್ಟರ್ ಫೋಟೋ ಪರಿಶೀಲಿಸಲಾಗಿದೆ. ₹511.50 ನಿಮ್ಮ ಯುಪಿಐ ಖಾತೆಗೆ ಜಮೆಯಾಗಿದೆ.',
              text: `🎙️ *Voice Transcription (Kannada)*:\n"ಧನ್ಯವಾದಗಳು ರಮೇಶ್. ನಿಮ್ಮ ಕೆಲಸದ ಆಫ್ಟರ್ ಫೋಟೋ ಪರಿಶೀಲಿಸಲಾಗಿದೆ. ₹511.50 ನಿಮ್ಮ ಯುಪಿಐ ಖಾತೆಗೆ ಜಮೆಯಾಗಿದೆ."\n\n💸 *₹511.50 credited to UPI instantly.*`,
              lang: 'kn-IN',
            },
          ]);
        }, 1000);
      } else if (action === 'send_hindi_voice') {
        const audioMsg = {
          id: Date.now() + 1,
          sender: 'user',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAudio: true,
          duration: '0:10',
          audioText: 'नमस्ते! मैंने काम पूरा कर लिया है और फोटो अपलोड कर दिया है।',
          lang: 'hi-IN',
        };
        setMessages((prev) => [...prev, audioMsg]);

        setTimeout(() => {
          if (soundEnabled) playSound('receive');
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + 2,
              sender: 'bot',
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isAudio: true,
              duration: '0:13',
              audioText: 'नमस्ते रमेश! आपका डिजिटल प्रूफ ऑफ वर्क सत्यापित हो गया है। ₹511.50 आपके बैंक खाते में तुरंत ट्रांसफर कर दिए गए हैं।',
              text: `🎙️ *वॉइस ट्रांसक्रिप्शन (Hindi)*:\n"नमस्ते रमेश! आपका डिजिटल प्रूफ ऑफ वर्क सत्यापित हो गया है। ₹511.50 आपके बैंक खाते में तुरंत ट्रांसफर कर दिए गए हैं।"\n\n💸 *₹511.50 बैंक खाते में तुरंत क्रेडिट हो गए।*`,
              lang: 'hi-IN',
            },
          ]);
        }, 1000);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: `Received: "${label}". CoGig Worker Dispatch Bot is synced with Davangere Cooperative Hub.`,
          },
        ]);
      }
    }, 700);
  };

  const handleSendText = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const text = inputVal.trim();
    setInputVal('');

    if (soundEnabled) playSound('send');

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      if (soundEnabled) playSound('receive');

      const lower = text.toLowerCase();
      let botResponse = `CoGig Worker Dispatch: Message received from Member Ramesh Kumar. Sri Basaveshwara Labour Co-op (Davangere Hub).`;
      let replies = [
        { text: '🟢 Check In (Go Online)', action: 'checkin_available' },
        { text: '💰 View Earnings (93%)', action: 'view_earnings' },
      ];

      if (lower.includes('accept') || lower.includes('yes') || lower.includes('ha')) {
        botResponse = `✓ Assignment confirmed! Please send on-site Before-repair photo when you arrive at Vidyanagar.`;
        replies = [{ text: '📷 Send Before Photo', action: 'send_photo_before' }];
      } else if (lower.includes('earn') || lower.includes('pay') || lower.includes('money') || lower.includes('paisa')) {
        botResponse = `💰 *Your Net Take-Home*: 93% of every job is deposited directly via UPI with 0s latency! No venture capital deductions.`;
        replies = [{ text: '📊 View Full Ledger', action: 'view_earnings' }];
      } else if (lower.includes('welfare') || lower.includes('insurance') || lower.includes('bima')) {
        botResponse = `🏥 *5% Welfare Fund*: Your balance is ₹4,227.50 with ₹1L medical coverage and ₹2L PMSBY accidental cover active.`;
        replies = [{ text: '🏥 View Welfare Details', action: 'view_welfare' }];
      } else if (lower.includes('kannada') || lower.includes('kannad') || lower.includes('ನಮಸ್ಕಾರ')) {
        botResponse = `ನಮಸ್ಕಾರ ರಮೇಶ್! ದಾವಣಗೆರೆ ಲೇಬರ್ ಕೋಆಪರೇಟಿವ್ ಬಾಟ್ ಸಕ್ರಿಯವಾಗಿದೆ. ನೀವು ಧ್ವನಿ ಸಂದೇಶ ಕಳುಹಿಸಬಹುದು.`;
        replies = [{ text: '🗣️ Send Kannada Voice Note', action: 'send_kannada_voice' }];
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: botResponse,
          quickReplies: replies,
        },
      ]);
    }, 800);
  };

  const handleTogglePlayAudio = (msg) => {
    if (playingAudioId === msg.id) {
      window.speechSynthesis?.cancel();
      setPlayingAudioId(null);
      setAudioProgress(0);
    } else {
      setPlayingAudioId(msg.id);
      setAudioProgress(10);
      if (msg.audioText) {
        speakText(msg.audioText, msg.lang || 'kn-IN');
      }
      let prog = 10;
      const iv = setInterval(() => {
        prog += 18;
        if (prog >= 100) {
          clearInterval(iv);
          setPlayingAudioId(null);
          setAudioProgress(0);
        } else {
          setAudioProgress(prog);
        }
      }, 400);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Demo Control Toolbar */}
      <header className="bg-slate-950 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-2.5 py-1.5 rounded-xl transition-all"
          >
            <Icon name="ArrowLeft01Icon" size={14} />
            <span>CoGig Home</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-[#25D366] text-white">
              <Icon name="WhatsappIcon" size={18} />
            </span>
            <div>
              <h1 className="text-xs sm:text-sm font-extrabold text-white leading-tight flex items-center gap-1.5">
                <span>CoGig Worker Dispatch Bot</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.2 rounded font-mono">
                  WORKER-ONLY INTERFACE
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Workers require no app download — daily check-in, dispatch offers, PoW photos, and instant UPI happen on WhatsApp
              </p>
            </div>
          </div>
        </div>

        {/* Middle: Worker Flow Scenario Switcher */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-700/80 p-1 rounded-xl">
          <button
            onClick={() => setScenario('dispatch')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              scenario === 'dispatch'
                ? 'bg-[#008069] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🔔</span>
            <span>1. Gig Dispatch & Payout</span>
          </button>
          <button
            onClick={() => setScenario('checkin')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              scenario === 'checkin'
                ? 'bg-[#008069] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🌅</span>
            <span>2. Daily Morning Check-in</span>
          </button>
          <button
            onClick={() => setScenario('voice')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              scenario === 'voice'
                ? 'bg-[#008069] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🗣️</span>
            <span>3. Vernacular Voice PTT</span>
          </button>
          <button
            onClick={() => setScenario('welfare')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              scenario === 'welfare'
                ? 'bg-[#008069] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🏦</span>
            <span>4. Passbook & Dividend</span>
          </button>
        </div>

        {/* Right Tools: View Mode, Sound, Restart */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-1.5 rounded-lg border text-xs font-bold transition-colors ${
              soundEnabled
                ? 'bg-emerald-950/60 border-emerald-600 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}
            title="Toggle WhatsApp Audio FX"
          >
            {soundEnabled ? '🔊 Sound ON' : '🔇 Sound OFF'}
          </button>

          <button
            onClick={() => setViewMode(viewMode === 'mobile' ? 'web' : 'mobile')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition-all hidden md:flex items-center gap-1.5"
          >
            <span>{viewMode === 'mobile' ? '💻 Web View' : '📱 Mobile View'}</span>
          </button>

          <button
            onClick={() => resetScenario(scenario)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition-all"
            title="Reset Chat Simulation"
          >
            <span>↺</span>
            <span className="hidden sm:inline">Restart</span>
          </button>
        </div>
      </header>

      {/* Main Viewport Container */}
      <main className="flex-1 flex items-center justify-center p-2 sm:p-4 overflow-hidden bg-slate-950">
        {/* Smartphone Wrapper (in mobile mode) or Web Shell (in web mode) */}
        <div
          className={`w-full flex flex-col transition-all duration-300 ${
            viewMode === 'mobile'
              ? 'max-w-md h-[88vh] max-h-[820px] rounded-[32px] border-[6px] border-slate-700 shadow-2xl overflow-hidden relative bg-[#efeae2]'
              : 'max-w-4xl h-[88vh] max-h-[820px] rounded-2xl border border-slate-700 shadow-2xl overflow-hidden bg-[#efeae2]'
          }`}
        >
          {/* Mobile Phone Top Notch / Status Bar */}
          {viewMode === 'mobile' && (
            <div className="bg-[#008069] text-white px-5 pt-1.5 pb-0.5 text-[11px] font-bold flex items-center justify-between select-none shrink-0 border-b border-[#006a57]">
              <span>10:42</span>
              <div className="flex items-center gap-2">
                <span>📶 VoLTE</span>
                <span>📶 5G</span>
                <span>🔋 96%</span>
              </div>
            </div>
          )}

          {/* WhatsApp Header Bar (Authentic #008069 Teal-Green) */}
          <div className="bg-[#008069] text-white px-3 py-2 flex items-center justify-between shrink-0 shadow-sm select-none z-10">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                onClick={() => navigate('/')}
                className="hover:bg-white/10 p-1 rounded-full text-white transition-colors"
              >
                <Icon name="ArrowLeft01Icon" size={18} />
              </button>

              {/* Profile Avatar with Verified Badge */}
              <div className="relative shrink-0">
                <div className="size-10 rounded-full bg-slate-800 border-2 border-white/40 flex items-center justify-center text-white overflow-hidden shadow-xs">
                  <img src="/icon-192.png" alt="CoGig Logo" className="size-full object-cover" />
                </div>
                {/* WhatsApp Official Business Green Check Badge */}
                <span className="absolute -bottom-0.5 -right-0.5 size-4 rounded-full bg-[#25D366] text-white flex items-center justify-center text-[10px] font-bold border-2 border-[#008069]">
                  ✓
                </span>
              </div>

              {/* Name & Subtitle */}
              <div className="min-w-0 leading-tight">
                <div className="flex items-center gap-1">
                  <h2 className="text-sm font-bold text-white truncate">CoGig Worker Dispatch (ದಾವಣಗೆರೆ)</h2>
                </div>
                <p className="text-[11px] text-emerald-100 truncate font-medium">
                  {isTyping ? (
                    <span className="text-white font-bold animate-pulse">typing...</span>
                  ) : (
                    <span>Worker: Ramesh Kumar · UAN: 2847 8812 3901</span>
                  )}
                </p>
              </div>
            </div>

            {/* WhatsApp Top Right Action Icons */}
            <div className="flex items-center gap-3 text-white/90">
              <button className="hover:bg-white/10 p-1.5 rounded-full transition-colors" title="Video Call">
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z" />
                </svg>
              </button>
              <button className="hover:bg-white/10 p-1.5 rounded-full transition-colors" title="Voice Call">
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.4-1.1-.6-2.3-.6-3.5 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1z" />
                </svg>
              </button>
              <button className="hover:bg-white/10 p-1.5 rounded-full transition-colors" title="Menu">
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* WhatsApp Chat Body with Authentic Doodle Background Pattern */}
          <div
            className="flex-1 overflow-y-auto p-3 space-y-3 relative select-text"
            style={{
              backgroundColor: '#efeae2',
              backgroundImage: `radial-gradient(#cfc6ba 0.75px, transparent 0.75px)`,
              backgroundSize: '16px 16px',
            }}
          >
            {/* Encryption Notice Pill */}
            <div className="flex justify-center">
              <div className="bg-[#ffeecd] text-[#54656f] text-[10.5px] px-3 py-1 rounded-lg text-center max-w-xs shadow-2xs font-medium leading-snug border border-[#f5dfb8]">
                🔒 Worker dispatch session encrypted. Member identity: Ramesh Kumar (+91 98765 43210).
              </div>
            </div>

            {/* Date Pill */}
            <div className="flex justify-center my-1">
              <span className="bg-white/90 text-[#54656f] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-2xs">
                Today
              </span>
            </div>

            {/* Messages Loop */}
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5 animate-fadeIn`}
                >
                  {/* Bubble Container */}
                  <div
                    className={`relative max-w-[86%] sm:max-w-[78%] rounded-2xl p-2.5 shadow-2xs text-xs leading-relaxed ${
                      isUser
                        ? 'bg-[#d9fdd3] text-[#111b21] rounded-tr-xs'
                        : 'bg-white text-[#111b21] rounded-tl-xs'
                    }`}
                  >
                    {/* Optional Image (Proof of Work photos) */}
                    {msg.image && (
                      <div className="mb-2 overflow-hidden rounded-xl border border-black/10">
                        <img
                          src={msg.image}
                          alt="Work Photo"
                          className="w-full h-44 object-cover hover:scale-105 transition-transform cursor-pointer"
                        />
                      </div>
                    )}

                    {/* Audio Voice Note Bubble (PTT) */}
                    {msg.isAudio ? (
                      <div className="flex items-center gap-3 py-1 min-w-[200px] sm:min-w-[240px]">
                        <button
                          type="button"
                          onClick={() => handleTogglePlayAudio(msg)}
                          className="size-10 shrink-0 rounded-full bg-[#008069] text-white flex items-center justify-center hover:bg-[#006a57] transition-all shadow-xs active:scale-95"
                        >
                          {playingAudioId === msg.id ? (
                            <span className="font-bold text-base">⏸</span>
                          ) : (
                            <span className="font-bold text-base pl-0.5">▶</span>
                          )}
                        </button>

                        <div className="flex-1 space-y-1">
                          {/* Audio Waveform Simulator */}
                          <div className="flex items-center gap-0.5 h-6">
                            {[12, 24, 18, 28, 14, 20, 30, 22, 16, 26, 18, 12, 24, 16, 20, 14].map((h, i) => {
                              const isPast = playingAudioId === msg.id && i * 6 <= audioProgress;
                              return (
                                <div
                                  key={i}
                                  className={`w-1 rounded-full transition-all ${
                                    isPast ? 'bg-[#008069]' : 'bg-[#aebac1]'
                                  }`}
                                  style={{ height: `${h}px` }}
                                />
                              );
                            })}
                          </div>

                          <div className="flex justify-between text-[10px] text-[#667781] font-semibold">
                            <span>{playingAudioId === msg.id ? 'Playing...' : msg.duration || '0:14'}</span>
                            <span className="text-[#008069] font-bold">PTT Voice Note</span>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {/* Message Text Content */}
                    {msg.text && (
                      <div className="whitespace-pre-line font-medium text-[12px] sm:text-[13px] text-[#111b21]">
                        {msg.text}
                      </div>
                    )}

                    {/* Timestamp & Double Blue Ticks */}
                    <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-[#667781] font-medium select-none">
                      <span>{msg.time}</span>
                      {isUser && (
                        <span className="text-[#53bdeb] font-bold text-[11px] leading-none" title="Read">
                          ✓✓
                        </span>
                      )}
                    </div>
                  </div>

                  {/* WhatsApp Quick Reply Action Buttons */}
                  {msg.quickReplies && msg.quickReplies.length > 0 && (
                    <div className="flex flex-col gap-1.5 w-full max-w-[86%] sm:max-w-[78%]">
                      {msg.quickReplies.map((qr, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleAction(qr.action, qr.text)}
                          className="w-full bg-white hover:bg-slate-50 active:bg-slate-100 text-[#00a884] font-bold text-xs py-2 px-3 rounded-xl border border-slate-200/80 shadow-2xs transition-all text-center flex items-center justify-center gap-1.5 hover:shadow-xs active:scale-[0.98]"
                        >
                          <span>{qr.text}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* WhatsApp Typing Indicator Bubble */}
            {isTyping && (
              <div className="flex items-center gap-1.5 bg-white rounded-2xl rounded-tl-xs px-3 py-2 w-16 shadow-2xs">
                <span className="size-2 rounded-full bg-[#8696a0] animate-bounce" />
                <span className="size-2 rounded-full bg-[#8696a0] animate-bounce delay-150" />
                <span className="size-2 rounded-full bg-[#8696a0] animate-bounce delay-300" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* WhatsApp Bottom Input Bar */}
          <footer className="bg-[#f0f2f5] p-2 flex items-center gap-2 border-t border-slate-300 shrink-0 select-none">
            <button
              type="button"
              className="text-[#54656f] hover:text-[#111b21] p-1.5 rounded-full transition-colors"
              title="Emoji"
            >
              <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-3.5-9c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm7 0c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-3.5 5.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
              </svg>
            </button>

            <button
              type="button"
              className="text-[#54656f] hover:text-[#111b21] p-1.5 rounded-full transition-colors"
              title="Attach File / Photo"
            >
              <svg className="size-6 rotate-45" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 0 1 5 0v10.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5V6H9v9.5a3 3 0 0 0 6 0V5a4 4 0 0 0-8 0v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z" />
              </svg>
            </button>

            {/* Input Form */}
            <form onSubmit={handleSendText} className="flex-1 flex items-center">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Worker reply (e.g. 'accept', 'available', 'earnings', 'kannada')..."
                className="w-full bg-white rounded-xl px-3.5 py-2 text-xs text-[#111b21] placeholder:text-[#8696a0] focus:outline-none border border-slate-200"
              />
            </form>

            {/* Send or Mic Button */}
            {inputVal.trim() ? (
              <button
                type="button"
                onClick={handleSendText}
                className="size-9 rounded-full bg-[#00a884] hover:bg-[#008069] text-white flex items-center justify-center transition-all shadow-xs active:scale-95"
                title="Send Message"
              >
                <svg className="size-4 rotate-90" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  handleAction(
                    scenario === 'voice' ? 'send_kannada_voice' : 'send_photo_before',
                    scenario === 'voice' ? '🗣️ Kannada Voice Note' : '📷 Send Proof of Work Photo'
                  )
                }
                className="size-9 rounded-full bg-[#00a884] hover:bg-[#008069] text-white flex items-center justify-center transition-all shadow-xs active:scale-95"
                title="Voice Note / Camera"
              >
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
                </svg>
              </button>
            )}
          </footer>
        </div>
      </main>
    </div>
  );
}

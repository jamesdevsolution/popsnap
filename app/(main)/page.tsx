"use client"


import { useState } from "react";

const Landing = () => {
  return (
    <div className="font-[Figtree]">


      {/* MOCKUP SECTION */}
      <div className="min-h-auto lg:min-h-screen bg-[#eeecea] flex flex-col">

        {/* HERO, stacks vertically on mobile, side-by-side on lg+ */}
        <main className="flex flex-col lg:flex-row flex-1 items-center gap-20 lg:gap-10 px-5 sm:px-10 py-6 lg:py-8 max-w-[1600px] mx-auto w-full">

          {/* LEFT, MacBook Mockup */}
          <div className=" flex  items-center w-full">
            <MacBookMockup />
          </div>

          {/* RIGHT, Copy */}
          <div className="w-full lg:w-[360px] flex flex-col items-center text-center gap-4 sm:gap-5">
            <div className="text-3xl sm:text-4xl lg:text-6xl font-black leading-[1.05] tracking-tight text-[#111] extra-bold ">
              Your online photobooth everywhere
            </div>

            <p className="text-[#777] text-sm sm:text-base leading-relaxed font-semibold">
              Capture fun moments instantly with Snapstop
            </p>

            <a
              href="/photobooth"
              className="flex items-center gap-2.5 bg-[#111] text-white rounded-full px-8 py-3.5 sm:py-4 text-sm sm:text-base font-semibold hover:bg-[#333] transition-colors no-underline w-full justify-center"
            >
              Get Started
            </a>
          </div>
        </main>
      </div>

      {/* FEATURES SECTION */}
      <div className="min-h-auto bg-[#eeecea] py-20 px-5 sm:px-10">
        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(32px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .feature-card {
            opacity: 0;
            animation: fadeInUp 0.5s ease forwards;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          .feature-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 16px 40px rgba(0,0,0,0.08);
          }

          @keyframes stripPrint {
            0%, 100% { transform: translateY(0); }
            50%       { transform: translateY(6px); }
          }
          .anim-strip { animation: stripPrint 2s ease-in-out infinite; }

          @keyframes filterPulse {
            0%, 100% { opacity: 0.4; }
            50%       { opacity: 1; }
          }
          .anim-filter-dot  { animation: filterPulse 1.4s ease-in-out infinite; }
          .anim-filter-dot2 { animation: filterPulse 1.4s ease-in-out infinite 0.3s; }
          .anim-filter-dot3 { animation: filterPulse 1.4s ease-in-out infinite 0.6s; }

          @keyframes clockSpin {
            from { transform: rotate(0deg);   transform-origin: 45px 47px; }
            to   { transform: rotate(360deg); transform-origin: 45px 47px; }
          }
          .anim-clock-hand { transform-origin: 45px 47px; animation: clockSpin 3s linear infinite; }

          @keyframes starSpin {
            from { transform: rotate(0deg);   transform-origin: 60px 24px; }
            to   { transform: rotate(360deg); transform-origin: 60px 24px; }
          }
          .anim-star { transform-origin: 60px 24px; animation: starSpin 4s linear infinite; }

          @keyframes bgShift {
            0%, 100% { fill: #E43B37; }
            33%       { fill: #3B82F6; }
            66%       { fill: #10B981; }
          }
          .anim-bg { animation: bgShift 3s ease-in-out infinite; }

          @keyframes captionSlide {
            0%, 100% { transform: translateY(0); opacity: 1; }
            45%       { transform: translateY(-4px); opacity: 0; }
            55%       { transform: translateY(4px); opacity: 0; }
          }
          .anim-caption { animation: captionSlide 3s ease-in-out infinite; }

          @keyframes mirrorFlip {
            0%, 45%, 100% { transform: scaleX(1); }
            50%, 95%       { transform: scaleX(-1); }
          }
          .anim-mirror { animation: mirrorFlip 4s ease-in-out infinite; transform-origin: 45px 45px; }

          @keyframes stickerBounce {
            0%, 100% { transform: translate(-50%, -50%) scale(1); }
            50%       { transform: translate(-50%, -50%) scale(1.25) rotate(12deg); }
          }
          .anim-sticker { animation: stickerBounce 1.8s ease-in-out infinite; }

          @keyframes shieldPulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50%       { transform: scale(1.06); opacity: 0.85; }
          }
          .anim-shield { animation: shieldPulse 2s ease-in-out infinite; transform-origin: 45px 46px; }

          @keyframes downloadBounce {
            0%, 100% { transform: translateY(0); }
            50%       { transform: translateY(5px); }
          }
          .anim-dl { animation: downloadBounce 1.5s ease-in-out infinite; }

          @keyframes layoutCycle {
            0%, 30%   { opacity: 1; }
            33%, 63%  { opacity: 0; }
            66%, 96%  { opacity: 1; }
          }
          .anim-layout1 { animation: layoutCycle 4s ease-in-out infinite 0s; }
          .anim-layout2 { animation: layoutCycle 4s ease-in-out infinite 1.3s; }
          .anim-layout3 { animation: layoutCycle 4s ease-in-out infinite 2.6s; }
        `}</style>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-[1600px] mx-auto">
          {[
            {
              title: "Multiple Layouts",
              desc: "1×1, 1×2, 1×3, and 2×2 grids, pick the strip that fits your vibe.",
              icon: (
                <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
                  <g className="anim-layout1">
                    <rect x="33" y="12" width="24" height="66" rx="4" fill="#e8e8e8" />
                    <rect x="36" y="16" width="18" height="18" rx="2" fill="#d0d0d0" />
                    <rect x="36" y="38" width="18" height="18" rx="2" fill="#E43B37" opacity="0.4" />
                    <rect x="36" y="60" width="18" height="14" rx="2" fill="#d0d0d0" />
                  </g>
                  <g className="anim-layout2" style={{ opacity: 0 }}>
                    <rect x="15" y="20" width="26" height="50" rx="4" fill="#e8e8e8" />
                    <rect x="18" y="24" width="20" height="20" rx="2" fill="#d0d0d0" />
                    <rect x="18" y="46" width="20" height="20" rx="2" fill="#E43B37" opacity="0.4" />
                    <rect x="49" y="20" width="26" height="50" rx="4" fill="#e8e8e8" />
                    <rect x="52" y="24" width="20" height="20" rx="2" fill="#d0d0d0" />
                    <rect x="52" y="46" width="20" height="20" rx="2" fill="#d0d0d0" />
                  </g>
                  <g className="anim-layout3" style={{ opacity: 0 }}>
                    <rect x="14" y="22" width="28" height="46" rx="4" fill="#e8e8e8" />
                    <rect x="17" y="26" width="22" height="38" rx="2" fill="#E43B37" opacity="0.3" />
                    <rect x="48" y="22" width="28" height="46" rx="4" fill="#e8e8e8" />
                    <rect x="51" y="26" width="22" height="38" rx="2" fill="#d0d0d0" />
                  </g>
                </svg>
              ),
            },
            {
              title: "Fun Filters",
              desc: "B&W, Warm, Cool, Vintage, and Fade applied in one tap.",
              icon: (
                <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
                  <rect x="18" y="18" width="54" height="54" rx="10" fill="#e8e8e8" />
                  <circle cx="33" cy="33" r="6" fill="#d0d0d0" />
                  <circle cx="45" cy="33" r="6" fill="#E43B37" className="anim-filter-dot" opacity="0.4" />
                  <circle cx="57" cy="33" r="6" fill="#d0d0d0" />
                  <circle cx="33" cy="45" r="6" fill="#d0d0d0" />
                  <circle cx="45" cy="45" r="6" fill="#E43B37" className="anim-filter-dot2" opacity="0.7" />
                  <circle cx="57" cy="45" r="6" fill="#d0d0d0" />
                  <circle cx="33" cy="57" r="6" fill="#d0d0d0" />
                  <circle cx="45" cy="57" r="6" fill="#d0d0d0" />
                  <circle cx="57" cy="57" r="6" fill="#E43B37" className="anim-filter-dot3" opacity="0.3" />
                </svg>
              ),
            },
            {
              title: "Countdown Timer",
              desc: "3, 5, or 10 seconds, plenty of time to strike a pose.",
              icon: (
                <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
                  <circle cx="45" cy="47" r="28" fill="#e8e8e8" />
                  <circle cx="45" cy="47" r="22" fill="#f5f5f5" />
                  <line x1="45" y1="26" x2="45" y2="30" stroke="#ccc" strokeWidth="2" strokeLinecap="round" />
                  <line x1="45" y1="64" x2="45" y2="68" stroke="#ccc" strokeWidth="2" strokeLinecap="round" />
                  <line x1="24" y1="47" x2="28" y2="47" stroke="#ccc" strokeWidth="2" strokeLinecap="round" />
                  <line x1="62" y1="47" x2="66" y2="47" stroke="#ccc" strokeWidth="2" strokeLinecap="round" />
                  <line className="anim-clock-hand" x1="45" y1="47" x2="58" y2="47" stroke="#E43B37" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="45" y1="47" x2="45" y2="34" stroke="#555" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="45" cy="47" r="3" fill="#E43B37" />
                  <rect x="40" y="16" width="10" height="4" rx="2" fill="#d0d0d0" />
                </svg>
              ),
            },
            {
              title: "Stickers & Captions",
              desc: "Drag emoji stickers anywhere on your strip, add a caption too.",
              icon: (
                <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
                  <rect x="22" y="15" width="46" height="60" rx="5" fill="#e8e8e8" />
                  <rect x="26" y="19" width="38" height="24" rx="2" fill="#d0d0d0" />
                  <rect x="26" y="47" width="38" height="12" rx="2" fill="#d0d0d0" />
                  <rect x="26" y="62" width="28" height="5" rx="2" fill="#ddd" />
                  <text
                    className="anim-sticker"
                    x="55" y="34"
                    fontSize="18"
                    style={{ position: "absolute", transformOrigin: "55px 30px" }}
                  >🌟</text>
                </svg>
              ),
            },
            {
              title: "Custom Background",
              desc: "12 color presets plus a free-pick color wheel for the strip border.",
              icon: (
                <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
                  <rect x="15" y="15" width="60" height="60" rx="8" className="anim-bg" opacity="0.25" />
                  <rect x="22" y="22" width="46" height="46" rx="5" fill="#e8e8e8" />
                  <rect x="26" y="26" width="38" height="16" rx="2" fill="#d0d0d0" />
                  <rect x="26" y="46" width="38" height="16" rx="2" fill="#d0d0d0" />
                  <circle cx="32" cy="68" r="4" fill="#E43B37" opacity="0.7" />
                  <circle cx="42" cy="68" r="4" fill="#3B82F6" opacity="0.7" />
                  <circle cx="52" cy="68" r="4" fill="#10B981" opacity="0.7" />
                  <circle cx="62" cy="68" r="4" fill="#8B5CF6" opacity="0.7" />
                </svg>
              ),
            },
            {
              title: "Mirror Mode",
              desc: "Flip between mirrored and normal view while in the booth.",
              icon: (
                <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
                  <g className="anim-mirror">
                    <rect x="18" y="22" width="54" height="46" rx="6" fill="#e8e8e8" />
                    <line x1="45" y1="22" x2="45" y2="68" stroke="#E43B37" strokeWidth="2" strokeDasharray="4 3" opacity="0.6" />
                    <circle cx="33" cy="40" r="7" fill="#d0d0d0" />
                    <path d="M22 62 Q22 50 33 50 Q44 50 44 62" fill="#d0d0d0" />
                    <circle cx="57" cy="40" r="7" fill="#ccc" />
                    <path d="M46 62 Q46 50 57 50 Q68 50 68 62" fill="#ccc" />
                  </g>
                </svg>
              ),
            },
            {
              title: "Privacy First",
              desc: "Photos stay on your device. Nothing is ever uploaded.",
              icon: (
                <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
                  <g className="anim-shield">
                    <path d="M45 15 L70 26 L70 50 Q70 68 45 78 Q20 68 20 50 L20 26 Z" fill="#e8e8e8" />
                    <path d="M45 22 L63 31 L63 50 Q63 63 45 71 Q27 63 27 50 L27 31 Z" fill="#d8d8d8" />
                    <path d="M35 48 L42 56 L57 40" stroke="#E43B37" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
                  </g>
                </svg>
              ),
            },
            {
              title: "Instant Download",
              desc: "Save your strip as a PNG with one click, ready to share.",
              icon: (
                <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
                  <rect x="22" y="12" width="36" height="52" rx="4" fill="#e8e8e8" />
                  <rect x="26" y="16" width="28" height="16" rx="2" fill="#d0d0d0" />
                  <rect x="26" y="36" width="28" height="16" rx="2" fill="#d0d0d0" />
                  <g className="anim-dl">
                    <path d="M40 56 L40 72 M34 66 L40 73 L46 66" stroke="#E43B37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                  <rect x="16" y="74" width="48" height="6" rx="3" fill="#E43B37" opacity="0.2" />
                  <rect x="16" y="74" width="32" height="6" rx="3" fill="#E43B37" opacity="0.5" />
                </svg>
              ),
            },
            {
              title: "Live Preview",
              desc: "See your edits update in real-time before saving the final strip.",
              icon: (
                <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
                  <rect x="12" y="22" width="66" height="42" rx="6" fill="#e8e8e8" />
                  <rect x="16" y="26" width="58" height="34" rx="3" fill="#f5f5f5" />
                  <rect x="20" y="30" width="24" height="26" rx="2" fill="#d0d0d0" />
                  <rect x="48" y="30" width="22" height="12" rx="2" fill="#E43B37" opacity="0.3" />
                  <rect x="48" y="46" width="22" height="10" rx="2" fill="#d0d0d0" />
                  <rect x="30" y="68" width="30" height="6" rx="3" fill="#d0d0d0" />
                  <circle cx="20" cy="28" r="2" fill="#E43B37" opacity="0.6" />
                </svg>
              ),
            },
            {
              title: "Auto-Capture",
              desc: "Shoots all frames back to back automatically, no re-clicking needed.",
              icon: (
                <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
                  <rect x="14" y="28" width="62" height="40" rx="8" fill="#e8e8e8" />
                  <circle cx="45" cy="48" r="14" fill="#d0d0d0" />
                  <circle cx="45" cy="48" r="8" fill="#E43B37" opacity="0.4" />
                  <circle cx="45" cy="48" r="3" fill="#E43B37" opacity="0.8" />
                  <rect x="35" y="20" width="20" height="10" rx="4" fill="#d8d8d8" />
                  <circle cx="65" cy="35" r="4" fill="#ddd" />
                  <path d="M20 48 Q20 36 32 34" stroke="#E43B37" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="3 3" opacity="0.5" />
                  <path d="M70 48 Q70 36 58 34" stroke="#E43B37" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="3 3" opacity="0.5" />
                </svg>
              ),
            },
          ].map(({ title, desc, icon }, i) => (
            <div
              key={title}
              className="feature-card bg-white rounded-[18px] p-6 flex flex-col items-center text-center cursor-default"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="h-[100px] flex items-center justify-center mb-4">
                {icon}
              </div>
              <p className="text-[15px] font-extrabold text-[#111] mb-2">{title}</p>
              <p className="text-[12px] font-semibold text-[#999] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>


    </div>
  );
};

/* ── MacBook Shell with blank screen ── */
const MacBookMockup = () => {
  const [flashing, setFlashing] = useState(false);
  const [mockupIndex, setMockupIndex] = useState(3);

  const handleSnapstopClick = () => {
    if (flashing) return;
    setFlashing(true);
    setMockupIndex((prev) => (prev % 4) + 1);
    new Audio('/assets/shutter.mp3').play();
    setTimeout(() => setFlashing(false), 600);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <style>{`
        @keyframes cameraFlash {
          0%   { opacity: 0; }
          15%  { opacity: 1; }
          40%  { opacity: 0.8; }
          100% { opacity: 0; }
        }
        .flash-overlay {
          animation: cameraFlash 0.6s ease-out forwards;
        }
        @keyframes notchBlink {
          0%, 100% { background: #1a1a1a; }
          20%       { background: #22c55e; }
          50%       { background: #22c55e; }
          80%       { background: #1a1a1a; }
        }
        .notch-recording {
          animation: notchBlink 0.6s ease-out forwards;
        }
      `}</style>

      {/* Screen housing */}
      <div className="w-[95%] bg-black rounded-t-[10px] p-[7px] lg:p-[10px] pb-0">
        <div className="relative">

          {/* Notch */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 z-20 top-0 w-[17%] max-w-[160px] h-[15px] lg:h-[30px] rounded-b-[10px] flex items-center justify-center gap-1 transition-colors duration-150 ${flashing ? 'notch-recording bg-[#1a1a1a]' : 'bg-black'}`}
          >
            <div className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full transition-colors duration-100 ${flashing ? 'bg-green-400' : 'bg-[#333]'}`} />
          </div>

          {/* Display */}
          <div
            className="relative overflow-hidden rounded-t-[6px] bg-[#1c1c1e]"
            style={{ aspectRatio: "16 / 10" }}
          >
            {/* Flash overlay */}
            {flashing && (
              <div className="flash-overlay absolute inset-0 bg-white z-30 pointer-events-none" />
            )}

            {/* Wallpaper */}
            <div className="absolute inset-0">
              <img src="/assets/macos-wallpaper.png" className="object-fit w-full h-full" loading="lazy" />
            </div>

            {/* Menu bar */}
            <div
              className="relative z-10 flex items-center justify-between px-2 sm:px-3 h-[15px] lg:h-[30px] bg-black/[.18]"
              style={{ backdropFilter: "blur(12px)" }}
            >
              <div className="flex items-center gap-1.5 sm:gap-3">
                <svg viewBox="0 0 17 20" fill="white" className="opacity-85 w-[9px] h-[11px] lg:w-[14px] lg:h-[16px]">
                  <path d="M12.15 0c.12 1.17-.35 2.33-1.05 3.17-.71.84-1.85 1.5-2.97 1.41-.14-1.13.36-2.33 1.03-3.07C9.87.67 11.06.06 12.15 0zm3.56 6.82c-.09.05-2.12 1.22-2.1 3.63.02 2.88 2.54 3.87 2.57 3.88-.02.07-.4 1.37-1.33 2.72-.82 1.17-1.67 2.34-3.01 2.36-1.32.02-1.74-.78-3.25-.78s-1.99.76-3.24.8c-1.29.04-2.27-1.27-3.1-2.43C.55 14.72-.73 10.2 1.03 7.14c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.49.87 3.27.87.78 0 2.24-1.07 3.77-.91.64.03 2.45.26 3.61 1.95l-.09.08z" />
                </svg>
                {[21, 14, 17].map((w, i) => (
                  <div key={i} className="h-[6px] rounded-full bg-white/30" style={{ width: w }} />
                ))}
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                {[21, 14, 17].map((w, i) => (
                  <div key={i} className="h-[6px] rounded-full bg-white/30" style={{ width: w }} />
                ))}
              </div>
            </div>

            {/* Desktop, browser + dock */}
            <div className="relative z-10 flex items-end justify-center h-[calc(100%-15px)] lg:h-[calc(100%-30px)]">

              {/* Floating browser window */}
              <div
                className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[72%] rounded-[5px] sm:rounded-[8px] overflow-hidden border border-black/25"
                style={{ boxShadow: "0 6px 28px rgba(0,0,0,0.5)" }}
              >
                {/* Browser chrome */}
                <div className="flex items-center gap-1 sm:gap-2 px-1.5 sm:px-2.5 h-[12px] sm:h-[20px] bg-[#e8e8e8] border-b border-[#ccc]">
                  {/* Traffic lights */}
                  <div className="flex items-center gap-[3px]">
                    <div className="w-[5px] h-[5px] sm:w-[8px] sm:h-[8px] rounded-full bg-[#ff5f57]" />
                    <div className="w-[5px] h-[5px] sm:w-[8px] sm:h-[8px] rounded-full bg-[#febc2e]" />
                    <div className="w-[5px] h-[5px] sm:w-[8px] sm:h-[8px] rounded-full bg-[#28c840]" />
                  </div>
                  {/* Address bar */}
                  <div className="flex-1 flex items-center gap-1 bg-white/90 rounded-[2px] sm:rounded-[4px] px-1 sm:px-1.5 h-[7px] sm:h-[12px] border border-[#d0d0d0]">
                    <span className="text-[3.5px] sm:text-[7px] text-[#555] font-medium truncate leading-none">snapstop</span>
                  </div>
                </div>

                {/* Page content */}
                <div className="bg-black" style={{ aspectRatio: "16/9" }}>
                  <img src={`/assets/mockup-${mockupIndex}.png`} className="w-full h-full object-fit" />
                </div>
              </div>

              {/* Dock */}
              <div
                className="mb-2 sm:mb-3 flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-1 sm:py-1.5 bg-white/[.18] rounded-[12px] border-[0.5px] border-white/30"
                style={{ backdropFilter: "blur(20px)" }}
              >
                {[
                  { src: "/assets/finder-icon.png", label: "Finder" },
                  { src: "/assets/safari-icon.png", label: "Safari" },
                  { src: "/assets/settings-icon.png", label: "Settings" },
                ].map(({ src, label }) => (
                  <div
                    key={label}
                    title={label}
                    className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-[6px] sm:rounded-[9px] overflow-hidden flex items-center justify-center"
                  >
                    <img src={src} alt={label} className="w-full h-full object-contain" loading="lazy" />
                  </div>
                ))}
                <div className="w-px h-5 sm:h-6 bg-white/20 mx-0.5 sm:mx-1" />


                <div
                  onClick={handleSnapstopClick}
                  className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-[6px] sm:rounded-[9px] overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#fb923c] to-[#E43B37] transition-transform duration-150 ease-out hover:scale-125 hover:-translate-y-1 cursor-pointer"
                >
                  <img src="/assets/icon.png" alt="Snapstop" className="w-full h-full object-contain" loading="lazy" />
                </div>

                <div className='absolute bottom-[8px] right-[-65%] text-[#eeecea] font-[chewy]'>← Try it here</div>
              </div>
              {/* <div className='absolute bottom-[60px] right-[32%] text-[#eeecea] font-[chewy]'>↙ Try it here</div> */}
            </div>

          </div>
        </div>
      </div>

      {/* Chin */}
      <div className="w-full h-[15px] bg-gradient-to-b from-[#d0d0d0] to-[#b8b8b8] rounded-b-[8px]" />

      {/* Shadow */}
      <div
        className="w-[70%] h-[10px]"
        style={{ background: "radial-gradient(ellipse, rgba(0,0,0,0.13), transparent 70%)" }}
      />
    </div>
  );
};

export default Landing;
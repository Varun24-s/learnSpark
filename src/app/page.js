import Link from "next/link";
import { getUser } from "@/lib/auth";
import {
  Star,
  Rocket,
  LogIn,
  Volume2,
  Palette,
  ArrowRight,
  Smile,
  ShieldCheck,
  Lock,
  Trophy,
  BookOpen,
  HandMetal,
  Heart
} from "lucide-react";

export default async function LandingPage() {
  const user = await getUser();

  // Helper for that specific "Clay" shadow look to avoid the 'styled-jsx' error
  const clayShadow = "shadow-[inset_0_-6px_10px_rgba(0,0,0,0.05),0_15px_30px_rgba(0,0,0,0.08)]";

  return (
    <main className="relative min-h-dvh font-sans bg-[#F8FAFC] overflow-hidden antialiased text-[#2D3648]">
      {/* ── Background Soft Blobs ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-[#E0F7FA]/60 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-[#FFF3E0]/60 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[10%] w-[50%] h-[50%] bg-[#F3E5F5]/60 rounded-full blur-[120px]" />
      </div>

      {/* ════════════════════════════════
                  NAVIGATION
          ════════════════════════════════ */}
      <nav className="sticky top-6 z-[100] flex items-center justify-between gap-4 px-6 py-3 bg-white/70 backdrop-blur-md rounded-full mx-auto max-w-5xl border border-white shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-2 px-4 py-2 bg-[#E0F2F1] rounded-full border border-white shadow-sm">
          <Star className="text-[#009688]" size={20} fill="currentColor" />
          <span className="text-lg font-bold text-[#2D3648]">LearnSpark</span>
        </div>

        <div className="flex items-center gap-4">
          {/* <button className="hidden md:flex items-center gap-2 px-4 py-2 hover:bg-black/5 rounded-full font-bold text-sm transition-all">
            <Palette size={18} /> Activities
          </button>
          <button className="hidden md:flex items-center gap-2 px-4 py-2 hover:bg-black/5 rounded-full font-bold text-sm transition-all">
            <BookOpen size={18} /> How It Works
          </button> */}
          <Link
            href={user ? "/dashboard" : "/sign-in"}
            className="flex items-center gap-2 px-6 py-2 bg-[#B2EBF2] text-[#006064] rounded-full font-bold text-sm hover:scale-105 transition-all border border-white shadow-sm"
          >
            {user ? <Rocket size={18} /> : <LogIn size={18} />}
            <span>{user ? "Dashboard" : "Sign In"}</span>
          </Link>
        </div>
      </nav>

      {/* ════════════════════════════════
                  HERO SECTION
          ════════════════════════════════ */}
      <section className="relative z-10 flex flex-col items-center text-center px-8 pt-20 pb-32 max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-8"> {/* Container to ensure mascot stays centered */}
          <div className="relative w-28 h-28 bg-gradient-to-br from-[#FFCCBC] to-[#FFAB91] rounded-full shadow-[inset_0_-8px_15px_rgba(0,0,0,0.1),0_15px_35px_rgba(255,171,145,0.4)] border-[6px] border-white flex flex-col items-center justify-center">

            {/* Eyes */}
            <div className="flex gap-6 mb-2">
              <div className="w-2.5 h-2.5 bg-[#2D3648] rounded-full" />
              <div className="w-2.5 h-2.5 bg-[#2D3648] rounded-full" />
            </div>

            {/* Friendly Smile - Adjusted for a shallower, wider look */}
            <div className="w-12 h-6 mt-1 border-b-[3.5px] border-[#2D3648] rounded-[0_0_50px_50px]" />

          </div>

          {/* Badge Below Mascot */}
          <div className="mt-4 px-4 py-1 bg-[#E1F5FE] text-[#0288D1] rounded-full text-[10px] font-bold border border-white uppercase tracking-widest shadow-sm">
            Made for every child
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-[#2D3648] mb-6 tracking-tight leading-[1.1]">
          Learn, Play & <span className="text-[#4DB6AC]">Shine</span>
        </h1>

        <p className="text-lg md:text-xl text-[#718096] font-medium max-w-2xl mb-12 leading-relaxed">
          A cosy, safe space where every child can explore, discover, and grow — at their very own pace.
        </p>

        <div className="flex flex-col gap-4 w-full max-w-sm">
          <Link href="/sign-up" className="px-10 py-5 bg-[#A7FFEB] text-[#00695C] text-xl font-bold rounded-[2rem] shadow-[inset_0_-4px_0_rgba(0,0,0,0.1),0_10px_25px_rgba(167,255,235,0.5)] border-2 border-white hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
            <Star size={22} fill="currentColor" /> Start Learning Free
          </Link>
          <Link href="/sign-in" className="px-10 py-5 bg-[#FFCCBC] text-[#BF360C] text-xl font-bold rounded-[2rem] shadow-[inset_0_-4px_0_rgba(0,0,0,0.1),0_10px_25px_rgba(255,204,188,0.5)] border-2 border-white hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
            <Smile size={22} /> I Already Have an Account
          </Link>
        </div>

        {/* Hero Trust Badges */}
        <div className="mt-16 flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/50 rounded-full border border-white text-xs font-bold text-[#718096] shadow-sm">
            <ShieldCheck size={14} className="text-[#4DB6AC]" /> Safe for kids
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/50 rounded-full border border-white text-xs font-bold text-[#718096] shadow-sm">
            <Volume2 size={14} className="text-[#FFB74D]" /> Voice narrated
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/50 rounded-full border border-white text-xs font-bold text-[#718096] shadow-sm">
            <Heart size={14} className="text-[#F06292]" fill="currentColor" /> No ads ever
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
                  WHAT'S INSIDE
          ════════════════════════════════ */}
      <section className="relative z-10 px-8 py-24 max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <div className="flex justify-center mb-2"><BookOpen className="text-[#7E57C2]" /></div>
          <h2 className="text-4xl font-black text-[#2D3648] tracking-tight">What's Inside?</h2>
          <p className="text-[#718096] font-bold mt-2">Everything designed for little hands and big curiosity</p>
        </div>

        <div className="space-y-20">
          {/* Feature 1 */}
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className={`w-48 h-48 shrink-0 bg-[#E0F2F1] rounded-full border-[8px] border-white flex items-center justify-center ${clayShadow}`}>
              <HandMetal size={60} className="text-[#4DB6AC]" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-3xl font-black text-[#2D3648] mb-4">Big Touch Buttons</h3>
              <p className="text-lg text-[#718096] font-medium leading-relaxed">
                Huge, satisfying buttons made exactly for little fingers. No tiny targets, no frustration — every tap feels great.
              </p>
            </div>
          </div>

          {/* Feature 2 (Reverse) */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-16">
            <div className={`w-48 h-48 shrink-0 bg-[#FFF3E0] rounded-full border-[8px] border-white flex items-center justify-center ${clayShadow}`}>
              <Volume2 size={60} className="text-[#FFB74D]" />
            </div>
            <div className="text-center md:text-right">
              <h3 className="text-3xl font-black text-[#2D3648] mb-4">Voice Narration</h3>
              <p className="text-lg text-[#718096] font-medium leading-relaxed">
                A warm, friendly voice reads every word aloud — so children never need reading skills to explore on their own.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className={`w-48 h-48 shrink-0 bg-[#E1F5FE] rounded-full border-[8px] border-white flex items-center justify-center ${clayShadow}`}>
              <Star size={60} className="text-[#29B6F6]" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-3xl font-black text-[#2D3648] mb-4">Star Rewards</h3>
              <p className="text-lg text-[#718096] font-medium leading-relaxed">
                Every win is celebrated with shiny stars, bursts of colour, and joyful sounds that make kids want to keep going.
              </p>
            </div>
          </div>

          {/* Feature 4 (Reverse) */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-16">
            <div className={`w-48 h-48 shrink-0 bg-[#F3E5F5] rounded-full border-[8px] border-white flex items-center justify-center ${clayShadow}`}>
              <Lock size={60} className="text-[#AB47BC]" />
            </div>
            <div className="text-center md:text-right">
              <h3 className="text-3xl font-black text-[#2D3648] mb-4">Parent Controls</h3>
              <p className="text-lg text-[#718096] font-medium leading-relaxed">
                A secure long-press gate keeps all settings safe and sound — only grown-ups can get through.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
                  HOW DOES IT WORK (THE MAP)
          ════════════════════════════════ */}
      <section className="relative z-10 px-8 py-32 max-w-6xl mx-auto min-h-[80vh]">
        <div className="text-center mb-24">
          <div className="flex justify-center mb-2"><BookOpen className="text-[#7E57C2]" /></div>
          <h2 className="text-4xl font-black text-[#2D3648] tracking-tight">How Does It Work?</h2>
        </div>

        <div className="relative">
          {/* Curved S-Path SVG */}
          <svg className="absolute top-0 left-0 w-full h-full hidden md:block pointer-events-none" viewBox="0 0 1000 600" fill="none">
            <path
              d="M250 100 C 450 100, 650 100, 750 250 S 450 400, 250 550"
              stroke="#CBD5E0"
              strokeWidth="4"
              strokeDasharray="12 12"
              strokeLinecap="round"
            />
          </svg>

          {/* Roadmap Steps */}
          <div className="relative flex flex-col md:block min-h-[600px] space-y-20 md:space-y-0">

            {/* Step 1 */}
            <div className="md:absolute top-0 md:left-[15%] flex flex-col items-center group">
              <div className="relative">
                <div className="absolute -top-2 -right-6 w-8 h-8 rounded-full bg-white shadow-md border flex items-center justify-center font-bold text-xs">1</div>
                <div className={`w-28 h-28 bg-[#E0F2F1] rounded-full border-[6px] border-white flex items-center justify-center group-hover:scale-110 transition-transform ${clayShadow}`}>
                  <Star size={36} className="text-[#4DB6AC]" />
                </div>
              </div>
              <div className="mt-6 text-center max-w-[180px]">
                <h4 className="font-black text-lg mb-1">Sign Up</h4>
                <p className="text-sm text-[#718096] font-bold">Parents create a safe account in 30 seconds.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="md:absolute top-0 md:right-[15%] flex flex-col items-center group">
              <div className="relative">
                <div className="absolute -top-2 -right-6 w-8 h-8 rounded-full bg-white shadow-md border flex items-center justify-center font-bold text-xs">2</div>
                <div className={`w-28 h-28 bg-[#FFF3E0] rounded-full border-[6px] border-white flex items-center justify-center group-hover:scale-110 transition-transform ${clayShadow}`}>
                  <Palette size={36} className="text-[#FFB74D]" />
                </div>
              </div>
              <div className="mt-6 text-center max-w-[180px]">
                <h4 className="font-black text-lg mb-1">Choose Activity</h4>
                <p className="text-sm text-[#718096] font-bold">Pick from colours, numbers, shapes & more!</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="md:absolute top-[50%] md:left-[45%] flex flex-col items-center group">
              <div className="relative">
                <div className="absolute -top-2 -right-6 w-8 h-8 rounded-full bg-white shadow-md border flex items-center justify-center font-bold text-xs">3</div>
                <div className={`w-28 h-28 bg-[#E1F5FE] rounded-full border-[6px] border-white flex items-center justify-center group-hover:scale-110 transition-transform ${clayShadow}`}>
                  <Volume2 size={36} className="text-[#29B6F6]" />
                </div>
              </div>
              <div className="mt-6 text-center max-w-[180px]">
                <h4 className="font-black text-lg mb-1">Listen & Play</h4>
                <p className="text-sm text-[#718096] font-bold">The friendly voice guides every step.</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="md:absolute bottom-0 md:left-[15%] flex flex-col items-center group">
              <div className="relative">
                <div className="absolute -top-2 -right-6 w-8 h-8 rounded-full bg-white shadow-md border flex items-center justify-center font-bold text-xs">4</div>
                <div className={`w-28 h-28 bg-[#F3E5F5] rounded-full border-[6px] border-white flex items-center justify-center group-hover:scale-110 transition-transform ${clayShadow}`}>
                  <Trophy size={36} className="text-[#AB47BC]" />
                </div>
              </div>
              <div className="mt-6 text-center max-w-[180px]">
                <h4 className="font-black text-lg mb-1">Earn Stars</h4>
                <p className="text-sm text-[#718096] font-bold">Collect stars and grow your collection!</p>
              </div>
            </div>

          </div>
        </div>
      </section>



      <footer className="relative z-10 mt-20">
        {/* The "Curved Cloud" Transition */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-white rounded-t-[3rem] md:rounded-t-[6rem] -translate-y-1/2" />

        <div className="bg-white px-8 pt-12 pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

              {/* Brand Column */}
              <div className="md:col-span-1 flex flex-col items-start gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-[#E0F2F1] rounded-full border border-white shadow-sm">
                  <Star className="text-[#009688]" size={20} fill="currentColor" />
                  <span className="text-lg font-bold text-[#2D3648]">LearnSpark</span>
                </div>
                <p className="text-[#718096] font-medium text-sm leading-relaxed">
                  A gentle, sensory-friendly world where every child belongs. Crafted for little hands and big hearts.
                </p>
                <div className="flex gap-3 mt-2">
                  {/* Social Icons - Squishy Style */}
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`w-10 h-10 rounded-xl bg-[#F8FAFC] border-2 border-white flex items-center justify-center hover:scale-110 transition-transform cursor-pointer ${clayShadow}`}>
                      <Heart size={18} className="text-[#F06292]" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Links: Explore */}
              <div>
                <h4 className="font-black text-[#2D3648] mb-6 uppercase tracking-wider text-xs">Explore</h4>
                <ul className="space-y-4 text-[#718096] font-bold text-sm">
                  <li className="hover:text-primary transition-colors cursor-pointer">Colours & Shapes</li>
                  <li className="hover:text-primary transition-colors cursor-pointer">Numbers Game</li>
                  <li className="hover:text-primary transition-colors cursor-pointer">Daily Quests</li>
                  <li className="hover:text-primary transition-colors cursor-pointer">Audio Stories</li>
                </ul>
              </div>

              {/* Links: For Parents */}
              <div>
                <h4 className="font-black text-[#2D3648] mb-6 uppercase tracking-wider text-xs">For Parents</h4>
                <ul className="space-y-4 text-[#718096] font-bold text-sm">
                  <li className="hover:text-primary transition-colors cursor-pointer">Progress Dashboard</li>
                  <li className="hover:text-primary transition-colors cursor-pointer">Safety Features</li>
                  <li className="hover:text-primary transition-colors cursor-pointer">Expert Advice</li>
                  <li className="hover:text-primary transition-colors cursor-pointer">Support Hub</li>
                </ul>
              </div>

              {/* Newsletter/Updates Column */}
              <div className="bg-[#E1F5FE]/50 p-6 rounded-[2.5rem] border-2 border-white">
                <h4 className="font-black text-[#0288D1] mb-2 text-sm">Stay Sparkly!</h4>
                <p className="text-xs text-[#0288D1]/80 font-bold mb-4">Get new activities sent to your inbox.</p>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Your email"
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B2EBF2] text-sm"
                  />
                  <button className="absolute right-1 top-1 bottom-1 px-4 bg-[#B2EBF2] text-[#006064] rounded-xl font-black text-xs hover:bg-[#80DEEA] transition-colors">
                    Join
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Copyright Area */}
            <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex gap-8 text-[#A0AEC0] text-[10px] font-black tracking-widest uppercase">
                <span className="hover:text-[#2D3648] cursor-pointer">Privacy Policy</span>
                <span className="hover:text-[#2D3648] cursor-pointer">Terms of Play</span>
                <span className="hover:text-[#2D3648] cursor-pointer">Accessibility</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <p className="text-[#A0AEC0] text-[10px] font-black tracking-widest uppercase">
                  © 2026 LearnSpark • Crafted with Love
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
};

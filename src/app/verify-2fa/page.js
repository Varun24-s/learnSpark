import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ShieldCheck, Lock, Star, Sparkles, ArrowRight } from "lucide-react";

export default async function VerifyMFA() {
    async function handleVerify(formData) {
        "use server";
        const code = formData.get("code");
        const supabase = await createClient();

        // 1. Get the current challenge
        const { data: factors } = await supabase.auth.mfa.listFactors();
        const totpFactor = factors?.all?.find(f => f.factor_type === 'totp' && f.status === 'verified');

        if (!totpFactor) {
            redirect("/sign-in?message=No 2FA setup found.");
        }

        const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
            factorId: totpFactor.id
        });

        if (challengeError) return { error: challengeError.message };

        // 2. Verify the challenge
        const { data: verifyData, error: verifyError } = await supabase.auth.mfa.verify({
            factorId: totpFactor.id,
            challengeId: challenge.id,
            code
        });

        if (verifyError) {
            return { error: "Invalid code. Please try again." };
        }

        // 3. Success -> Dashboard
        const { data: { user } } = await supabase.auth.getUser();
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();

        if (profile?.role === "ADMIN") redirect("/dashboard/admin");
        if (profile?.role === "PARENT") redirect("/dashboard/parent");
        redirect("/dashboard/child");
    }

    return (
        <main className="relative min-h-dvh flex items-center justify-center p-6 overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[30%] left-[-10%] w-[400px] h-[400px] bg-emerald-100/20 rounded-full blur-[100px] animate-orb-drift" />
                <div className="absolute bottom-[30%] right-[-10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] animate-orb-drift [animation-delay:-3s]" />
            </div>

            <div className="relative z-10 w-full max-w-md glass-lg rounded-[3.5rem] p-12 text-center animate-fade-up">
                <div className="mb-10 flex flex-col items-center">
                    <div className="relative mb-6">
                        <div className="w-24 h-24 rounded-[2.5rem] bg-emerald-50 border-4 border-white shadow-clay flex items-center justify-center text-emerald-500 animate-float">
                            <ShieldCheck size={48} strokeWidth={1.5} />
                        </div>
                        <Sparkles className="absolute -top-2 -right-2 text-clay-yellow animate-sparkle-drift" size={24} fill="currentColor" />
                    </div>
                    <h1 className="text-3xl font-black text-text-dark mb-2 tracking-tight">Two-Step Login</h1>
                    <p className="text-text-mid font-extrabold text-lg opacity-80 leading-relaxed">
                        Enter the code from your Authenticator app to continue.
                    </p>
                </div>

                <form action={handleVerify} className="flex flex-col gap-8">
                    <div className="flex flex-col gap-4">
                        <div className="relative group">
                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-text-light group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                name="code"
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                placeholder="000000"
                                required
                                maxLength={6}
                                className="w-full bg-white border-2 border-slate-50 pl-16 pr-6 py-6 rounded-[2rem] text-3xl font-black tracking-[0.5em] text-center text-text-dark placeholder:text-text-light/30 focus:outline-none focus:border-primary focus:ring-[15px] focus:ring-primary/5 transition-all shadow-sm"
                            />
                        </div>
                        <p className="text-xs font-black text-text-light uppercase tracking-widest">Verification Code</p>
                    </div>

                    <button type="submit" className="bg-primary text-white py-6 rounded-[2rem] font-black text-xl shadow-clay-lg hover:bg-primary-deep hover:-translate-y-2 hover:shadow-clay-hover active:translate-y-0 transition-all cursor-pointer flex items-center justify-center gap-3">
                        Verify & Login <ArrowRight size={24} />
                    </button>

                    <div className="flex items-center justify-center gap-2 text-text-light/60 font-black text-xs uppercase tracking-tighter">
                        <Star size={12} fill="currentColor" /> Secure Session Protected
                    </div>
                </form>
            </div>
        </main>
    );
}

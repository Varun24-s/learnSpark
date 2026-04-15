import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { ShieldCheck, Smartphone, CheckCircle, ArrowLeft, Star, Sparkles, Lock } from "lucide-react";

export default async function MFAEnrollPage() {
    const profile = await getProfile();
    if (!profile) redirect("/sign-in");

    const supabase = await createClient();

    // 1. Check if already enrolled
    const { data: factors } = await supabase.auth.mfa.listFactors();
    const isEnrolled = factors?.all.some(f => f.status === 'verified');

    // 2. Start enrollment
    const { data: enrollData, error: enrollError } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        issuer: 'LearnSpark',
        friendlyName: profile.display_name
    });

    if (enrollError) {
        return <div className="min-h-dvh flex items-center justify-center font-black text-red-500">Error starting enrollment: {enrollError.message}</div>;
    }

    const qrCodeUri = enrollData.totp.qr_code;
    const factorId = enrollData.id;

    async function handleVerify(formData) {
        "use server";
        const code = formData.get("code");
        const fId = formData.get("factorId");
        const supabase = await createClient();

        const { error } = await supabase.auth.mfa.challengeAndVerify({
            factorId: fId,
            code
        });

        if (error) {
            return { error: error.message };
        }

        redirect("/dashboard/parent?message=MFA successfully enabled!");
    }

    return (
        <main className="relative min-h-dvh flex items-center justify-center p-6 overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-emerald-50/20 rounded-full blur-[120px] animate-orb-drift" />
                <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-orb-drift [animation-delay:-5s]" />
            </div>

            <div className="relative z-10 w-full max-w-lg glass-lg rounded-[3.5rem] p-10 sm:p-14 my-auto animate-fade-up">
                <Link href="/dashboard/parent" className="absolute top-10 left-10 flex items-center gap-2 text-sm font-black text-text-light hover:text-primary transition-all group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> BACK
                </Link>

                {isEnrolled ? (
                    <div className="text-center py-6 mt-6">
                        <div className="relative mb-8 flex justify-center">
                            <div className="w-28 h-28 rounded-[3rem] bg-emerald-50 border-4 border-white shadow-clay flex items-center justify-center text-emerald-500 animate-float">
                                <CheckCircle size={56} strokeWidth={1.5} />
                            </div>
                            <Sparkles className="absolute top-0 right-[35%] text-clay-yellow animate-sparkle-drift" size={28} fill="currentColor" />
                        </div>
                        <h1 className="text-4xl font-black text-text-dark mb-3 tracking-tight">Security Active!</h1>
                        <p className="text-xl font-extrabold text-text-mid opacity-80 mb-10 leading-relaxed">
                            Your account is now protected with Two-Factor Authentication.
                        </p>
                        <Link href="/dashboard/parent" className="block w-full py-6 bg-primary text-white rounded-[2rem] font-black text-xl shadow-clay-lg hover:shadow-clay-hover hover:-translate-y-2 transition-all active:scale-95">
                            Return to Dashboard
                        </Link>
                    </div>
                ) : (
                    <div className="mt-6">
                        <div className="text-center mb-10">
                            <div className="relative mb-6 flex justify-center">
                                <div className="w-24 h-24 rounded-[2.5rem] bg-emerald-50 border-4 border-white shadow-inner-clay flex items-center justify-center text-emerald-500 animate-float">
                                    <ShieldCheck size={48} strokeWidth={1.5} />
                                </div>
                                <Star className="absolute top-0 right-[35%] text-clay-yellow animate-sparkle-drift" size={24} fill="currentColor" />
                            </div>
                            <h1 className="text-3xl font-black text-text-dark mb-2 tracking-tight">Secure Your Space</h1>
                            <p className="text-text-mid font-extrabold text-lg opacity-80 leading-relaxed">
                                Scan the code with an Authenticator app (like Google or Authy).
                            </p>
                        </div>

                        <div className="flex justify-center p-8 bg-white rounded-[3rem] shadow-clay border-4 border-slate-50/50 mb-10 relative group">
                            <div className="absolute inset-0 bg-primary/5 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity" />
                            <QRCodeSVG value={qrCodeUri} size={220} className="relative z-10" />
                        </div>

                        <form action={handleVerify} className="flex flex-col gap-6">
                            <input type="hidden" name="factorId" value={factorId} />

                            <div className="flex flex-col gap-3">
                                <label className="text-[11px] font-black text-text-light flex items-center gap-2 ml-5 uppercase tracking-[0.1em]">
                                    <Smartphone size={14} /> VERIFICATION CODE
                                </label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-text-light" />
                                    <input
                                        type="text"
                                        name="code"
                                        placeholder="000000"
                                        required
                                        maxLength={6}
                                        inputMode="numeric"
                                        className="w-full bg-white border-2 border-slate-50 pl-16 pr-6 py-5 rounded-[2rem] text-2xl font-black tracking-[0.4em] text-center text-text-dark focus:outline-none focus:border-primary focus:ring-[15px] focus:ring-primary/5 transition-all shadow-sm"
                                    />
                                </div>
                            </div>

                            <button type="submit" className="bg-emerald-500 text-white py-6 rounded-[2rem] font-black text-xl shadow-clay-lg hover:bg-emerald-600 hover:-translate-y-2 hover:shadow-clay-hover active:translate-y-0 transition-all cursor-pointer flex items-center justify-center gap-3">
                                Verify & Activate <CheckCircle size={24} />
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-[10px] font-black text-text-light uppercase tracking-widest opacity-40">
                                Powered by LearnSpark Secure Guard
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

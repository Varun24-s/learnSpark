import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { LogIn, Mail, Lock, Star, Sparkles, Fingerprint } from "lucide-react";

export default async function SignInPage({ searchParams }) {
    const { message } = await searchParams;

    async function handleSignIn(formData) {
        "use server";
        const email = formData.get("email");
        const password = formData.get("password");

        // Admin hardcoded check
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            (await cookies()).set("admin_session", "true", {
                path: "/",
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24, // 1 day
            });
            return redirect("/dashboard/admin");
        }

        const supabase = await createClient();

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return { error: error.message };
        }

        const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
        if (factorsError) return { error: factorsError.message };

        const enrolledFactors = factors.all.filter(factor => factor.status === 'verified');
        if (enrolledFactors.length > 0) {
            redirect("/verify-2fa");
        }

        const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();

        if (profile?.role === "ADMIN") redirect("/dashboard/admin");
        if (profile?.role === "PARENT") redirect("/dashboard/parent");
        redirect("/dashboard/child");
    }

    return (
        <main className="relative min-h-dvh flex items-center justify-center p-6 overflow-hidden">
            {/* Background blobs */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-clay-peach/15 rounded-full blur-[120px] animate-orb-drift" />
                <div className="absolute bottom-[20%] left-[10%] w-[500px] h-[500px] bg-clay-lavender/15 rounded-full blur-[120px] animate-orb-drift [animation-delay:-4s]" />
            </div>

            <div className="relative z-10 w-full max-w-md glass-lg rounded-[3.5rem] p-10 sm:p-14 my-auto animate-fade-up">
                <div className="text-center mb-10">
                    <div className="flex flex-col items-center gap-4 mb-8">
                        <div className="relative">
                            <Star size={48} fill="#fcd34d" className="text-clay-yellow animate-float" />
                            <Sparkles className="absolute -top-2 -right-2 text-primary animate-sparkle-drift" size={24} />
                        </div>
                        <span className="text-2xl font-black tracking-tight text-text-dark font-display">LearnSpark</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl text-text-dark font-black mb-2">Welcome Back!</h1>
                    <p className="text-text-mid font-extrabold text-lg opacity-80">Continue your joyful learning journey.</p>
                </div>

                {message && (
                    <div className="mb-8 p-5 bg-emerald-50 border-2 border-emerald-100 rounded-[2rem] text-emerald-700 text-sm font-black text-center shadow-inner-clay">
                        {message}
                    </div>
                )}

                <form action={handleSignIn} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2.5">
                        <label className="text-[11px] font-black text-text-light flex items-center gap-2 ml-5 uppercase tracking-[0.1em]">
                            <Mail size={14} /> EMAIL
                        </label>
                        <input type="email" name="email" placeholder="spark@example.com" required className="bg-white border-2 border-slate-50 p-5 rounded-[2rem] text-text-dark placeholder:text-text-light focus:outline-none focus:border-primary focus:ring-[12px] focus:ring-primary/5 transition-all font-bold shadow-sm" />
                    </div>

                    <div className="flex flex-col gap-2.5">
                        <label className="text-[11px] font-black text-text-light flex items-center gap-2 ml-5 uppercase tracking-[0.1em]">
                            <Lock size={14} /> PASSWORD
                        </label>
                        <input type="password" name="password" placeholder="••••••••" required className="bg-white border-2 border-slate-50 p-5 rounded-[2rem] text-text-dark placeholder:text-text-light focus:outline-none focus:border-primary focus:ring-[12px] focus:ring-primary/5 transition-all font-bold shadow-sm" />
                    </div>

                    <button type="submit" className="mt-4 bg-primary text-white py-6 rounded-[2rem] font-black text-xl shadow-clay-lg hover:bg-primary-deep hover:-translate-y-2 hover:shadow-clay-hover active:translate-y-0 transition-all cursor-pointer flex items-center justify-center gap-3">
                        Sign In Now <LogIn size={24} />
                    </button>
                </form>

                <p className="text-center mt-12 text-sm font-black text-text-mid">
                    New to the platform? <Link href="/sign-up" className="text-primary hover:underline ml-1">Join Free</Link>
                </p>

                <div className="mt-8 pt-8 border-t border-slate-100 flex justify-center">
                    <div className="flex items-center gap-2 text-text-light/50 text-xs font-black">
                        <Fingerprint size={14} /> Secure Login Enabled
                    </div>
                </div>
            </div>
        </main>
    );
}

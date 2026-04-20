import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, Lock, LogIn, ArrowLeft, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";
import { cookies } from "next/headers";

export default async function SignInPage({ searchParams }) {
    const { message, error: queryError } = await searchParams;

    async function handleSignIn(formData) {
        "use server";
        const email = formData.get("email");
        const password = formData.get("password");

        // 1. Admin hardcoded check (Development/Emergency Bypass)
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const cookieStore = await cookies();
            cookieStore.set("admin_session", "true", {
                path: "/",
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24, // 1 day
            });
            redirect("/dashboard/admin");
        }

        const supabase = await createClient();

        // 2. Standard Supabase Sign In
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            redirect(`/sign-in?error=${encodeURIComponent(error.message)}`);
        }

        // 3. Multi-Factor Authentication Check (REMOVED AS PER REQUEST)
        // [Logic removed to allow direct login]

        // 4. Role-based Redirection
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();

        if (profile?.role === "ADMIN") {
            redirect("/dashboard/admin");
        } else if (profile?.role === "PARENT") {
            redirect("/dashboard/parent");
        } else {
            redirect("/dashboard/child");
        }
    }

    return (
        <main className="relative min-h-dvh flex items-center justify-center p-6 overflow-hidden">
            {/* Background blobs */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-orb-drift" />
                <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-clay-sky/15 rounded-full blur-[120px] animate-orb-drift [animation-delay:-5s]" />
            </div>

            <div className="relative z-10 w-full max-w-lg glass-lg rounded-[3.5rem] p-10 sm:p-14 my-auto animate-fade-up">
                <Link href="/" className="absolute top-10 left-10 flex items-center gap-2 text-sm font-black text-text-light hover:text-primary transition-all group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> BACK
                </Link>

                <div className="text-center mb-10 mt-6">
                    <div className="flex justify-center mb-6">
                        <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center text-primary shadow-inner-clay border-4 border-white animate-float">
                            <LogIn size={48} strokeWidth={1.5} />
                        </div>
                    </div>
                    <h1 className="text-3xl sm:text-4xl text-text-dark font-black mb-2">Welcome Back!</h1>
                    <p className="text-text-mid font-extrabold text-lg opacity-80">Ready for more sparkle?</p>
                </div>

                {message && (
                    <div className="mb-8 p-4 bg-emerald-50 border-2 border-emerald-100 rounded-2xl text-emerald-600 text-sm font-bold flex items-center gap-3 animate-pop">
                        <Sparkles size={18} />
                        {message}
                    </div>
                )}

                {queryError && (
                    <div className="mb-8 p-4 bg-rose-50 border-2 border-rose-100 rounded-2xl text-rose-600 text-sm font-bold flex items-center gap-3 animate-pop">
                        <AlertCircle size={18} />
                        {queryError}
                    </div>
                )}

                <form action={handleSignIn} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2.5">
                        <label className="text-[11px] font-black text-text-light flex items-center gap-2 ml-4 uppercase tracking-[0.1em]">
                            <User size={13} /> EMAIL ADDRESS
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="explorer@learnspark.com"
                            required
                            className="bg-white border-2 border-slate-50 p-5 rounded-[1.8rem] text-text-dark placeholder:text-text-light focus:outline-none focus:border-primary focus:ring-[12px] focus:ring-primary/5 transition-all font-bold shadow-sm"
                        />
                    </div>

                    <div className="flex flex-col gap-2.5">
                        <label className="text-[11px] font-black text-text-light flex items-center gap-2 ml-4 uppercase tracking-[0.1em]">
                            <Lock size={13} /> PASSWORD
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            required
                            className="bg-white border-2 border-slate-50 p-5 rounded-[1.8rem] text-text-dark placeholder:text-text-light focus:outline-none focus:border-primary focus:ring-[12px] focus:ring-primary/5 transition-all font-bold shadow-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        className="mt-6 bg-primary text-white py-6 rounded-[2rem] font-black text-xl shadow-clay-lg hover:bg-primary-deep hover:-translate-y-2 hover:shadow-clay-hover active:translate-y-0 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-3"
                    >
                        Sign In <ShieldCheck size={24} />
                    </button>
                </form>

                <p className="text-center mt-10 text-sm font-black text-text-mid">
                    New to the adventure? <Link href="/sign-up" className="text-primary hover:underline ml-1">Join Free</Link>
                </p>
            </div>
        </main>
    );
}

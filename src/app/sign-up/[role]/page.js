import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, UserPlus, Star, Search, ArrowLeft, ShieldCheck } from "lucide-react";

export default async function SignUpPage({ params }) {
    const { role } = await params;
    const validatedRole = role?.toUpperCase();

    if (!["CHILD", "PARENT"].includes(validatedRole)) {
        redirect("/sign-up");
    }

    async function handleSignUp(formData) {
        "use server";
        const email = formData.get("email");
        const password = formData.get("password");
        const username = formData.get("username");
        const displayName = formData.get("displayName");
        const childUsername = formData.get("childUsername");

        const supabase = await createClient();

        // 1. Check if username is taken
        const { data: existingUser } = await supabase
            .from("profiles")
            .select("username")
            .eq("username", username)
            .single();

        if (existingUser) {
            return { error: "Username already taken." };
        }

        // 2. If Parent, check if child exists
        let childId = null;
        if (validatedRole === "PARENT" && childUsername) {
            const { data: childProfile } = await supabase
                .from("profiles")
                .select("id")
                .eq("username", childUsername)
                .eq("role", "CHILD")
                .single();

            if (!childProfile) {
                return { error: `Child username "${childUsername}" not found. You can link them later in the dashboard.` };
            }
            childId = childProfile.id;
        }

        // 3. Sign up
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username,
                    role: validatedRole,
                    display_name: displayName,
                },
            },
        });

        if (error) {
            return { error: error.message };
        }

        if (childId && data.user) {
            await new Promise(r => setTimeout(r, 200));
            await supabase.from("parent_child_links").insert({
                parent_id: data.user.id,
                child_id: childId
            });
        }

        redirect("/sign-in?message=Please check your email to verify your account.");
    }

    return (
        <main className="relative min-h-dvh flex items-center justify-center p-6 overflow-hidden">
            {/* Background blobs */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-clay-yellow/15 rounded-full blur-[120px] animate-orb-drift" />
                <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-orb-drift [animation-delay:-5s]" />
            </div>

            <div className="relative z-10 w-full max-w-lg glass-lg rounded-[3.5rem] p-10 sm:p-14 my-auto animate-fade-up">
                <Link href="/sign-up" className="absolute top-10 left-10 flex items-center gap-2 text-sm font-black text-text-light hover:text-primary transition-all group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> BACK
                </Link>

                <div className="text-center mb-10 mt-6">
                    <div className="flex justify-center mb-6">
                        <div className="relative w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center text-primary shadow-inner-clay border-4 border-white animate-float">
                            <UserPlus size={48} strokeWidth={1.5} />
                            <Star className="absolute -top-3 -right-3 text-clay-yellow" fill="currentColor" size={24} />
                        </div>
                    </div>
                    <h1 className="text-3xl sm:text-4xl text-text-dark font-black mb-2">
                        {validatedRole === "CHILD" ? "Little Explorer" : "Parent / Guardian"}
                    </h1>
                    <p className="text-text-mid font-extrabold text-lg opacity-80">Start your joyful learning adventure!</p>
                </div>

                <form action={handleSignUp} className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2.5">
                            <label className="text-[11px] font-black text-text-light flex items-center gap-2 ml-4 uppercase tracking-[0.1em]">
                                <User size={13} /> USERNAME
                            </label>
                            <input name="username" placeholder="sparky_123" required className="bg-white border-2 border-slate-50 p-5 rounded-[1.8rem] text-text-dark placeholder:text-text-light focus:outline-none focus:border-primary focus:ring-[12px] focus:ring-primary/5 transition-all font-bold shadow-sm" />
                        </div>
                        <div className="flex flex-col gap-2.5">
                            <label className="text-[11px] font-black text-text-light flex items-center gap-2 ml-4 uppercase tracking-[0.1em]">
                                <Star size={13} /> DISPLAY NAME
                            </label>
                            <input name="displayName" placeholder={validatedRole === "CHILD" ? "Star Child" : "Your Name"} required className="bg-white border-2 border-slate-50 p-5 rounded-[1.8rem] text-text-dark placeholder:text-text-light focus:outline-none focus:border-primary focus:ring-[12px] focus:ring-primary/5 transition-all font-bold shadow-sm" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2.5">
                        <label className="text-[11px] font-black text-text-light flex items-center gap-2 ml-4 uppercase tracking-[0.1em]">
                            <Mail size={13} /> EMAIL ADDRESS
                        </label>
                        <input type="email" name="email" placeholder="explorer@learnspark.com" required className="bg-white border-2 border-slate-50 p-5 rounded-[1.8rem] text-text-dark placeholder:text-text-light focus:outline-none focus:border-primary focus:ring-[12px] focus:ring-primary/5 transition-all font-bold shadow-sm" />
                    </div>

                    <div className="flex flex-col gap-2.5">
                        <label className="text-[11px] font-black text-text-light flex items-center gap-2 ml-4 uppercase tracking-[0.1em]">
                            <Lock size={13} /> SECURE PASSWORD
                        </label>
                        <input type="password" name="password" placeholder="••••••••" required className="bg-white border-2 border-slate-50 p-5 rounded-[1.8rem] text-text-dark placeholder:text-text-light focus:outline-none focus:border-primary focus:ring-[12px] focus:ring-primary/5 transition-all font-bold shadow-sm" />
                    </div>

                    {validatedRole === "PARENT" && (
                        <div className="flex flex-col gap-2.5 p-6 bg-primary/5 rounded-[2rem] border-2 border-primary/10 shadow-inner-clay">
                            <label className="text-[11px] font-black text-primary flex items-center gap-2 ml-2 uppercase tracking-[0.1em]">
                                <Search size={13} /> LINK CHILD (OPTIONAL)
                            </label>
                            <input name="childUsername" placeholder="your_childs_id" className="bg-white border-2 border-white p-4.5 rounded-[1.5rem] text-text-dark placeholder:text-text-light focus:outline-none focus:border-primary transition-all font-bold shadow-sm" />
                            <p className="text-[11px] text-text-light font-bold ml-2">Searching for their unique username...</p>
                        </div>
                    )}

                    <button type="submit" className="mt-6 bg-primary text-white py-6 rounded-[2rem] font-black text-xl shadow-clay-lg hover:bg-primary-deep hover:-translate-y-2 hover:shadow-clay-hover active:translate-y-0 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-3">
                        Create Account <ShieldCheck size={24} />
                    </button>
                </form>

                <p className="text-center mt-10 text-sm font-black text-text-mid">
                    Already part of the family? <Link href="/sign-in" className="text-primary hover:underline ml-1">Sign In</Link>
                </p>
            </div>
        </main>
    );
}

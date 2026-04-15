import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserPlus, Search, ArrowLeft, Star, Sparkles } from "lucide-react";

export default async function LinkChildPage() {
    const user = await getUser();
    if (!user) redirect("/sign-in");

    async function handleLink(formData) {
        "use server";
        const childUsername = formData.get("childUsername");
        const supabase = await createClient();

        // 1. Find child by username
        const { data: childProfile, error: searchError } = await supabase
            .from('profiles')
            .select('id, role')
            .eq('username', childUsername)
            .eq('role', 'CHILD')
            .single();

        if (searchError || !childProfile) {
            return { error: "Child not found." };
        }

        // 2. Create link
        const { error: linkError } = await supabase
            .from('parent_child_links')
            .insert({
                parent_id: user.id,
                child_id: childProfile.id
            });

        if (linkError) {
            return { error: "Already linked or selection error." };
        }

        redirect("/dashboard/parent?message=Child successfully linked!");
    }

    return (
        <main className="relative min-h-dvh flex items-center justify-center p-6 overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[20%] right-[-10%] w-[450px] h-[450px] bg-clay-mint/15 rounded-full blur-[100px] animate-orb-drift" />
                <div className="absolute bottom-[20%] left-[-10%] w-[450px] h-[450px] bg-primary/10 rounded-full blur-[100px] animate-orb-drift [animation-delay:-4s]" />
            </div>

            <div className="relative z-10 w-full max-w-md glass-lg rounded-[3.5rem] p-12 text-center animate-fade-up">
                <Link href="/dashboard/parent" className="absolute top-10 left-10 flex items-center gap-2 text-sm font-black text-text-light hover:text-primary transition-all group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> BACK
                </Link>

                <div className="mb-10 flex flex-col items-center mt-6">
                    <div className="relative mb-6">
                        <div className="w-24 h-24 rounded-[2.5rem] bg-primary/5 border-4 border-white shadow-inner-clay flex items-center justify-center text-primary animate-float">
                            <UserPlus size={48} strokeWidth={1.5} />
                        </div>
                        <Sparkles className="absolute -top-2 -right-2 text-clay-yellow animate-sparkle-drift" size={24} fill="currentColor" />
                    </div>
                    <h1 className="text-3xl font-black text-text-dark mb-2 tracking-tight">Link Your Child</h1>
                    <p className="text-text-mid font-extrabold text-lg opacity-80 leading-relaxed">
                        Enter their unique username to connect their space.
                    </p>
                </div>

                <form action={handleLink} className="flex flex-col gap-8">
                    <div className="flex flex-col gap-3 text-left">
                        <label className="text-[11px] font-black text-text-light flex items-center gap-2 ml-5 uppercase tracking-[0.1em]">
                            <Search size={14} /> CHILD&apos;S USERNAME
                        </label>
                        <div className="relative group">
                            <input
                                name="childUsername"
                                type="text"
                                placeholder="cool_kid_123"
                                required
                                className="w-full bg-white border-2 border-slate-50 p-6 rounded-[2rem] text-xl font-bold text-text-dark placeholder:text-text-light/50 focus:outline-none focus:border-primary focus:ring-[15px] focus:ring-primary/5 transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <button type="submit" className="bg-primary text-white py-6 rounded-[2rem] font-black text-xl shadow-clay-lg hover:bg-primary-deep hover:-translate-y-2 hover:shadow-clay-hover active:translate-y-0 transition-all cursor-pointer flex items-center justify-center gap-3">
                        Find & Link <Star size={22} fill="currentColor" />
                    </button>

                    <div className="flex items-center justify-center gap-2 text-text-light/60 font-black text-[10px] uppercase tracking-[0.2em]">
                        Establishing Secure Connection
                    </div>
                </form>
            </div>
        </main>
    );
}

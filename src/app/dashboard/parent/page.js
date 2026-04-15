import { createClient } from "@/lib/supabase/server";
import { getProfile, signOut } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
    Settings,
    UserPlus,
    Shield,
    LogOut,
    Star,
    ChevronRight,
    Search,
    Users,
    Sparkles
} from "lucide-react";

export default async function ParentDashboard({ searchParams }) {
    const profile = await getProfile();
    const { message } = await searchParams;

    if (!profile || profile.role !== 'PARENT') {
        redirect("/sign-in");
    }

    const supabase = await createClient();

    const { data: links } = await supabase
        .from('parent_child_links')
        .select(`
            child_id,
            profiles:child_id (
                username,
                display_name,
                avatar_url
            )
        `)
        .eq('parent_id', profile.id);

    async function handleSignOut() {
        "use server";
        await signOut();
        redirect("/");
    }

    return (
        <main className="min-h-dvh bg-clay-cream/50 text-text-dark font-body">
            {/* Top Bar */}
            <nav className="flex items-center justify-between px-8 py-5 bg-white shadow-clay border-b border-slate-100 sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <Star className="text-clay-yellow animate-float" fill="#fcd34d" size={28} />
                    <span className="font-display font-black text-2xl tracking-tighter text-text-dark">LearnSpark Parent</span>
                </div>
                <form action={handleSignOut}>
                    <button type="submit" className="flex items-center gap-2 px-5 py-2.5 rounded-2xl glass font-black text-text-mid hover:text-red-500 transition-all cursor-pointer active:scale-95 group">
                        <LogOut size={18} className="group-hover:rotate-12 transition-transform" /> Sign Out
                    </button>
                </form>
            </nav>

            <div className="max-w-6xl mx-auto px-8 py-14">
                <header className="mb-12 animate-fade-up">
                    <h1 className="text-5xl font-black text-text-dark mb-3 tracking-tighter">Hello, {profile.display_name}!</h1>
                    <p className="text-text-mid font-extrabold text-xl opacity-80">Manage your family&apos;s learning journey.</p>
                </header>

                {message && (
                    <div className="mb-10 p-5 glass border-emerald-100 text-emerald-700 rounded-3xl font-black flex items-center gap-3 shadow-inner-clay animate-pop">
                        <Sparkles size={20} className="text-emerald-500" /> {message}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Children List */}
                    <section className="lg:col-span-2 space-y-8 animate-fade-up [animation-delay:0.1s]">
                        <div className="glass-lg rounded-[3rem] p-10">
                            <div className="flex items-center justify-between mb-10">
                                <h2 className="flex items-center gap-3 text-2xl font-black text-text-dark tracking-tighter">
                                    <Users size={28} className="text-primary" strokeWidth={2.5} /> Your Children
                                </h2>
                                <Link href="/dashboard/parent/link-child" className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-primary-deep transition-all shadow-clay active:scale-95">
                                    <UserPlus size={20} /> Link Child
                                </Link>
                            </div>

                            <div className="grid gap-5">
                                {links && links.length > 0 ? (
                                    links.map((link) => (
                                        <div key={link.child_id} className="group flex items-center justify-between p-6 bg-white/50 rounded-[2rem] border-2 border-slate-50 hover:border-primary/20 hover:shadow-clay transition-all animate-pop">
                                            <div className="flex items-center gap-5">
                                                <div className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-clay-sky to-blue-400 flex items-center justify-center text-white font-black text-2xl shadow-clay border-2 border-white transition-transform group-hover:rotate-3">
                                                    {link.profiles.display_name[0]}
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-xl text-text-dark leading-tight">{link.profiles.display_name}</h3>
                                                    <p className="text-[13px] font-black text-text-light uppercase tracking-widest mt-0.5">@{link.profiles.username}</p>
                                                </div>
                                            </div>
                                            <Link
                                                href={`/dashboard/child?proxy=${link.child_id}`}
                                                className="flex items-center gap-2 font-black text-primary bg-white px-5 py-2.5 rounded-xl shadow-clay hover:gap-3 transition-all"
                                            >
                                                View Space <ChevronRight size={18} strokeWidth={3} />
                                            </Link>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-16 px-6 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full text-slate-200 mb-6 shadow-inner-clay">
                                            <Search size={40} />
                                        </div>
                                        <p className="text-text-mid font-black text-lg mb-1">No children linked yet.</p>
                                        <p className="text-sm text-text-light font-bold">Link them to start seeing their stars!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Sidebar: Security */}
                    <section className="space-y-8 animate-fade-up [animation-delay:0.2s]">
                        <div className="glass-lg rounded-[3rem] p-10">
                            <h2 className="flex items-center gap-3 text-2xl font-black text-text-dark tracking-tighter mb-8">
                                <Shield size={28} className="text-emerald-500" strokeWidth={2.5} /> Security
                            </h2>
                            <div className="space-y-4">
                                <Link href="/mfa-enroll" className="flex items-center justify-between p-5 bg-white/50 rounded-[1.8rem] border-2 border-slate-50 group hover:border-primary/20 hover:bg-white transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 shadow-inner-clay">
                                            <Shield size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-text-dark text-[15px] group-hover:text-primary transition-colors">2-Factor Auth</h3>
                                            <p className="text-[11px] font-black text-text-light uppercase tracking-wider">Extra protection</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-slate-300 group-hover:text-primary transition-colors translate-x-0 group-hover:translate-x-1" strokeWidth={3} />
                                </Link>

                                <button className="w-full flex items-center justify-between p-5 bg-slate-100/50 rounded-[1.8rem] opacity-50 cursor-not-allowed text-left">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300">
                                            <Settings size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-text-dark text-[15px]">Settings</h3>
                                            <p className="text-[11px] font-black text-text-light uppercase tracking-wider">Profile & Email</p>
                                        </div>
                                    </div>
                                    <Settings size={18} className="text-slate-200" />
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}

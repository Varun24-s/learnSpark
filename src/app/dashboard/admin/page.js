import { getProfile } from "@/lib/auth";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Shield, Users, BookOpen, Star, LogOut } from "lucide-react";
import { signOut } from "@/lib/auth";

import { cookies } from "next/headers";

export default async function AdminDashboard() {
    const isAdminBypass = (await cookies()).get('admin_session')?.value === 'true';
    const profile = isAdminBypass ? { role: 'ADMIN', full_name: 'Admin' } : await getProfile();

    if (!profile || profile.role !== 'ADMIN') {
        redirect("/sign-in");
    }

    // Use admin client for stats to bypass RLS
    const supabase = await createAdminClient();

    // Fetch global stats
    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: childCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'CHILD');
    const { count: moduleCount } = await supabase.from('modules').select('*', { count: 'exact', head: true });

    async function handleSignOut() {
        "use server";
        await signOut();
        redirect("/");
    }

    return (
        <main className="min-h-dvh bg-slate-50 text-slate-900 font-body">
            {/* Top Bar */}
            <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <Shield className="text-primary" size={24} />
                    <span className="font-black text-xl tracking-tight text-slate-800">LearnSpark Admin</span>
                </div>
                <form action={handleSignOut}>
                    <button type="submit" className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-500 hover:bg-slate-50 hover:text-red-500 transition-all cursor-pointer">
                        <LogOut size={18} /> Sign Out
                    </button>
                </form>
            </nav>

            <div className="max-w-6xl mx-auto px-8 py-12">
                <header className="mb-10">
                    <h1 className="text-4xl font-black text-slate-900 mb-2">Admin Overview</h1>
                    <p className="text-slate-500 font-semibold text-lg">System monitoring and global statistics.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* User Stats Card */}
                    <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                        <div className="flex items-center gap-2 text-xl font-black text-slate-800 mb-8">
                            <Users size={24} className="text-primary" /> Platform Users
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 bg-slate-50 rounded-2xl text-center border border-slate-100">
                                <h3 className="text-3xl font-black text-primary">{userCount || 0}</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Total</p>
                            </div>
                            <div className="p-6 bg-slate-50 rounded-2xl text-center border border-slate-100">
                                <h3 className="text-3xl font-black text-clay-peach">{childCount || 0}</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Children</p>
                            </div>
                        </div>
                    </section>

                    {/* Content Stats Card */}
                    <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                        <div className="flex items-center gap-2 text-xl font-black text-slate-800 mb-8">
                            <BookOpen size={24} className="text-clay-sky" /> Learning Content
                        </div>
                        <div className="p-6 bg-slate-50 rounded-2xl text-center border border-slate-100">
                            <h3 className="text-4xl font-black text-clay-sky">{moduleCount || 0}</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">Active Modules</p>
                        </div>
                    </section>

                    {/* System Logs Placeholder */}
                    <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                        <div className="flex items-center gap-2 text-xl font-black text-slate-800 mb-8">
                            <Star size={24} className="text-clay-yellow" /> System Logs
                        </div>
                        <div className="p-12 text-center text-slate-300">
                            <p className="text-sm font-bold">Logs will appear here.</p>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}

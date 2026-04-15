import { getUser, getProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ChildDashboardClient from "./components/ChildDashboardClient";

export default async function ChildDashboardPage({ searchParams }) {
    const user = await getUser();
    const profile = await getProfile();
    const { proxy } = await searchParams;

    if (!user || !profile) redirect("/sign-in");

    let targetProfile = profile;
    let isProxy = false;

    // Proxy mode: Parent viewing a child's dashboard
    if (proxy && profile.role === 'PARENT') {
        const supabase = await createClient();

        // 1. Verify link
        const { data: link } = await supabase
            .from('parent_child_links')
            .select('child_id')
            .eq('parent_id', profile.id)
            .eq('child_id', proxy)
            .single();

        if (link) {
            // 2. Fetch child's profile
            const { data: childProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', proxy)
                .single();

            if (childProfile) {
                targetProfile = childProfile;
                isProxy = true;
            }
        }
    }

    // Role check for direct access
    if (profile.role === 'CHILD' && profile.id !== targetProfile.id) {
        redirect("/dashboard/child");
    }

    // 3. Fetch total stars for the target profile
    const supabase = await createClient();
    const { data: progressData } = await supabase
        .from('progress')
        .select('stars')
        .eq('user_id', targetProfile.id);

    const totalStars = progressData?.reduce((acc, curr) => acc + curr.stars, 0) || 0;

    return (
        <ChildDashboardClient
            user={targetProfile}
            isProxy={isProxy}
            realUserRole={profile.role}
            totalStars={totalStars}
        />
    );
}

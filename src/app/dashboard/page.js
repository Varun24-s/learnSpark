import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth";

/**
 * Smart Router for the /dashboard path.
 * Redirects users to their specific dashboard based on their role.
 */
export default async function DashboardRouter() {
    const profile = await getProfile();

    if (!profile) {
        redirect("/sign-in");
    }

    const { role } = profile;

    if (role === "ADMIN") {
        redirect("/dashboard/admin");
    } else if (role === "PARENT") {
        redirect("/dashboard/parent");
    } else {
        redirect("/dashboard/child");
    }
}

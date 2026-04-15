"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { getModuleById } from "@/lib/modules-data";

/**
 * Updates or creates a progress record for a student
 * @param {string} localModuleId - The local ID of the module (e.g., 'num-1')
 * @param {number} stars - Number of stars earned (1-3)
 */
export async function updateStudentProgress(localModuleId, stars) {
    const user = await getUser();
    if (!user) return { error: "Not authenticated" };

    const mod = getModuleById(localModuleId);
    if (!mod) return { error: "Local module data not found" };

    const supabase = await createClient();

    // 1. Resolve UUID from database using the module title
    const { data: dbMod, error: modError } = await supabase
        .from('modules')
        .select('id')
        .eq('title', mod.title)
        .single();

    if (modError || !dbMod) {
        console.error("Module resolve error:", modError);
        return { error: "Module not found in database" };
    }

    const { data, error } = await supabase
        .from('progress')
        .upsert({
            user_id: user.id,
            module_id: dbMod.id,
            stars: stars,
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }, { onConflict: 'user_id, module_id' });

    if (error) {
        console.error("Progress update error:", error);
        return { error: error.message };
    }

    return { success: true };
}

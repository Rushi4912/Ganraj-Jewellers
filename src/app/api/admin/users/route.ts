import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

export async function GET() {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Server configuration error - missing SUPABASE_SERVICE_ROLE_KEY" }, { status: 500 });
  }

  try {
    // First, get all profiles
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, name, role, created_at")
      .order("created_at", { ascending: false });

    if (profileError) {
      console.error("Profile fetch error:", profileError);
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    // Try to get auth users for email info
    let authUsers: Array<{
      id: string;
      email?: string | null;
      user_metadata?: Record<string, unknown> | null;
    }> = [];
    try {
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers();
      if (!authError && authData?.users) {
        authUsers = authData.users;
        
        // Sync missing profiles
        const profileIds = new Set((profiles || []).map(p => p.id));
        const missingUsers = authUsers.filter(u => !profileIds.has(u.id));

        if (missingUsers.length > 0) {
          const newProfiles = missingUsers.map(user => ({
            id: user.id,
            name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
            role: "customer",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }));

          await supabaseAdmin.from("profiles").upsert(newProfiles, { onConflict: "id" });

          // Re-fetch profiles after sync
          const { data: updatedProfiles } = await supabaseAdmin
            .from("profiles")
            .select("id, full_name, name, role, created_at")
            .order("created_at", { ascending: false });

          const usersWithEmail = (updatedProfiles || []).map(profile => {
            const authUser = authUsers.find(u => u.id === profile.id);
            return {
              ...profile,
              email: authUser?.email || "",
            };
          });

          return NextResponse.json({ users: usersWithEmail });
        }
      }
    } catch (authErr) {
      console.log("Auth admin API not available, using profiles only:", authErr);
    }

    // Merge profiles with email from auth if available
    const usersWithEmail = (profiles || []).map(profile => {
      const authUser = authUsers.find(u => u.id === profile.id);
      return {
        ...profile,
        email: authUser?.email || "",
      };
    });

    return NextResponse.json({ users: usersWithEmail });
  } catch (error) {
    console.error("Users API error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ user: data });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

// Sync all auth users to profiles
export async function POST() {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  try {
    // Get all auth users
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    if (!authUsers?.users || authUsers.users.length === 0) {
      return NextResponse.json({ message: "No users to sync", synced: 0 });
    }

    // Get existing profiles
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("id");

    const profileIds = new Set((profiles || []).map(p => p.id));
    const missingUsers = authUsers.users.filter(u => !profileIds.has(u.id));

    if (missingUsers.length === 0) {
      return NextResponse.json({ message: "All users already synced", synced: 0 });
    }

    // Create profiles for missing users
    const newProfiles = missingUsers.map(user => ({
      id: user.id,
      name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
      role: "customer",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const { error: insertError } = await supabaseAdmin.from("profiles").insert(newProfiles);

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ 
      message: `Successfully synced ${missingUsers.length} users`,
      synced: missingUsers.length 
    });
  } catch (error) {
    console.error("Sync users error:", error);
    return NextResponse.json({ error: "Failed to sync users" }, { status: 500 });
  }
}

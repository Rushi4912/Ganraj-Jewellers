import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";

type EnsureProfilePayload = {
  id: string;
  email?: string;
  name?: string;
};

export async function POST(request: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Server missing SUPABASE_SERVICE_ROLE_KEY. Add it to .env.local" },
      { status: 500 }
    );
  }

  let body: EnsureProfilePayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  if (!body.id) {
    return NextResponse.json({ error: "Missing user id" }, { status: 400 });
  }

  try {
    // First check if profile already exists
    const { data: existingProfile } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", body.id)
      .single();

    if (existingProfile) {
      return NextResponse.json({ profile: existingProfile });
    }

    // Create new profile
    const profilePayload = {
      id: body.id,
      name: body.name || body.email?.split("@")[0] || "User",
      role: "customer",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .insert(profilePayload)
      .select("*")
      .single();

    if (error) {
      // If it's a unique violation, the profile was created by another request
      if (error.code === "23505") {
        const { data: refetchedProfile } = await supabaseAdmin
          .from("profiles")
          .select("*")
          .eq("id", body.id)
          .single();
        return NextResponse.json({ profile: refetchedProfile });
      }
      
      console.error("Profile creation error:", error);
      return NextResponse.json(
        { error: error.message, details: error.details },
        { status: 500 }
      );
    }

    return NextResponse.json({ profile: data });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Failed to ensure profile" },
      { status: 500 }
    );
  }
}

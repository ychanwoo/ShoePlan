import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

interface UpdatePayload {
  running_distance?: string;
  running_type?: string;
  shoe_brand?: string;
  shoe_model?: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET() {
  try {
    const cookieStore = await cookies();
    const oauthId = cookieStore.get("oauthId")?.value;

    if (!oauthId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("user_profile")
      .select("running_distance, running_type, shoe_brand, shoe_model")
      .eq("oauth_id", oauthId)
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET error", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const oauthId = cookieStore.get("oauthId")?.value;

    if (!oauthId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const updatePayload: UpdatePayload = {};

    if (body.distance !== undefined && body.distance !== "")
      updatePayload.running_distance = body.distance;
    if (body.type !== undefined && body.type !== "")
      updatePayload.running_type = body.type;
    if (body.brand !== undefined && body.brand !== "")
      updatePayload.shoe_brand = body.brand;
    if (body.model !== undefined && body.model !== "")
      updatePayload.shoe_model = body.model;

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json({
        success: true,
        message: "No changes to update",
      });
    }

    const { error } = await supabase
      .from("user_profile")
      .update(updatePayload)
      .eq("oauth_id", oauthId);

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

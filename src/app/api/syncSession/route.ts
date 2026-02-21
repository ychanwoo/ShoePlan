// app/api/syncSession/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: Request) {
  try {
    const { oauthId, sessionData } = await req.json();
    if (!oauthId || !sessionData) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 },
      );
    }

    const parsed = JSON.parse(sessionData);

    // insert
    const { error: insertError } = await supabase.from("user_profile").upsert(
      {
        oauth_id: oauthId,
        height: parsed.height,
        weight: parsed.weight,
        running_distance: parsed.runningDistance,
        running_distance_custom: parsed.runningDistanceCustom,
        running_type: parsed.runningType,
        shoe_age: parsed.shoeAge,
        shoe_brand: parsed.shoeBrand,
        shoe_model: parsed.shoeModel,
      },
      { onConflict: "oauth_id" }, // 이미 존재하면 update
    );

    if (insertError) {
      console.error(insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

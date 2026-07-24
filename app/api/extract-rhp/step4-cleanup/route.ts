import { NextResponse } from "next/server"; 
import { createClient } from "@supabase/supabase-js";

export const maxDuration = 10; 

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { filePath } = await req.json();
    if (!filePath) return NextResponse.json({ error: "No filePath provided." }, { status: 400 });

    const { error: removeError } = await supabase.storage
      .from("rhp-uploads")
      .remove([filePath]);
      
    if (removeError) {
      console.error(`Failed to cleanup ${filePath} from storage:`, removeError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

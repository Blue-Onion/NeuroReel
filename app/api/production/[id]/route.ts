import { NextResponse } from "next/server";
import { getState } from "@/lib/state-manager";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const state = await getState(id);
  
  if (!state) {
    return NextResponse.json({ error: "Production run not found" }, { status: 404 });
  }
  
  return NextResponse.json(state);
}

import { NextResponse } from "next/server";
import { sendEngineCommand } from "@/lib/engineSocket";

export async function POST() {
    try {

    const result = await sendEngineCommand("START");

    return NextResponse.json(result, { status: 200 });

    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                message: error?.message || "Failed to start engine",
            },
            { status: 500 }
        );
    }
}
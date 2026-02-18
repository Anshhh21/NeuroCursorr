import { NextResponse } from "next/server";
import { sendEngineCommand } from "@/lib/engineSocket";

export async function GET() {

    try {

        const result = await sendEngineCommand("STATUS");

        return NextResponse.json(
            result,
            { status: 200 }
        );

    } catch (error: any) {

        return NextResponse.json(
        {
            success: false,
            message: error?.message || "Failed to check engine status",
        },
        { status: 500 }
        );
    }
}
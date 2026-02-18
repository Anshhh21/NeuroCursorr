import { NextResponse } from "next/server";
import { sendEngineCommand } from "@/lib/engineSocket";

export async function POST() {
    try {

        const result = await sendEngineCommand("STOP");

        return NextResponse.json(
            result,
            { status: 200 }
        );
        
    } catch (error:any) {
    
        return NextResponse.json(

            {
            success: false,
            message: error?.message || "Failed to stop engine",
            },
            { status: 500 }
            
        );
        
    }
}
import { NextResponse } from "next/server";

export async function GET() {
    try {
        return NextResponse.json({
            
                success: true,
                engineStatus: "disconnected",
                message: "Engine is not connected"
            
        },
        { status: 200 }
    )
    
    } catch (error) {
        console.error("Error checking engine status:", error);
    
        return NextResponse.json(
            {
            success: false,
            message: "Failed to check engine status",
            },
            { status: 500 }
        );
        
    }
}
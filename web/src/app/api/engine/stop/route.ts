import { NextResponse } from "next/server";

export async function POST() {
    try {
        return NextResponse.json(
            {
            success: true,
            message: "Engine stop request accepted",
            },
            { status: 200 }
        );
        
    } catch (error) {
        console.error("Error stopping engine:", error);
    
        return NextResponse.json(
            {
            success: false,
            message: "Failed to process engine stop request",
            },
            { status: 500 }
        );
        
    }
}
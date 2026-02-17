import { NextResponse } from "next/server";

export async function POST(request : Request) {

    try {
        return NextResponse.json(
            {
            success: true,
            message: "Engine start request accepted",
            },
            { status: 200 }
        );
        } catch (error) {
        console.error("Error starting engine:", error);
    
        return NextResponse.json(
            {
            success: false,
            message: "Failed to process engine start request",
            },
            { status: 500 }
        );
        }
    }

export async function startEngine() {
    try {
        const response = await fetch("/api/engine/start", {
            method: "POST",
        })
        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Something went wrong"
            }
        }

        

        return data;


    } catch (error) {

        console.error("Error starting engine:", error);
        return {
            
            success: false,
            message: "Failed to start engine"
        }

    }
}

export async function stopEngine() {
    try {
        const response = await fetch("/api/engine/stop", {
            method: "POST",
        })

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Something went wrong"
            }
        }

        return data;

}
    catch (error) {

        console.error("Error stopping engine:", error);
        return {
            
            success: false,
            message: "Failed to stop engine"
        }

    }
}

export async function getEngineStatus() {
    try {
        const response = await fetch("/api/engine/status", {
            method: "GET",
        })

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: data?.message || "Something went wrong"
            }
        }

        return data;

    } catch (error) {

        console.error("Error checking engine status:", error);
        return {
            
            success: false,
            message: "Failed to check engine status"
        }

    }
}


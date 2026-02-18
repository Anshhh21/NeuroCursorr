import WebSocket from "ws";

export function sendEngineCommand (command: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const ws = new WebSocket("ws://localhost:8000");

        ws.on("open", () => {
            ws.send(JSON.stringify({ command }));
        });


        ws.on("message", (data) => {
            try {
                const parsed = JSON.parse(data.toString());
                resolve(parsed);
            } catch (err) {
                reject({
                success: false,
                message: "Invalid response from engine",
                });
            } finally {
                ws.close();
            }
            });

            ws.on("error", () => {
            reject({
                success: false,
                message: "Engine not running",
            });
            });
        });
}
            
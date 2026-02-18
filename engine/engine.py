import asyncio
import websockets
import json
import cv2


engine_running = False
engine_task = None


async def engine_loop():

    global engine_running

    print("Engine loop started")

    cap = cv2.VideoCapture(0)

    while engine_running:
        ret, frame = cap.read()

        if not ret:
            print("Failed to grab frame")
            break

        # Just print frame size for now

        print("Frame received:", frame.shape)

        # Small sleep so async loop can process STOP
        
        await asyncio.sleep(0.01)

    cap.release()
    print("Engine loop stopped")


async def handle_connection(websocket):
    global engine_running, engine_task

    print("Client connected")

    try:
        async for message in websocket:
            print("Received raw message:", message)

            data = json.loads(message)
            command = data.get("command")

            if command == "START":
                if not engine_running:
                    engine_running = True
                    engine_task = asyncio.create_task(engine_loop())

                response = {
                    "success": True,
                    "engineStatus": "connected"
                }

            elif command == "STOP":
                engine_running = False

                response = {
                    "success": True,
                    "engineStatus": "disconnected"
                }

            elif command == "STATUS":
                response = {
                    "success": True,
                    "engineStatus": "connected" if engine_running else "disconnected"
                }

            else:
                response = {
                    "success": False,
                    "message": "Unknown command"
                }

            await websocket.send(json.dumps(response))

    except websockets.exceptions.ConnectionClosed:
        print("Client disconnected")


async def main():
    async with websockets.serve(handle_connection, "localhost", 8000):
        print("NeuroCursor Engine running on ws://localhost:8000")
        await asyncio.Future()


if __name__ == "__main__":
    asyncio.run(main())
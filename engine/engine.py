import asyncio
import websockets
import json
import threading
import cv2

engine_running = False
camera_thread = None


import mediapipe as mp
import numpy as np

def camera_loop():
    global engine_running

    print("Camera thread started")

    cap = cv2.VideoCapture(0)

    mp_hands = mp.solutions.hands

    hands = mp_hands.Hands(
        static_image_mode=False,
        model_complexity=0,
        max_num_hands=1,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    )

    while engine_running:
        ret, frame = cap.read()

        if not ret:
            print("Failed to grab frame")
            break

        frame = cv2.flip(frame, 1)
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        results = hands.process(frame_rgb)

        if results.multi_hand_landmarks:
            print("Hand detected")

            for hand_landmarks in results.multi_hand_landmarks:
                # Example: print index finger tip position
                index_tip = hand_landmarks.landmark[8]
                h, w, _ = frame.shape
                x = int(index_tip.x * w)
                y = int(index_tip.y * h)

                print("Index finger:", x, y)

        cv2.waitKey(1)

    cap.release()
    print("Camera thread stopped")

async def handle_connection(websocket):
    global engine_running, camera_thread

    print("Client connected")

    try:
        async for message in websocket:
            print("Received:", message)

            data = json.loads(message)
            command = data.get("command")

            if command == "START":
                if not engine_running:
                    engine_running = True
                    camera_thread = threading.Thread(target=camera_loop)
                    camera_thread.start()

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
        print("Engine running on ws://localhost:8000")
        await asyncio.Future()


if __name__ == "__main__":
    asyncio.run(main())
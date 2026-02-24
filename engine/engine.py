import asyncio
import websockets
import json
import threading
import cv2

engine_running = False
camera_thread = None


import mediapipe as mp
import numpy as np
import pyautogui

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

    screen_width, screen_height = pyautogui.size()
    movement_gain = 1.5 
    frame_margin = 20

    prev_x, prev_y = 0, 0
    smoothening = 8

    click_threshold = 40  
    click_cooldown = 0
    max_cooldown = 8  

    pinch_frames = 0
    required_pinch_frames = 2
    palm_frames = 0

    control_enabled = True
    toggle_cooldown = 0
    paused_state_logged = False

    while engine_running:
        if click_cooldown > 0:
            click_cooldown -= 1

        if toggle_cooldown > 0:
            toggle_cooldown -= 1

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
                index_tip = hand_landmarks.landmark[8]
                thumb_tip = hand_landmarks.landmark[4]

                wrist = hand_landmarks.landmark[0]

                
                thumb_up = hand_landmarks.landmark[4].x < hand_landmarks.landmark[3].x

                index_up = hand_landmarks.landmark[8].y < hand_landmarks.landmark[6].y
                middle_up = hand_landmarks.landmark[12].y < hand_landmarks.landmark[10].y
                ring_up = hand_landmarks.landmark[16].y < hand_landmarks.landmark[14].y
                pinky_up = hand_landmarks.landmark[20].y < hand_landmarks.landmark[18].y

                
                if thumb_up and index_up and middle_up and ring_up and pinky_up:
                    palm_frames += 1
                else:
                    palm_frames = 0

                
                if palm_frames > 8 and toggle_cooldown == 0:
                    if control_enabled:
                        control_enabled = False
                        paused_state_logged = False
                        print("Paused")
                    else:
                        control_enabled = True
                        paused_state_logged = False
                        print("Resumed")

                    toggle_cooldown = 30
                    palm_frames = 0

                if not control_enabled:
                    if not paused_state_logged:
                        print("System is PAUSED")
                        paused_state_logged = True
                    continue

                
                cam_x = int(index_tip.x * frame.shape[1])
                cam_y = int(index_tip.y * frame.shape[0])

                

                
                screen_x = np.interp(cam_x,
                    (0, frame.shape[1]),
                    (0, screen_width))

                screen_y = np.interp(cam_y,
                    (0, frame.shape[0]),
                    (0, screen_height))

                
                screen_x = (screen_x - screen_width / 2) * movement_gain + screen_width / 2
                screen_y = (screen_y - screen_height / 2) * movement_gain + screen_height / 2

                
                thumb_cam_x = int(thumb_tip.x * frame.shape[1])
                thumb_cam_y = int(thumb_tip.y * frame.shape[0])

                thumb_cam_x = np.clip(thumb_cam_x, frame_margin, frame.shape[1] - frame_margin)
                thumb_cam_y = np.clip(thumb_cam_y, frame_margin, frame.shape[0] - frame_margin)

                
                curr_x = prev_x + (screen_x - prev_x) / smoothening
                curr_y = prev_y + (screen_y - prev_y) / smoothening

                pyautogui.moveTo(curr_x, curr_y)
                prev_x, prev_y = curr_x, curr_y

                
                distance = ((cam_x - thumb_cam_x) ** 2 + (cam_y - thumb_cam_y) ** 2) ** 0.5

                if distance < click_threshold:
                    pinch_frames += 1
                else:
                    pinch_frames = 0

                
                if pinch_frames >= required_pinch_frames and click_cooldown == 0:
                    pyautogui.click()
                    click_cooldown = max_cooldown
                    pinch_frames = 0
                    print("Click!")

                print("Mouse:", screen_x, screen_y)

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
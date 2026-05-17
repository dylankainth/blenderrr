# Blender Spin Controller

Spin around while holding your phone to control a blender. The phone's gyroscope measures rotation speed and sends it over BLE to an ESP32, which will eventually drive a servo/relay.

## Architecture

```
┌──────────────────┐         BLE          ┌──────────────────┐
│   Mobile App     │ ──────────────────▶  │   ESP32          │
│  (Expo / RN)     │   speed (rad/s)      │  (Arduino)       │
│                  │                      │                  │
│  Gyroscope ──▶   │                      │  Serial log ──▶  │
│  rotation speed  │                      │  servo/relay     │
└──────────────────┘                      └──────────────────┘
```

## Project Structure

```
blender/
├── esp32-firmware/        # PlatformIO project (Arduino framework)
│   ├── platformio.ini
│   └── src/main.cpp
├── mobile-app/            # Expo React Native app
│   ├── App.tsx
│   ├── src/
│   │   ├── screens/HomeScreen.tsx
│   │   ├── services/bluetoothService.ts
│   │   ├── hooks/useMotion.ts
│   │   └── utils/constants.ts
│   ├── app.json
│   └── package.json
├── README.md
└── OPENCODE.md
```

## Getting Started

### ESP32 Firmware

1. Install [PlatformIO](https://platformio.org/) (VS Code extension or CLI)
2. Open `esp32-firmware/` in PlatformIO
3. Build & upload:
   ```bash
   cd esp32-firmware
   pio run --target upload
   ```
4. Monitor serial output:
   ```bash
   pio device monitor
   ```

### Mobile App

1. Install dependencies:
   ```bash
   cd mobile-app
   npm install
   ```
2. Build the dev client (BLE requires a native build, not Expo Go):
   ```bash
   npx expo prebuild
   npx expo run:android
   ```

## BLE Protocol

| Item | Value |
|------|-------|
| Device name | `ESP32-Blender` |
| Service UUID | `4fafc201-1fb5-459e-8fcc-c5c9c331914b` |
| Speed characteristic (write) | `beb5483e-36e1-4688-b7f5-ea07361b26a8` |
| Data format | 4-byte little-endian float (rad/s) |

## Future

- Replace serial log with servo PWM output or relay trigger
- Add speed threshold calibration
- WiFi fallback transport (HTTP POST)

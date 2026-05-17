# OpenCode Agent Instructions

## Project

Blender Spin Controller — phone gyroscope → BLE → ESP32 → blender motor control.

## Build Commands

### ESP32 Firmware
```bash
cd esp32-firmware
pio run --target upload     # build + flash
pio device monitor          # serial monitor (115200 baud)
```

### Mobile App
```bash
cd mobile-app
npm install                            # install deps
npx expo prebuild                      # generate native projects
npx expo run:android                   # build & run on device
```

## Architecture Rules

- **BLE transport only** for now. Do not add WiFi code unless explicitly requested.
- **Write characteristics** only (phone writes speed, ESP32 reads). No read/notify from ESP32 needed yet.
- **Expo dev client** is required. Expo Go does not support `react-native-ble-plx`.

## Coding Conventions

### ESP32 (Arduino / C++)
- Use `BLEDevice` library (bundled with ESP32 Arduino core)
- Log with `Serial.println`, prefix with `[TAG]` (e.g., `[BLE]`, `[SPEED]`)
- Keep `loop()` non-blocking, use `delay()` < 500ms

### Mobile App (TypeScript / React Native)
- Functional components with hooks
- Prefix BLE logs with `[BLE]`
- Service classes for external integrations (`BluetoothService`)
- Constants in `src/utils/constants.ts`
- All new files should be TypeScript (`.ts` / `.tsx`)

## Testing

No test framework is set up yet. Manual testing on real hardware required.

## Common Tasks

- **Change BLE device name**: edit `DEVICE_NAME` in `mobile-app/src/utils/constants.ts` and `main.cpp`
- **Add a new BLE characteristic**: add UUID to `constants.ts`, create characteristic in `main.cpp`, implement in `BluetoothService`
- **Adjust send interval**: change `SEND_INTERVAL_MS` in `constants.ts`

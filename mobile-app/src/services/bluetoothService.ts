import { BleManager, Device, State } from "react-native-ble-plx";
import { SERVICE_UUID, SPEED_CHAR_UUID, DEVICE_NAME } from "../utils/constants";

function floatToBase64(value: number): string {
  const buf = new ArrayBuffer(4);
  const view = new DataView(buf);
  view.setFloat32(0, value, true);
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export class BluetoothService {
  private manager: BleManager;
  private device: Device | null = null;

  constructor() {
    this.manager = new BleManager();
  }

  async getState(): Promise<State> {
    return this.manager.state();
  }

  async scan(
    onFound: (device: Device) => void,
    onDiscovered?: (device: Device) => void,
    onError?: (error: any) => void,
    timeoutMs = 15000
  ): Promise<void> {
    this.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.warn("[BLE] Scan error:", error);
        if (onError) onError(error);
        return;
      }
      if (device) {
        if (device.name === DEVICE_NAME) {
          this.manager.stopDeviceScan();
          onFound(device);
        }
        if (onDiscovered) {
          onDiscovered(device);
        }
      }
    });

    return new Promise((resolve) =>
      setTimeout(() => {
        this.manager.stopDeviceScan();
        resolve();
      }, timeoutMs)
    );
  }

  async connect(device: Device): Promise<void> {
    this.device = await device.connect();
    await this.device.discoverAllServicesAndCharacteristics();
    console.log("[BLE] Connected to", this.device.name);
  }

  async sendSpeed(speed: number): Promise<void> {
    if (!this.device) throw new Error("Not connected");
    const encoded = floatToBase64(speed);
    await this.device.writeCharacteristicWithResponseForService(
      SERVICE_UUID,
      SPEED_CHAR_UUID,
      encoded
    );
  }

  disconnect(): void {
    if (this.device) {
      this.device.cancelConnection();
      this.device = null;
      console.log("[BLE] Disconnected");
    }
  }

  isConnected(): boolean {
    return this.device !== null;
  }

  destroy(): void {
    this.disconnect();
    this.manager.destroy();
  }
}

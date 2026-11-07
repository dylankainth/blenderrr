#include <Arduino.h>
#include <Wire.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>

// ── I2C (to Arduino Uno) ──
static const uint8_t I2C_SDA = 21;
static const uint8_t I2C_SCL = 22;
static const uint8_t ARDUINO_I2C_ADDR = 0x08;

// ── Servo config (SG90 @ 50Hz, 14-bit PWM) ──
static const int SERVO_PIN = 19;
static const int LEDC_CHANNEL = 0;
static const int LEDC_TIMER_BITS = 14;
static const int LEDC_BASE_FREQ = 50;

// 50Hz → 20ms period, 14-bit → 16383 counts → ~1.221 µs/count
// 0°  ≈  500 µs  →  410
// 180° ≈ 2500 µs → 2048
static const int DUTY_0   = 410;
static const int DUTY_60  = map(60, 0, 180, 410, 2048);
static const int DUTY_180 = 2048;

// ── LED progression (Arduino Uno NeoPixel bridge) ──
static int ledLevel = 0;
static int lastSentLevel = -1;

// ── BLE ──
#define SERVICE_UUID    "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define SPEED_CHAR_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

#define LOG_PREFIX "[BLENDER]"
#define SPEED_THRESHOLD 3.5f
#define HOLD_MS 2000

BLECharacteristic *pSpeedCharacteristic;
bool deviceConnected = false;
float currentSpeed = 0.0;
uint32_t lastLogMs = 0;
uint32_t loopCount = 0;

bool servoActive = false;
uint32_t highSpeedStartMs = 0;

// ── Servo helpers ──

static void setupServoPwm() {
#if defined(ESP_ARDUINO_VERSION_MAJOR) && (ESP_ARDUINO_VERSION_MAJOR >= 3)
  ledcAttach(SERVO_PIN, LEDC_BASE_FREQ, LEDC_TIMER_BITS);
#else
  ledcSetup(LEDC_CHANNEL, LEDC_BASE_FREQ, LEDC_TIMER_BITS);
  ledcAttachPin(SERVO_PIN, LEDC_CHANNEL);
#endif
}

static void writeServoDuty(int duty) {
#if defined(ESP_ARDUINO_VERSION_MAJOR) && (ESP_ARDUINO_VERSION_MAJOR >= 3)
  ledcWrite(SERVO_PIN, duty);
#else
  ledcWrite(LEDC_CHANNEL, duty);
#endif
}

static void setServoAngle(int angle) {
  angle = constrain(angle, 0, 180);
  int duty = map(angle, 0, 180, DUTY_0, DUTY_180);
  writeServoDuty(duty);
  Serial.printf("%s Servo → %d°  (duty=%d)\n", LOG_PREFIX, angle, duty);
}

static void sendLedLevel(int level) {
  if (level == lastSentLevel) return;
  lastSentLevel = level;
  Wire.beginTransmission(ARDUINO_I2C_ADDR);
  Wire.write((uint8_t)level);
  Wire.endTransmission();
  Serial.printf("%s I2C → Arduino: %d LEDs\n", LOG_PREFIX, level);
}

static void updateServo() {
  static int lastAngle = -1;
  uint32_t now = millis();

  if (currentSpeed > SPEED_THRESHOLD) {
    if (!servoActive) {
      if (highSpeedStartMs == 0) {
        highSpeedStartMs = now;
        ledLevel = 0;
        sendLedLevel(0);
        Serial.printf("%s [TIMER] Speed above %.1f — %d ms hold started\n",
                      LOG_PREFIX, SPEED_THRESHOLD, HOLD_MS);
      } else if (now - highSpeedStartMs >= HOLD_MS) {
        servoActive = true;
        setServoAngle(60);
        lastAngle = 60;
        Serial.printf("%s [ACT] Hold time met → servo 60°\n", LOG_PREFIX);
      }
    }

    // LED progression: one more LED every 1000ms, up to 5
    uint32_t elapsed = now - highSpeedStartMs;
    int desired = (int)(elapsed / 1000);
    if (desired > 5) desired = 5;
    if (desired != ledLevel) {
      ledLevel = desired;
      sendLedLevel(ledLevel);
      Serial.printf("%s [LED] Level %d (elapsed=%lums)\n", LOG_PREFIX, ledLevel, elapsed);
    }
  } else {
    if (servoActive || highSpeedStartMs != 0) {
      highSpeedStartMs = 0;
      servoActive = false;
      ledLevel = 0;
      sendLedLevel(0);
      setServoAngle(0);
      lastAngle = 0;
      Serial.printf("%s [TIMER] Speed dropped → servo 0°, LEDs off, timer reset\n", LOG_PREFIX);
    }
  }
}

// ── BLE callbacks ──

static void logHex(const char *label, const uint8_t *data, size_t len) {
  char buf[128];
  size_t pos = 0;
  pos += snprintf(buf + pos, sizeof(buf) - pos, "%s %s (%d bytes): ", LOG_PREFIX, label, len);
  for (size_t i = 0; i < len && pos < sizeof(buf) - 5; i++) {
    pos += snprintf(buf + pos, sizeof(buf) - pos, "%02x ", data[i]);
  }
  Serial.println(buf);
}

class ServerCallbacks : public BLEServerCallbacks {
  void onConnect(BLEServer *pServer, esp_ble_gatts_cb_param_t *param) override {
    deviceConnected = true;
    char addr[18];
    snprintf(addr, sizeof(addr), "%02x:%02x:%02x:%02x:%02x:%02x",
             param->connect.remote_bda[0], param->connect.remote_bda[1],
             param->connect.remote_bda[2], param->connect.remote_bda[3],
             param->connect.remote_bda[4], param->connect.remote_bda[5]);
    Serial.printf("%s Client connected from %s\n", LOG_PREFIX, addr);
    Serial.printf("%s Connection count: %d\n", LOG_PREFIX, pServer->getConnectedCount());
  }

  void onDisconnect(BLEServer *pServer) override {
    deviceConnected = false;
    currentSpeed = 0.0;
    Serial.printf("%s Client disconnected — speed reset\n", LOG_PREFIX);
    updateServo();
    BLEDevice::startAdvertising();
    Serial.printf("%s Advertising resumed\n", LOG_PREFIX);
  }
};

class SpeedCallbacks : public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic *pCharacteristic) override {
    std::string value = pCharacteristic->getValue().c_str();
    Serial.printf("%s onWrite | len=%d\n", LOG_PREFIX, value.length());
    logHex("RX", (const uint8_t *)value.data(), value.length());

    if (value.length() >= 4) {
      float prev = currentSpeed;
      memcpy(&currentSpeed, value.data(), 4);
      Serial.printf("%s Speed: %.4f → %.4f rad/s\n", LOG_PREFIX, prev, currentSpeed);
      updateServo();
    } else {
      Serial.printf("%s WARN: short payload (%d bytes)\n", LOG_PREFIX, value.length());
    }
  }
};

// ── Setup ──

void setup() {
  Serial.begin(115200);
  Serial.setDebugOutput(true);
  Serial.printf("\n%s ========================\n", LOG_PREFIX);
  Serial.printf("%s ESP32 BLE Blender Controller + Servo\n", LOG_PREFIX);
  Serial.printf("%s Chip: %s rev %d\n", LOG_PREFIX, ESP.getChipModel(), ESP.getChipRevision());
  Serial.printf("%s Heap: %d bytes\n", LOG_PREFIX, ESP.getFreeHeap());
  Serial.printf("%s Speed > %.1f rad/s for %d ms → servo 60°, else 0°\n", LOG_PREFIX, SPEED_THRESHOLD, HOLD_MS);
  Serial.printf("%s ========================\n", LOG_PREFIX);

  setupServoPwm();
  setServoAngle(0);
  Serial.printf("%s Servo initialised at 0°\n", LOG_PREFIX);

  Wire.begin(I2C_SDA, I2C_SCL);
  Serial.printf("%s I2C master on SDA=%d SCL=%d\n", LOG_PREFIX, I2C_SDA, I2C_SCL);

  Serial.printf("%s Starting BLE...\n", LOG_PREFIX);
  BLEDevice::init("ESP32-Blender");

  BLEServer *pServer = BLEDevice::createServer();
  pServer->setCallbacks(new ServerCallbacks());

  BLEService *pService = pServer->createService(SERVICE_UUID);
  Serial.printf("%s Service: %s\n", LOG_PREFIX, SERVICE_UUID);

  pSpeedCharacteristic = pService->createCharacteristic(
    SPEED_CHAR_UUID,
    BLECharacteristic::PROPERTY_WRITE | BLECharacteristic::PROPERTY_NOTIFY
  );
  pSpeedCharacteristic->setCallbacks(new SpeedCallbacks());

  pService->start();

  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);
  pAdvertising->setMaxPreferred(0x12);
  BLEDevice::startAdvertising();
  Serial.printf("%s Advertising as \"ESP32-Blender\"\n", LOG_PREFIX);
  Serial.printf("%s ========================\n", LOG_PREFIX);
}

// ── Loop ──

void loop() {
  loopCount++;

  if (deviceConnected && currentSpeed > 0.3) {
    Serial.printf("%s [ACT] Motor running @ %.4f rad/s\n", LOG_PREFIX, currentSpeed);
  }

  updateServo();

  uint32_t now = millis();
  if (now - lastLogMs >= 10000) {
    lastLogMs = now;
    unsigned long elapsed = (highSpeedStartMs == 0) ? 0 : (now - highSpeedStartMs);
    Serial.printf("%s [HEARTBEAT] loops=%lu | connected=%d | speed=%.4f | hold=%lu/%dms | servo=%s | leds=%d\n",
                  LOG_PREFIX, loopCount, deviceConnected, currentSpeed,
                  elapsed, HOLD_MS, servoActive ? "60°" : "0°", ledLevel);
    loopCount = 0;
  }

  delay(200);
}

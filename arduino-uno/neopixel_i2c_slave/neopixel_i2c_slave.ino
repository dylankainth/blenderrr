// Arduino Uno I2C slave — receives LED count from ESP32, drives NeoPixel strip.
// I2C address: 0x08
// Wire: A4 (SDA) → ESP32 pin 21, A5 (SCL) → ESP32 pin 22, GND → GND

#include <Wire.h>
#include <Adafruit_NeoPixel.h>

static const uint8_t I2C_ADDR = 0x08;
static const uint8_t LED_PIN = 6;
static const uint8_t LED_COUNT = 5;

Adafruit_NeoPixel strip(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);
uint32_t baseColors[LED_COUNT];
volatile uint8_t requestedCount = 0;

static uint32_t makeGradientColor(uint8_t index, uint8_t maxIndex) {
  uint8_t red   = (uint8_t)((255UL * (maxIndex - index)) / maxIndex);
  uint8_t green = (uint8_t)((255UL * index) / maxIndex);
  return strip.Color(red, green, 0);
}

static void applyStrip() {
  for (uint8_t i = 0; i < LED_COUNT; ++i) {
    strip.setPixelColor(i, i < requestedCount ? baseColors[i] : 0);
  }
  strip.show();
}

void receiveEvent(int numBytes) {
  if (numBytes < 1) return;
  uint8_t cmd = Wire.read();
  if (cmd > LED_COUNT) cmd = LED_COUNT;
  requestedCount = cmd;
  applyStrip();
}

void setup() {
  Serial.begin(9600);
  strip.begin();
  strip.show();

  uint8_t maxIndex = LED_COUNT - 1;
  for (uint8_t i = 0; i < LED_COUNT; ++i) {
    baseColors[i] = makeGradientColor(i, maxIndex);
  }

  Wire.begin(I2C_ADDR);
  Wire.onReceive(receiveEvent);

  applyStrip();
  Serial.print(F("I2C slave at 0x"));
  Serial.print(I2C_ADDR, HEX);
  Serial.println(F(" ready"));
}

void loop() {
  delay(100);
}

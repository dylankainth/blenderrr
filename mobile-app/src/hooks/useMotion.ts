import { useState, useEffect, useCallback } from "react";
import { Gyroscope } from "expo-sensors";

export interface MotionData {
  rotationSpeed: number;
  x: number;
  y: number;
  z: number;
}

export function useMotion() {
  const [data, setData] = useState<MotionData>({
    rotationSpeed: 0,
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] =
    useState<ReturnType<typeof Gyroscope.addListener> | null>(null);

  const isActive = subscription !== null;

  const subscribe = useCallback(() => {
    Gyroscope.setUpdateInterval(100);
    const sub = Gyroscope.addListener((gyroData) => {
      const { x, y, z } = gyroData;
      const speed = Math.sqrt(x * x + y * y + z * z);
      setData({ rotationSpeed: speed, x, y, z });
    });
    setSubscription(sub);
  }, []);

  const unsubscribe = useCallback(() => {
    if (subscription) {
      subscription.remove();
      setSubscription(null);
    }
  }, [subscription]);

  useEffect(() => {
    return () => {
      if (subscription) subscription.remove();
    };
  }, [subscription]);

  return { data, isActive, subscribe, unsubscribe };
}

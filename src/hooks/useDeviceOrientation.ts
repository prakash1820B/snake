import { useState, useEffect, useCallback, useRef } from 'react';
import { Direction } from './useGame';

const TILT_THRESHOLD = 15; // degrees
const DEBOUNCE_MS = 150; // prevent rapid direction changes

export function useDeviceOrientation(changeDirection: (dir: Direction) => void) {
  const [motionEnabled, setMotionEnabled] = useState(false);
  const [motionSupported, setMotionSupported] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [currentTilt, setCurrentTilt] = useState<{ beta: number; gamma: number }>({ beta: 0, gamma: 0 });
  
  const lastDirectionRef = useRef<Direction | null>(null);
  const lastChangeTimeRef = useRef(0);

  // Check if device orientation is supported
  useEffect(() => {
    if ('DeviceOrientationEvent' in window) {
      setMotionSupported(true);
    }
  }, []);

  // Handle orientation changes
  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    const beta = event.beta ?? 0;   // front-back tilt (-180 to 180)
    const gamma = event.gamma ?? 0; // left-right tilt (-90 to 90)
    
    setCurrentTilt({ beta, gamma });

    const now = Date.now();
    if (now - lastChangeTimeRef.current < DEBOUNCE_MS) {
      return;
    }

    let newDir: Direction | null = null;

    // Determine primary tilt direction
    const absBeta = Math.abs(beta);
    const absGamma = Math.abs(gamma);

    if (absBeta > TILT_THRESHOLD || absGamma > TILT_THRESHOLD) {
      if (absBeta > absGamma) {
        // Front-back tilt is dominant
        // Positive beta = phone tilted forward (top away) = UP
        // Negative beta = phone tilted backward (top toward) = DOWN
        newDir = beta > 0 ? 'UP' : 'DOWN';
      } else {
        // Left-right tilt is dominant
        // Positive gamma = phone tilted right = RIGHT
        // Negative gamma = phone tilted left = LEFT
        newDir = gamma > 0 ? 'RIGHT' : 'LEFT';
      }

      // Only change if direction is different
      if (newDir !== lastDirectionRef.current) {
        lastDirectionRef.current = newDir;
        lastChangeTimeRef.current = now;
        changeDirection(newDir);
      }
    }
  }, [changeDirection]);

  // Request permission (required for iOS 13+)
  const requestPermission = useCallback(async () => {
    if (!motionSupported) return false;

    // iOS 13+ requires explicit permission
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          setPermissionGranted(true);
          return true;
        }
        return false;
      } catch (err) {
        console.error('Permission request failed:', err);
        return false;
      }
    } else {
      // Android and older iOS don't require permission
      setPermissionGranted(true);
      return true;
    }
  }, [motionSupported]);

  // Enable/disable motion controls
  const toggleMotion = useCallback(async () => {
    if (!motionEnabled) {
      const granted = await requestPermission();
      if (granted) {
        setMotionEnabled(true);
      }
    } else {
      setMotionEnabled(false);
      lastDirectionRef.current = null;
    }
  }, [motionEnabled, requestPermission]);

  // Add/remove event listener
  useEffect(() => {
    if (motionEnabled && permissionGranted) {
      window.addEventListener('deviceorientation', handleOrientation, true);
      return () => {
        window.removeEventListener('deviceorientation', handleOrientation, true);
      };
    }
  }, [motionEnabled, permissionGranted, handleOrientation]);

  return {
    motionEnabled,
    motionSupported,
    currentTilt,
    toggleMotion,
  };
}

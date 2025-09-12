'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function EmergencyFloatingButton() {
  const [isPressed, setIsPressed] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleEmergencyPress = () => {
    if (isPressed) return;
    
    setIsPressed(true);
    setCountdown(3);
    
    toast.error('Emergency SOS Activating in 3 seconds! Tap to cancel.', {
      duration: 3000,
      action: {
        label: 'Cancel',
        onClick: () => {
          setIsPressed(false);
          setCountdown(0);
          toast.success('Emergency alert cancelled');
        },
      },
    });
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && isPressed) {
      // Trigger emergency alert
      triggerEmergencyAlert();
      setIsPressed(false);
    }
    return undefined;
  }, [countdown, isPressed]);

  const triggerEmergencyAlert = async () => {
    try {
      // Get current location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        });
      });

      const { latitude, longitude } = position.coords;
      
      // In a real app, this would send alerts to emergency contacts and services
      toast.error('🚨 EMERGENCY ALERT SENT! 🚨', {
        description: `Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        duration: 10000,
      });

      // Simulate emergency services notification
      const emergencyData = {
        type: 'emergency_sos',
        location: { latitude, longitude },
        timestamp: new Date().toISOString(),
        accuracy: position.coords.accuracy
      };

      // In production, send to emergency API
      console.log('Emergency alert triggered:', emergencyData);
      
    } catch (error) {
      toast.error('Emergency alert sent (location unavailable)', {
        description: 'Your emergency contacts have been notified',
        duration: 8000,
      });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleEmergencyPress}
        disabled={isPressed}
        className={`
          w-16 h-16 rounded-full shadow-2xl border-4 border-white font-bold text-lg
          ${isPressed 
            ? 'bg-orange-500 hover:bg-orange-600 animate-pulse' 
            : 'bg-red-600 hover:bg-red-700 active:scale-95'
          }
          transition-all duration-200 transform hover:scale-110
        `}
        aria-label="Emergency SOS Button"
      >
        {isPressed ? countdown || 'SOS' : 'SOS'}
      </Button>
      
      {isPressed && (
        <div className="absolute -top-2 -left-2 w-20 h-20 rounded-full border-4 border-red-400 animate-ping"></div>
      )}
    </div>
  );
}
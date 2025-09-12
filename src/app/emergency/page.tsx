'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { toast } from 'sonner';

export default function EmergencyPage() {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);

  const emergencyContacts = [
    { name: 'Emergency Services', number: '911', type: 'primary' },
    { name: 'Local Police', number: '911', type: 'primary' },
    { name: 'Mom', number: '+1234567890', type: 'personal' },
    { name: 'Best Friend', number: '+1234567891', type: 'personal' },
  ];

  const quickActions = [
    { title: 'Call 911', action: () => window.location.href = 'tel:911', color: 'bg-red-600' },
    { title: 'Text Location', action: sendLocationSMS, color: 'bg-blue-600' },
    { title: 'Record Audio', action: startRecording, color: 'bg-purple-600' },
    { title: 'Flash Light', action: toggleFlashlight, color: 'bg-yellow-600' },
  ];

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.error('Location error:', error);
      }
    );
  };

  const activateEmergencyProtocol = () => {
    if (isEmergencyActive) return;
    
    setIsEmergencyActive(true);
    setCountdown(5);
    
    toast.error('🚨 EMERGENCY PROTOCOL ACTIVATING', {
      description: 'All emergency contacts will be notified in 5 seconds',
      duration: 5000,
      action: {
        label: 'CANCEL',
        onClick: () => {
          setIsEmergencyActive(false);
          setCountdown(0);
          toast.success('Emergency protocol cancelled');
        },
      },
    });

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          executeEmergencyProtocol();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const executeEmergencyProtocol = async () => {
    try {
      // Send alerts to all emergency contacts
      for (const contact of emergencyContacts) {
        if (contact.type === 'personal') {
          await sendEmergencyAlert(contact);
        }
      }

      // Start audio recording
      await startRecording();

      // Share location
      await sendLocationSMS();

      toast.error('🚨 EMERGENCY ALERTS SENT', {
        description: 'All contacts notified. Recording started.',
        duration: 10000,
      });

    } catch (error) {
      toast.error('Emergency protocol executed (some features unavailable)');
    } finally {
      setIsEmergencyActive(false);
    }
  };

  const sendEmergencyAlert = async (contact: any) => {
    // In a real app, this would send SMS/call through emergency API
    console.log(`Emergency alert sent to ${contact.name}: ${contact.number}`);
    
    if (location) {
      const message = `EMERGENCY: I need help! My location: https://maps.google.com/maps?q=${location.lat},${location.lng}`;
      console.log(`Message: ${message}`);
    }
  };

  function sendLocationSMS() {
    if (!location) {
      toast.error('Location not available');
      return;
    }

    const message = `EMERGENCY - My current location: https://maps.google.com/maps?q=${location.lat},${location.lng}`;
    
    // In a real app, this would integrate with SMS API
    if (navigator.share) {
      navigator.share({
        title: 'Emergency Location',
        text: message
      });
    } else {
      navigator.clipboard.writeText(message);
      toast.success('Location message copied to clipboard');
    }
  }

  function startRecording() {
    // In a real app, this would start audio/video recording
    toast.info('🎤 Audio recording started', {
      description: 'Recording evidence for your safety'
    });
  }

  function toggleFlashlight() {
    // In a real app with proper hardware access
    toast.info('Flashlight toggled (requires device support)');
  }

  return (
    <div className="min-h-screen bg-red-50">
      {/* Header */}
      <div className="bg-red-600 text-white p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">🚨 Emergency Center</h1>
              <p className="text-red-100">Immediate safety and emergency response</p>
            </div>
            <Link href="/">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
                Back to Safety
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Main Emergency Button */}
        <Card className="border-red-300 shadow-lg">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Emergency Protocol Activation
            </h2>
            <p className="text-gray-600 mb-6">
              This will immediately alert all your emergency contacts and activate safety features
            </p>
            
            <Button
              onClick={activateEmergencyProtocol}
              disabled={isEmergencyActive}
              size="lg"
              className={`w-48 h-16 text-xl font-bold rounded-full ${
                isEmergencyActive 
                  ? 'bg-orange-500 hover:bg-orange-600 animate-pulse' 
                  : 'bg-red-600 hover:bg-red-700'
              } shadow-lg transform transition-transform hover:scale-105`}
            >
              {isEmergencyActive ? `ACTIVATING ${countdown}` : '🚨 EMERGENCY SOS'}
            </Button>

            {isEmergencyActive && (
              <div className="mt-4">
                <div className="w-64 h-64 mx-auto border-4 border-red-400 rounded-full animate-ping absolute"></div>
                <p className="text-red-700 font-semibold">
                  Emergency protocol activating... Tap CANCEL to abort
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Emergency Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  onClick={action.action}
                  className={`${action.color} hover:opacity-90 h-16 text-white font-semibold`}
                >
                  {action.title}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Contacts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {emergencyContacts.map((contact, index) => (
              <div key={index}>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      contact.type === 'primary' ? 'bg-red-500' : 'bg-blue-500'
                    }`}></div>
                    <div>
                      <p className="font-semibold">{contact.name}</p>
                      <p className="text-sm text-gray-600">{contact.number}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.location.href = `tel:${contact.number}`}
                    >
                      Call
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.location.href = `sms:${contact.number}?body=EMERGENCY: I need help!`}
                    >
                      Text
                    </Button>
                  </div>
                </div>
                {index < emergencyContacts.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Current Location */}
        <Card>
          <CardHeader>
            <CardTitle>Current Location Status</CardTitle>
          </CardHeader>
          <CardContent>
            {location ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">GPS Coordinates:</span>
                  <Badge variant="outline">{location.lat.toFixed(6)}, {location.lng.toFixed(6)}</Badge>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={sendLocationSMS}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Share My Location
                  </Button>
                  <Button 
                    onClick={() => window.open(`https://maps.google.com/maps?q=${location.lat},${location.lng}`, '_blank')}
                    variant="outline"
                    className="flex-1"
                  >
                    View on Map
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-600 mb-3">Getting your location...</p>
                <Button onClick={getCurrentLocation} variant="outline">
                  Refresh Location
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Emergency Instructions */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-800">Emergency Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-yellow-900">
            <p>• <strong>Stay Calm:</strong> Take deep breaths and assess your situation</p>
            <p>• <strong>Call 911:</strong> For immediate life-threatening emergencies</p>
            <p>• <strong>Share Location:</strong> Always let someone know where you are</p>
            <p>• <strong>Stay Connected:</strong> Keep your phone charged and accessible</p>
            <p>• <strong>Trust Your Instincts:</strong> If something feels wrong, take action</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
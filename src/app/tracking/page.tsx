'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  address?: string;
}

interface TrackingSession {
  id: string;
  startTime: number;
  endTime?: number;
  locations: LocationData[];
  sharedWith: string[];
  sessionType: 'journey' | 'meeting' | 'emergency';
}

export default function TrackingPage() {
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [trackingSession, setTrackingSession] = useState<TrackingSession | null>(null);
  const [shareEnabled, setShareEnabled] = useState(false);
  const [batteryOptimized, setBatteryOptimized] = useState(true);
  
  const emergencyContacts = [
    { id: '1', name: 'Mom', phone: '+1234567890', sharing: true },
    { id: '2', name: 'Sarah', phone: '+1234567891', sharing: false },
    { id: '3', name: 'Partner', phone: '+1234567892', sharing: true },
  ];

  useEffect(() => {
    if (isTracking) {
      startLocationTracking();
    } else {
      stopLocationTracking();
    }
  }, [isTracking]);

  const startLocationTracking = () => {
    const session: TrackingSession = {
      id: Date.now().toString(),
      startTime: Date.now(),
      locations: [],
      sharedWith: emergencyContacts.filter(c => c.sharing).map(c => c.name),
      sessionType: 'journey'
    };
    
    setTrackingSession(session);
    trackLocation();
    
    // Set up interval for continuous tracking
    const interval = setInterval(() => {
      if (isTracking) {
        trackLocation();
      } else {
        clearInterval(interval);
      }
    }, batteryOptimized ? 60000 : 30000); // Every 1-2 minutes
  };

  const stopLocationTracking = () => {
    if (trackingSession) {
      const updatedSession = {
        ...trackingSession,
        endTime: Date.now()
      };
      setTrackingSession(updatedSession);
      
      // Save to local storage for history
      const sessions = JSON.parse(localStorage.getItem('tracking_sessions') || '[]');
      sessions.push(updatedSession);
      localStorage.setItem('tracking_sessions', JSON.stringify(sessions.slice(-10))); // Keep last 10 sessions
    }
  };

  const trackLocation = async () => {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: !batteryOptimized,
            timeout: 10000,
            maximumAge: batteryOptimized ? 300000 : 60000
          }
        );
      });

      const locationData: LocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: Date.now()
      };

      setCurrentLocation(locationData);

      if (trackingSession) {
        const updatedSession = {
          ...trackingSession,
          locations: [...trackingSession.locations, locationData]
        };
        setTrackingSession(updatedSession);

        // Send location to shared contacts if enabled
        if (shareEnabled) {
          shareLocationUpdate(locationData);
        }
      }
    } catch (error) {
      console.error('Location tracking error:', error);
    }
  };

  const shareLocationUpdate = (location: LocationData) => {
    const sharedContacts = emergencyContacts.filter(c => c.sharing);
    const locationUrl = `https://maps.google.com/maps?q=${location.latitude},${location.longitude}`;
    const message = `SafeGuard Update: My current location - ${locationUrl}`;
    
    // In a real app, this would send updates via SMS/API
    console.log('Sharing location with contacts:', sharedContacts, message);
  };

  const sendSafeArrivalNotification = () => {
    const message = "SafeGuard: I have arrived safely at my destination.";
    emergencyContacts.filter(c => c.sharing).forEach(contact => {
      // In a real app, this would send SMS
      console.log(`Safe arrival notification sent to ${contact.name}: ${contact.phone} - ${message}`);
    });
    
    setIsTracking(false);
    alert('Safe arrival notification sent to your contacts!');
  };

  const toggleContactSharing = (contactId: string) => {
    // In a real app, this would update the contact preferences
    console.log(`Toggled sharing for contact ${contactId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Live Location Tracking</h1>
              <p className="text-gray-600">Share your location with trusted contacts</p>
            </div>
            <Link href="/">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Tracking Status */}
        <Card className={`border-2 ${isTracking ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${
                  isTracking ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                }`}></div>
                Tracking Status
              </div>
              <Badge variant={isTracking ? 'default' : 'outline'}>
                {isTracking ? 'Active' : 'Inactive'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">
                  {isTracking 
                    ? 'Your location is being shared with selected contacts' 
                    : 'Location tracking is currently disabled'
                  }
                </p>
                {trackingSession && (
                  <p className="text-xs text-gray-500 mt-1">
                    Started: {new Date(trackingSession.startTime).toLocaleTimeString()}
                    {trackingSession.locations.length > 0 && 
                      ` • ${trackingSession.locations.length} location updates`
                    }
                  </p>
                )}
              </div>
              <Button
                onClick={() => setIsTracking(!isTracking)}
                size="lg"
                className={isTracking ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
              >
                {isTracking ? 'Stop Tracking' : 'Start Tracking'}
              </Button>
            </div>

            {isTracking && trackingSession && (
              <div className="mt-4 p-4 bg-white rounded-lg border">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium">Session Progress</span>
                  <Button onClick={sendSafeArrivalNotification} className="bg-blue-600 hover:bg-blue-700">
                    I've Arrived Safely
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Duration: {Math.round((Date.now() - trackingSession.startTime) / 60000)} minutes</span>
                    <span>Updates: {trackingSession.locations.length}</span>
                  </div>
                  <Progress value={Math.min((trackingSession.locations.length / 10) * 100, 100)} className="h-2" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Current Location */}
        {currentLocation && (
          <Card>
            <CardHeader>
              <CardTitle>Current Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Latitude:</span>
                    <p className="text-gray-600">{currentLocation.latitude.toFixed(6)}</p>
                  </div>
                  <div>
                    <span className="font-medium">Longitude:</span>
                    <p className="text-gray-600">{currentLocation.longitude.toFixed(6)}</p>
                  </div>
                  <div>
                    <span className="font-medium">Accuracy:</span>
                    <p className="text-gray-600">±{Math.round(currentLocation.accuracy)}m</p>
                  </div>
                  <div>
                    <span className="font-medium">Last Update:</span>
                    <p className="text-gray-600">{new Date(currentLocation.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => window.open(`https://maps.google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}`, '_blank')}
                    className="flex-1"
                  >
                    View on Map
                  </Button>
                  <Button 
                    onClick={() => {
                      const url = `https://maps.google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}`;
                      navigator.clipboard.writeText(url);
                      alert('Location link copied to clipboard!');
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Copy Location
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sharing Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Sharing Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="share-enabled">Enable Location Sharing</Label>
                <p className="text-sm text-gray-600">Share real-time updates with selected contacts</p>
              </div>
              <Switch
                id="share-enabled"
                checked={shareEnabled}
                onCheckedChange={setShareEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="battery-optimized">Battery Optimization</Label>
                <p className="text-sm text-gray-600">Reduce location updates to save battery</p>
              </div>
              <Switch
                id="battery-optimized"
                checked={batteryOptimized}
                onCheckedChange={setBatteryOptimized}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Sharing List */}
        <Card>
          <CardHeader>
            <CardTitle>Share With Contacts</CardTitle>
            <p className="text-sm text-gray-600">Select which contacts receive your location updates</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {emergencyContacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${contact.sharing ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-gray-600">{contact.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={contact.sharing ? 'default' : 'outline'}>
                    {contact.sharing ? 'Sharing' : 'Not Sharing'}
                  </Badge>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => toggleContactSharing(contact.id)}
                  >
                    Toggle
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Journey Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Journey Setup</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={() => {
                  setIsTracking(true);
                  setShareEnabled(true);
                }} 
                className="h-20 flex-col"
                variant="outline"
              >
                <div className="font-semibold">Going Home</div>
                <div className="text-xs text-gray-600">Track journey home</div>
              </Button>
              <Button 
                onClick={() => {
                  setIsTracking(true);
                  setShareEnabled(true);
                  setBatteryOptimized(false);
                }} 
                className="h-20 flex-col bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                <div className="font-semibold">Night Out</div>
                <div className="text-xs">High-frequency tracking</div>
              </Button>
              <Button 
                onClick={() => {
                  setIsTracking(true);
                  setShareEnabled(true);
                }} 
                className="h-20 flex-col bg-purple-600 hover:bg-purple-700 text-white"
              >
                <div className="font-semibold">Meeting Someone</div>
                <div className="text-xs">Share location for meetup</div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Safety Tips */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">Location Sharing Safety Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-blue-900">
            <p>• <strong>Always inform trusted contacts</strong> about your travel plans</p>
            <p>• <strong>Use journey templates</strong> for common trips like going home</p>
            <p>• <strong>Send safe arrival notifications</strong> when you reach your destination</p>
            <p>• <strong>Keep your phone charged</strong> during tracking sessions</p>
            <p>• <strong>Review sharing permissions</strong> regularly to maintain privacy</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
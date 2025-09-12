'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export default function LocationTracker() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState<string>('Getting location...');

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    setIsTracking(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          }
        );
      });

      const locationData: LocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: Date.now()
      };

      setLocation(locationData);
      await getAddressFromCoords(locationData.latitude, locationData.longitude);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unable to get location';
      setError(errorMessage);
      setAddress('Location unavailable');
    } finally {
      setIsTracking(false);
    }
  };

  const getAddressFromCoords = async (lat: number, lng: number) => {
    try {
      // In a real app, you would use a geocoding service
      // For demo purposes, we'll show a mock address
      setAddress(`Near ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    } catch {
      setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }
  };

  const shareLocation = async () => {
    if (!location) {
      await getCurrentLocation();
      return;
    }

    const locationUrl = `https://maps.google.com/maps?q=${location.latitude},${location.longitude}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Current Location - SafeGuard',
          text: `I'm currently at: ${address}`,
          url: locationUrl,
        });
      } catch (err) {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(`My location: ${locationUrl}`);
        alert('Location link copied to clipboard!');
      }
    } else {
      await navigator.clipboard.writeText(`My location: ${locationUrl}`);
      alert('Location link copied to clipboard!');
    }
  };

  const getAccuracyBadge = (accuracy: number) => {
    if (accuracy < 10) return { text: 'Excellent', variant: 'default' as const };
    if (accuracy < 50) return { text: 'Good', variant: 'secondary' as const };
    return { text: 'Fair', variant: 'outline' as const };
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          Current Location
          {location && (
            <Badge variant={getAccuracyBadge(location.accuracy).variant}>
              {getAccuracyBadge(location.accuracy).text} GPS
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-center py-4">
            <p className="text-red-600 mb-4">Location Error: {error}</p>
            <Button onClick={getCurrentLocation} disabled={isTracking} variant="outline">
              {isTracking ? 'Getting Location...' : 'Retry Location'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{address}</p>
                {location && (
                  <p className="text-sm text-gray-500">
                    Accuracy: ±{Math.round(location.accuracy)}m
                  </p>
                )}
              </div>
              <Button
                onClick={getCurrentLocation}
                disabled={isTracking}
                variant="outline"
                size="sm"
              >
                {isTracking ? 'Updating...' : 'Refresh'}
              </Button>
            </div>

            {location && (
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={shareLocation}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Share Location
                </Button>
                <Button
                  onClick={() => window.open(`https://maps.google.com/maps?q=${location.latitude},${location.longitude}`, '_blank')}
                  variant="outline"
                >
                  View on Map
                </Button>
              </div>
            )}

            {isTracking && (
              <div className="flex items-center justify-center py-2">
                <div className="animate-pulse flex space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animation-delay-200"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animation-delay-400"></div>
                </div>
                <span className="ml-3 text-sm text-gray-600">Getting your location...</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
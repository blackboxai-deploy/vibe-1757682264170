'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import LocationTracker from '@/components/LocationTracker';
import SafetyStatus from '@/components/SafetyStatus';

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [batteryLevel, setBatteryLevel] = useState<number>(100);
  const [locationPermission, setLocationPermission] = useState<string>('checking');

  useEffect(() => {
    // Update time every minute
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timeInterval = setInterval(updateTime, 60000);

    // Check location permission
    if (navigator.geolocation) {
      navigator.permissions?.query({ name: 'geolocation' }).then((permission) => {
        setLocationPermission(permission.state);
      });
    }

    // Mock battery level (in real app would use Battery API)
    setBatteryLevel(Math.floor(Math.random() * 40) + 60); // 60-100%

    return () => clearInterval(timeInterval);
  }, []);

  const quickActions = [
    {
      title: 'Emergency SOS',
      description: 'Instant emergency alert',
      href: '/emergency',
      color: 'bg-red-600 hover:bg-red-700',
      urgent: true,
    },
    {
      title: 'Share Location',
      description: 'Live location with contacts',
      href: '/tracking',
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      title: 'Safety Check-in',
      description: 'Schedule safety reminders',
      href: '/checkin',
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      title: 'Emergency Contacts',
      description: 'Manage trusted contacts',
      href: '/contacts',
      color: 'bg-purple-600 hover:bg-purple-700',
    },
  ];

  const safetyFeatures = [
    {
      title: 'Community Safety',
      description: 'Report and view safety alerts',
      href: '/community',
    },
    {
      title: 'Safety Resources',
      description: 'Tips and emergency numbers',
      href: '/resources',
    },
    {
      title: 'Safe Routes',
      description: 'Find well-lit, safe paths',
      href: '/routes',
    },
    {
      title: 'Evidence Recorder',
      description: 'Quick audio/video recording',
      href: '/recorder',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SafeGuard</h1>
              <p className="text-sm text-gray-600">Your personal safety companion</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900">{currentTime}</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={locationPermission === 'granted' ? 'default' : 'destructive'} className="text-xs">
                  GPS {locationPermission === 'granted' ? 'Active' : 'Inactive'}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Battery {batteryLevel}%
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Safety Status */}
        <SafetyStatus />

        {/* Emergency Alert Banner */}
        <div className="mb-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Emergency Preparedness</h2>
              <p className="text-red-100 mb-4">
                In case of emergency, press the red SOS button or use the floating emergency button
              </p>
            </div>
            <div className="hidden sm:block">
              <img 
                src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/c7488869-9e6d-4414-9ff4-1a080fd869dc.png" 
                alt="Emergency safety illustration with shield and phone" 
                className="rounded-lg opacity-80"
              />
            </div>
          </div>
          <Link href="/emergency">
            <Button size="lg" className="bg-white text-red-600 hover:bg-red-50 font-semibold">
              Access Emergency Features
            </Button>
          </Link>
        </div>

        {/* Quick Actions Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Safety Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action) => (
              <Link key={action.title} href={action.href}>
                <Card className={`h-full transition-all duration-200 hover:scale-105 border-0 shadow-lg ${
                  action.urgent ? 'ring-2 ring-red-500 ring-opacity-50' : ''
                }`}>
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center mb-4`}>
                      <div className="w-6 h-6 bg-white rounded-full"></div>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-900">{action.title}</h3>
                    <p className="text-gray-600 text-sm">{action.description}</p>
                    {action.urgent && (
                      <Badge className="mt-3 bg-red-100 text-red-800 hover:bg-red-100">
                        Priority Access
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Current Location */}
        <div className="mb-8">
          <LocationTracker />
        </div>

        {/* Safety Features Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Safety Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {safetyFeatures.map((feature) => (
              <Link key={feature.title} href={feature.href}>
                <Card className="h-full transition-all duration-200 hover:scale-105 border hover:shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-2">
                      <div className="w-5 h-5 bg-white rounded"></div>
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Safety Tips */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Daily Safety Tip</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-800 mb-4">
              Always inform someone you trust about your travel plans, especially when going to unfamiliar places or during late hours.
            </p>
            <div className="flex items-center gap-4">
              <Progress value={75} className="flex-1 h-2" />
              <span className="text-sm text-blue-700 font-medium">Safety Score: 75%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
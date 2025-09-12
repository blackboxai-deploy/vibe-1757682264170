'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function SafetyStatus() {
  const [safetyScore, setSafetyScore] = useState(0);
  const [status, setStatus] = useState<'safe' | 'caution' | 'danger'>('safe');

  useEffect(() => {
    calculateSafetyScore();
  }, []);

  const calculateSafetyScore = () => {
    let score = 0;
    
    // Check location permission
    navigator.permissions?.query({ name: 'geolocation' }).then((permission) => {
      if (permission.state === 'granted') score += 25;
    });

    // Check time of day
    const hour = new Date().getHours();
    if (hour >= 6 && hour <= 20) {
      score += 25; // Daytime
    } else {
      score += 10; // Nighttime
    }

    // Simulate other safety factors
    score += Math.floor(Math.random() * 30) + 20; // 20-50 points

    setSafetyScore(score);
    
    if (score >= 70) setStatus('safe');
    else if (score >= 40) setStatus('caution');
    else setStatus('danger');
  };

  const getStatusColor = () => {
    switch (status) {
      case 'safe': return 'bg-green-100 text-green-800 border-green-200';
      case 'caution': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'danger': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'safe': return 'You\'re in a relatively safe environment';
      case 'caution': return 'Exercise normal safety precautions';
      case 'danger': return 'Consider extra safety measures';
      default: return 'Calculating safety status...';
    }
  };

  return (
    <Card className={`mb-6 border-2 ${getStatusColor()}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              status === 'safe' ? 'bg-green-500' : 
              status === 'caution' ? 'bg-yellow-500' : 'bg-red-500'
            } animate-pulse`}></div>
            <div>
              <p className="font-semibold text-sm uppercase tracking-wide">Safety Status</p>
              <p className="text-sm opacity-90">{getStatusMessage()}</p>
            </div>
          </div>
          <Badge variant="outline" className={`font-semibold ${
            status === 'safe' ? 'border-green-500 text-green-700' : 
            status === 'caution' ? 'border-yellow-500 text-yellow-700' : 'border-red-500 text-red-700'
          }`}>
            {safetyScore}/100
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
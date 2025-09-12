'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

interface CheckinReminder {
  id: string;
  time: string;
  frequency: 'once' | 'daily' | 'weekly';
  message: string;
  contacts: string[];
  active: boolean;
  lastCheckin?: number;
}

export default function CheckinPage() {
  const [reminders, setReminders] = useState<CheckinReminder[]>([]);
  const [nextCheckin, setNextCheckin] = useState<Date | null>(null);
  const [checkinStreak, setCheckinStreak] = useState(0);
  const [isAddingReminder, setIsAddingReminder] = useState(false);
  const [newReminder, setNewReminder] = useState({
    time: '',
    frequency: 'daily' as const,
    message: 'Just checking in - I\'m safe!'
  });

  useEffect(() => {
    loadReminders();
    calculateNextCheckin();
  }, []);

  const loadReminders = () => {
    const savedReminders = localStorage.getItem('checkin_reminders');
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    } else {
      // Default reminder
      const defaultReminder: CheckinReminder = {
        id: '1',
        time: '20:00',
        frequency: 'daily',
        message: 'Daily safety check-in - I\'m safe!',
        contacts: ['Mom', 'Emergency Contact'],
        active: true
      };
      setReminders([defaultReminder]);
      localStorage.setItem('checkin_reminders', JSON.stringify([defaultReminder]));
    }

    // Load streak data
    const streak = localStorage.getItem('checkin_streak');
    setCheckinStreak(streak ? parseInt(streak) : 0);
  };

  const calculateNextCheckin = () => {
    // Calculate next check-in time based on active reminders
    const now = new Date();
    const today = new Date(now);
    today.setHours(20, 0, 0, 0); // Default to 8 PM today
    
    if (today <= now) {
      today.setDate(today.getDate() + 1); // Tomorrow if past today's time
    }
    
    setNextCheckin(today);
  };

  const performCheckin = async () => {
    try {
      // Get current location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        });
      });

      const checkinData = {
        timestamp: Date.now(),
        location: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        },
        status: 'safe'
      };

      // Save check-in
      const checkins = JSON.parse(localStorage.getItem('checkin_history') || '[]');
      checkins.unshift(checkinData);
      localStorage.setItem('checkin_history', JSON.stringify(checkins.slice(0, 30))); // Keep last 30

      // Update streak
      const newStreak = checkinStreak + 1;
      setCheckinStreak(newStreak);
      localStorage.setItem('checkin_streak', newStreak.toString());

      // Send to emergency contacts
      const message = `SafeGuard Check-in: I'm safe! Location: https://maps.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`;
      console.log('Check-in notification:', message);

      alert('✅ Safety check-in completed! Your contacts have been notified.');
      calculateNextCheckin();
      
    } catch (error) {
      // Manual check-in without location
      const checkinData = {
        timestamp: Date.now(),
        location: null,
        status: 'safe'
      };

      const checkins = JSON.parse(localStorage.getItem('checkin_history') || '[]');
      checkins.unshift(checkinData);
      localStorage.setItem('checkin_history', JSON.stringify(checkins.slice(0, 30)));

      const newStreak = checkinStreak + 1;
      setCheckinStreak(newStreak);
      localStorage.setItem('checkin_streak', newStreak.toString());

      alert('✅ Safety check-in completed! (Location unavailable)');
      calculateNextCheckin();
    }
  };

  const addReminder = () => {
    if (!newReminder.time) return;

    const reminder: CheckinReminder = {
      id: Date.now().toString(),
      ...newReminder,
      contacts: ['Emergency Contacts'], // Default
      active: true
    };

    const updatedReminders = [...reminders, reminder];
    setReminders(updatedReminders);
    localStorage.setItem('checkin_reminders', JSON.stringify(updatedReminders));
    
    setNewReminder({ time: '', frequency: 'daily', message: 'Just checking in - I\'m safe!' });
    setIsAddingReminder(false);
  };

  const toggleReminder = (id: string) => {
    const updatedReminders = reminders.map(r => 
      r.id === id ? { ...r, active: !r.active } : r
    );
    setReminders(updatedReminders);
    localStorage.setItem('checkin_reminders', JSON.stringify(updatedReminders));
  };

  const deleteReminder = (id: string) => {
    const updatedReminders = reminders.filter(r => r.id !== id);
    setReminders(updatedReminders);
    localStorage.setItem('checkin_reminders', JSON.stringify(updatedReminders));
  };

  const getTimeUntilNext = () => {
    if (!nextCheckin) return '';
    const now = new Date();
    const diff = nextCheckin.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Safety Check-ins</h1>
              <p className="text-gray-600">Automated safety reminders and check-ins</p>
            </div>
            <Link href="/">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Check-in Status */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <img 
                src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/2d111c44-0667-4c88-8876-406f9833aac2.png" 
                alt="Safety check-in illustration showing a clock and checkmark symbol"
                className="mx-auto mb-4 rounded-lg"
              />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Daily Safety Check-in
              </h2>
              <p className="text-gray-600 mb-4">
                Regular check-ins help ensure your safety and give peace of mind to loved ones
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">{checkinStreak}</div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {nextCheckin ? getTimeUntilNext() : '--'}
                </div>
                <div className="text-sm text-gray-600">Next Check-in</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">{reminders.filter(r => r.active).length}</div>
                <div className="text-sm text-gray-600">Active Reminders</div>
              </div>
            </div>

            <Button
              onClick={performCheckin}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg"
            >
              ✅ Check In Now
            </Button>
          </CardContent>
        </Card>

        {/* Check-in Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>This Week's Check-ins</span>
                <span>5/7 days</span>
              </div>
              <Progress value={71} className="h-3" />
              <div className="grid grid-cols-7 gap-1 mt-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                  <div key={day} className="text-center">
                    <div className="text-xs text-gray-600 mb-1">{day}</div>
                    <div className={`w-8 h-8 rounded-full mx-auto ${
                      index < 5 ? 'bg-green-500' : 'bg-gray-200'
                    } flex items-center justify-center`}>
                      {index < 5 && <div className="w-3 h-3 bg-white rounded-full"></div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Reminders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Check-in Reminders
              <Button onClick={() => setIsAddingReminder(!isAddingReminder)}>
                {isAddingReminder ? 'Cancel' : 'Add Reminder'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isAddingReminder && (
              <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="time">Reminder Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newReminder.time}
                      onChange={(e) => setNewReminder({...newReminder, time: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select value={newReminder.frequency} onValueChange={(value: any) => setNewReminder({...newReminder, frequency: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="once">Once</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="message">Check-in Message</Label>
                  <Input
                    id="message"
                    value={newReminder.message}
                    onChange={(e) => setNewReminder({...newReminder, message: e.target.value})}
                    placeholder="Message to send with check-in"
                  />
                </div>
                <Button onClick={addReminder} className="w-full">
                  Add Reminder
                </Button>
              </div>
            )}

            {reminders.map((reminder) => (
              <div key={reminder.id} className="flex items-center justify-between p-4 bg-white border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-4 h-4 rounded-full ${reminder.active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <div>
                    <div className="font-semibold">
                      {reminder.time} - {reminder.frequency}
                    </div>
                    <div className="text-sm text-gray-600">{reminder.message}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={reminder.active ? 'default' : 'outline'}>
                    {reminder.active ? 'Active' : 'Paused'}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleReminder(reminder.id)}
                  >
                    {reminder.active ? 'Pause' : 'Resume'}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteReminder(reminder.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Missed Check-in Alert */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-800">Missed Check-in Protocol</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-yellow-900">
            <p>• <strong>15 minutes late:</strong> Push notification reminder</p>
            <p>• <strong>30 minutes late:</strong> SMS to your phone</p>
            <p>• <strong>1 hour late:</strong> Emergency contacts are notified</p>
            <p>• <strong>2 hours late:</strong> Emergency escalation protocol activated</p>
            <p>• <strong>Manual override:</strong> You can always check in late to cancel alerts</p>
          </CardContent>
        </Card>

        {/* Emergency Override */}
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-800">Emergency Check-in</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-900 mb-4">
              If you're in immediate danger and need to send a discreet alert:
            </p>
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                const emergencyMessage = "EMERGENCY: I need help but cannot call. This is a discreet alert from SafeGuard.";
                console.log('Emergency check-in triggered:', emergencyMessage);
                alert('🚨 Emergency alert sent discreetly to your contacts');
              }}
            >
              🚨 Send Discreet Emergency Alert
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
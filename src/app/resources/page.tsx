'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const emergencyNumbers = [
    { service: 'Emergency Services', number: '911', description: 'Police, Fire, Medical emergencies', category: 'emergency' },
    { service: 'National Suicide Prevention Lifeline', number: '988', description: 'Mental health crisis support', category: 'mental-health' },
    { service: 'National Domestic Violence Hotline', number: '1-800-799-7233', description: '24/7 confidential support', category: 'domestic-violence' },
    { service: 'RAINN National Sexual Assault Hotline', number: '1-800-656-4673', description: 'Sexual assault support', category: 'sexual-assault' },
    { service: 'Crisis Text Line', number: 'Text HOME to 741741', description: 'Text-based crisis counseling', category: 'mental-health' },
    { service: 'National Child Abuse Hotline', number: '1-800-4-A-CHILD', description: 'Child protection services', category: 'child-protection' }
  ];

  const safetyTips = [
    {
      title: 'Personal Safety Awareness',
      tips: [
        'Trust your instincts - if something feels wrong, remove yourself from the situation',
        'Stay alert and avoid distractions like phones when walking alone',
        'Walk confidently and make eye contact with people around you',
        'Keep your keys between your fingers when walking to your car',
        'Park in well-lit areas and have your keys ready before approaching your vehicle'
      ]
    },
    {
      title: 'Digital Safety',
      tips: [
        'Share your location only with trusted contacts',
        'Avoid posting real-time location updates on social media',
        'Use privacy settings to limit who can see your personal information',
        'Be cautious when meeting people you\'ve met online',
        'Keep your phone charged and carry a portable charger'
      ]
    },
    {
      title: 'Home Safety',
      tips: [
        'Install deadbolt locks and use them consistently',
        'Keep doors and windows locked, even when at home',
        'Install motion-sensor lights around your property',
        'Don\'t open the door for unexpected visitors',
        'Consider a security system or doorbell camera'
      ]
    },
    {
      title: 'Travel Safety',
      tips: [
        'Share your travel itinerary with trusted contacts',
        'Stay in well-populated, well-lit areas',
        'Use licensed transportation services',
        'Keep copies of important documents in separate locations',
        'Research your destination\'s safety information beforehand'
      ]
    }
  ];

  const selfDefenseBasics = [
    {
      technique: 'Situational Awareness',
      description: 'Stay alert to your surroundings, avoid predictable routines, and trust your instincts.',
      effectiveness: 'High'
    },
    {
      technique: 'Verbal De-escalation',
      description: 'Use calm, clear communication to defuse tense situations before they become physical.',
      effectiveness: 'High'
    },
    {
      technique: 'Creating Distance',
      description: 'Put obstacles between you and a threat, move to populated areas, and create escape routes.',
      effectiveness: 'High'
    },
    {
      technique: 'Personal Alarms',
      description: 'Loud noise devices that can startle attackers and draw attention to your situation.',
      effectiveness: 'Medium'
    },
    {
      technique: 'Basic Strikes',
      description: 'Target vulnerable areas: eyes, nose, throat, knees, and groin. Use palm strikes and knee kicks.',
      effectiveness: 'Medium'
    }
  ];

  const mentalHealthResources = [
    {
      name: 'National Alliance on Mental Illness (NAMI)',
      contact: '1-800-950-NAMI',
      website: 'nami.org',
      description: 'Mental health support and education'
    },
    {
      name: 'Psychology Today',
      contact: 'Online Directory',
      website: 'psychologytoday.com',
      description: 'Find therapists and mental health professionals'
    },
    {
      name: 'BetterHelp',
      contact: 'Online Platform',
      website: 'betterhelp.com',
      description: 'Online therapy and counseling services'
    },
    {
      name: 'Mental Health America',
      contact: 'Online Resources',
      website: 'mhanational.org',
      description: 'Mental health screening and resources'
    }
  ];

  const filteredNumbers = emergencyNumbers.filter(item =>
    item.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'emergency': 'bg-red-100 text-red-800',
      'mental-health': 'bg-blue-100 text-blue-800',
      'domestic-violence': 'bg-purple-100 text-purple-800',
      'sexual-assault': 'bg-pink-100 text-pink-800',
      'child-protection': 'bg-green-100 text-green-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Safety Resources</h1>
              <p className="text-gray-600">Essential safety information and emergency contacts</p>
            </div>
            <Link href="/">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <Tabs defaultValue="emergency" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="emergency">Emergency Contacts</TabsTrigger>
            <TabsTrigger value="safety-tips">Safety Tips</TabsTrigger>
            <TabsTrigger value="self-defense">Self Defense</TabsTrigger>
            <TabsTrigger value="mental-health">Mental Health</TabsTrigger>
          </TabsList>

          {/* Emergency Contacts Tab */}
          <TabsContent value="emergency" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Emergency & Crisis Hotlines</CardTitle>
                <div className="flex items-center space-x-4">
                  <Input
                    placeholder="Search emergency services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredNumbers.map((item, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-white">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-lg">{item.service}</h3>
                        <Badge className={getCategoryColor(item.category)}>
                          {item.category.replace('-', ' ')}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-blue-600">{item.number}</span>
                        <Button 
                          onClick={() => window.location.href = `tel:${item.number.replace(/[^\d]/g, '')}`}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Call Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-50 border-red-200">
              <CardHeader>
                <CardTitle className="text-red-800">Emergency Situations</CardTitle>
              </CardHeader>
              <CardContent className="text-red-900 space-y-2">
                <p>• <strong>Immediate danger:</strong> Call 911 immediately</p>
                <p>• <strong>Mental health crisis:</strong> Call 988 Suicide & Crisis Lifeline</p>
                <p>• <strong>Domestic violence:</strong> Call 1-800-799-7233 (confidential, 24/7)</p>
                <p>• <strong>Sexual assault:</strong> Call 1-800-656-4673 RAINN hotline</p>
                <p>• <strong>Text-based help:</strong> Text HOME to 741741</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Safety Tips Tab */}
          <TabsContent value="safety-tips" className="space-y-6">
            <div className="text-center mb-6">
              <img 
                src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/16f50b33-3c6a-4f76-bf88-88f953e7d2ae.png" 
                alt="Safety awareness illustration showing a protective shield and security symbols"
                className="mx-auto mb-4 rounded-lg"
              />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Safety Guidelines</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Essential safety practices to help you stay safe in various situations and environments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {safetyTips.map((section, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {section.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Self Defense Tab */}
          <TabsContent value="self-defense" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Self-Defense Fundamentals</CardTitle>
                <p className="text-gray-600">
                  Remember: The best self-defense is avoiding dangerous situations. These are last-resort techniques.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selfDefenseBasics.map((item, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">{item.technique}</h3>
                        <Badge variant={item.effectiveness === 'High' ? 'default' : 'secondary'}>
                          {item.effectiveness}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-yellow-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="text-yellow-800">Important Self-Defense Reminders</CardTitle>
              </CardHeader>
              <CardContent className="text-yellow-900 space-y-2">
                <p>• <strong>Primary goal:</strong> Escape and get to safety, not to fight</p>
                <p>• <strong>Make noise:</strong> Yell, scream, use a whistle or personal alarm</p>
                <p>• <strong>Target vulnerable areas:</strong> Eyes, nose, throat, solar plexus, knees, groin</p>
                <p>• <strong>Use everyday objects:</strong> Keys, pen, phone can be defensive tools</p>
                <p>• <strong>Trust your instincts:</strong> If you feel unsafe, take action to protect yourself</p>
                <p>• <strong>Consider professional training:</strong> Take a self-defense class for proper technique</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mental Health Tab */}
          <TabsContent value="mental-health" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mental Health Support Resources</CardTitle>
                <p className="text-gray-600">
                  Your mental health is just as important as your physical safety. Help is available.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mentalHealthResources.map((resource, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-blue-50">
                      <h3 className="font-semibold text-lg mb-2">{resource.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{resource.description}</p>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <strong>Contact:</strong> {resource.contact}
                        </div>
                        <div className="text-sm">
                          <strong>Website:</strong> {resource.website}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">Mental Health Warning Signs</CardTitle>
              </CardHeader>
              <CardContent className="text-green-900 space-y-2">
                <p>• <strong>Persistent sadness or anxiety</strong> lasting more than two weeks</p>
                <p>• <strong>Withdrawal from friends and activities</strong> you usually enjoy</p>
                <p>• <strong>Significant changes in sleep or appetite</strong></p>
                <p>• <strong>Difficulty concentrating</strong> or making decisions</p>
                <p>• <strong>Thoughts of self-harm</strong> - seek immediate help (call 988)</p>
                <p>• <strong>Increased use of alcohol or drugs</strong> to cope</p>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardHeader>
                <CardTitle className="text-purple-800">Crisis Support Options</CardTitle>
              </CardHeader>
              <CardContent className="text-purple-900">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4">
                    <div className="text-2xl font-bold">988</div>
                    <div className="text-sm">Call for immediate mental health crisis support</div>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-2xl font-bold">741741</div>
                    <div className="text-sm">Text HOME for crisis text support</div>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-2xl font-bold">911</div>
                    <div className="text-sm">Call for immediate safety emergency</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
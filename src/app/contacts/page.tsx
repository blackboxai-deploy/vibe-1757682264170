'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  priority: 'primary' | 'secondary' | 'backup';
  verified: boolean;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    relationship: '',
    priority: 'secondary' as const
  });

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = () => {
    const savedContacts = localStorage.getItem('emergency_contacts');
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    } else {
      // Default contacts for demo
      const defaultContacts: EmergencyContact[] = [
        {
          id: '1',
          name: 'Emergency Services',
          phone: '911',
          relationship: 'Emergency Services',
          priority: 'primary',
          verified: true
        },
        {
          id: '2',
          name: 'Mom',
          phone: '+1234567890',
          relationship: 'Mother',
          priority: 'primary',
          verified: false
        },
        {
          id: '3',
          name: 'Sarah Johnson',
          phone: '+1234567891',
          relationship: 'Best Friend',
          priority: 'secondary',
          verified: false
        }
      ];
      setContacts(defaultContacts);
      localStorage.setItem('emergency_contacts', JSON.stringify(defaultContacts));
    }
  };

  const saveContacts = (updatedContacts: EmergencyContact[]) => {
    setContacts(updatedContacts);
    localStorage.setItem('emergency_contacts', JSON.stringify(updatedContacts));
  };

  const addContact = () => {
    if (!newContact.name || !newContact.phone) return;

    const contact: EmergencyContact = {
      id: Date.now().toString(),
      ...newContact,
      verified: false
    };

    const updatedContacts = [...contacts, contact];
    saveContacts(updatedContacts);
    
    setNewContact({ name: '', phone: '', relationship: '', priority: 'secondary' });
    setIsAddingContact(false);
  };

  const deleteContact = (id: string) => {
    const updatedContacts = contacts.filter(contact => contact.id !== id);
    saveContacts(updatedContacts);
  };

  const verifyContact = async (contact: EmergencyContact) => {
    // In a real app, this would send a verification SMS/call
    const updatedContacts = contacts.map(c => 
      c.id === contact.id ? { ...c, verified: true } : c
    );
    saveContacts(updatedContacts);
  };

  const testContact = (contact: EmergencyContact) => {
    const message = "This is a test from SafeGuard app. You are listed as my emergency contact.";
    window.location.href = `sms:${contact.phone}?body=${encodeURIComponent(message)}`;
  };

  const groupedContacts = {
    primary: contacts.filter(c => c.priority === 'primary'),
    secondary: contacts.filter(c => c.priority === 'secondary'),
    backup: contacts.filter(c => c.priority === 'backup')
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Emergency Contacts</h1>
              <p className="text-gray-600">Manage your trusted emergency contacts</p>
            </div>
            <Link href="/">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Add Contact Dialog */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Your Emergency Network
              <Dialog open={isAddingContact} onOpenChange={setIsAddingContact}>
                <DialogTrigger asChild>
                  <Button>Add New Contact</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Emergency Contact</DialogTitle>
                    <DialogDescription>
                      Add someone you trust who can be reached in case of emergency.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={newContact.name}
                        onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={newContact.phone}
                        onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                        placeholder="+1234567890"
                      />
                    </div>
                    <div>
                      <Label htmlFor="relationship">Relationship</Label>
                      <Input
                        id="relationship"
                        value={newContact.relationship}
                        onChange={(e) => setNewContact({...newContact, relationship: e.target.value})}
                        placeholder="Mother, Friend, Partner, etc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="priority">Priority Level</Label>
                      <Select value={newContact.priority} onValueChange={(value: any) => setNewContact({...newContact, priority: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="primary">Primary (Called first)</SelectItem>
                          <SelectItem value="secondary">Secondary (Called second)</SelectItem>
                          <SelectItem value="backup">Backup (Called if others unavailable)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingContact(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addContact}>Add Contact</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <img 
                src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/28f7dc05-85d7-4298-ab10-9624b1da41ef.png" 
                alt="Emergency contacts network illustration showing connected people in a safety network"
                className="mx-auto mb-4 rounded-lg"
              />
              <p className="text-gray-600 max-w-md mx-auto">
                Build a strong safety network. Have at least 2-3 trusted contacts who can help you in emergencies.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Primary Contacts */}
        {groupedContacts.primary.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-red-700">Primary Contacts</CardTitle>
              <p className="text-sm text-gray-600">These contacts will be alerted first in emergencies</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {groupedContacts.primary.map((contact, index) => (
                <div key={contact.id}>
                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                        <p className="text-sm text-gray-600">{contact.phone}</p>
                        <p className="text-xs text-gray-500">{contact.relationship}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {contact.verified ? (
                        <Badge className="bg-green-100 text-green-800">Verified</Badge>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => verifyContact(contact)}>
                          Verify
                        </Button>
                      )}
                      <Button size="sm" onClick={() => testContact(contact)}>Test</Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => window.location.href = `tel:${contact.phone}`}
                      >
                        Call
                      </Button>
                      {contact.phone !== '911' && (
                        <Button size="sm" variant="destructive" onClick={() => deleteContact(contact.id)}>
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                  {index < groupedContacts.primary.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Secondary Contacts */}
        {groupedContacts.secondary.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-700">Secondary Contacts</CardTitle>
              <p className="text-sm text-gray-600">These contacts will be alerted after primary contacts</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {groupedContacts.secondary.map((contact, index) => (
                <div key={contact.id}>
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                        <p className="text-sm text-gray-600">{contact.phone}</p>
                        <p className="text-xs text-gray-500">{contact.relationship}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {contact.verified ? (
                        <Badge className="bg-green-100 text-green-800">Verified</Badge>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => verifyContact(contact)}>
                          Verify
                        </Button>
                      )}
                      <Button size="sm" onClick={() => testContact(contact)}>Test</Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => window.location.href = `tel:${contact.phone}`}
                      >
                        Call
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteContact(contact.id)}>
                        Remove
                      </Button>
                    </div>
                  </div>
                  {index < groupedContacts.secondary.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Backup Contacts */}
        {groupedContacts.backup.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-700">Backup Contacts</CardTitle>
              <p className="text-sm text-gray-600">Additional contacts for extended support</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {groupedContacts.backup.map((contact, index) => (
                <div key={contact.id}>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 bg-gray-500 rounded-full"></div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                        <p className="text-sm text-gray-600">{contact.phone}</p>
                        <p className="text-xs text-gray-500">{contact.relationship}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {contact.verified ? (
                        <Badge className="bg-green-100 text-green-800">Verified</Badge>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => verifyContact(contact)}>
                          Verify
                        </Button>
                      )}
                      <Button size="sm" onClick={() => testContact(contact)}>Test</Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => window.location.href = `tel:${contact.phone}`}
                      >
                        Call
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteContact(contact.id)}>
                        Remove
                      </Button>
                    </div>
                  </div>
                  {index < groupedContacts.backup.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Contact Tips */}
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">Emergency Contact Best Practices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-green-900">
            <p>• <strong>Verify all contacts:</strong> Ensure they know they're your emergency contact</p>
            <p>• <strong>Keep updated:</strong> Regularly check that phone numbers are current</p>
            <p>• <strong>Mix relationships:</strong> Include family, friends, and colleagues</p>
            <p>• <strong>Test regularly:</strong> Send test messages to ensure contacts work</p>
            <p>• <strong>Share your plans:</strong> Keep contacts informed of your general schedule</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
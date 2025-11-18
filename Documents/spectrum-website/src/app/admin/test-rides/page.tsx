'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, Calendar, Clock, User, Mail, Phone, Car, MapPin, 
  CheckCircle, XCircle, Loader2, RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';
import { collection, getDocs, query, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase-firestore';
import { toast } from 'sonner';

interface TestRide {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  productInterest: string;
  productId: string;
  location: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: any;
  updatedAt: any;
}

export default function TestRidesPage() {
  const { isLoggedIn, user } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [testRides, setTestRides] = useState<TestRide[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Check if user is admin
  const isAdmin = user?.email === 'admin@spectrum.com' || user?.email === 'nguyenphuocsang@gmail.com';

  useEffect(() => {
    if (isLoggedIn && isAdmin) {
      loadTestRides();
    }
  }, [isLoggedIn, isAdmin]);

  const loadTestRides = async () => {
    try {
      setIsLoading(true);
      const q = query(collection(db, 'testRides'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const rides: TestRide[] = [];
      
      querySnapshot.forEach((doc) => {
        rides.push({
          id: doc.id,
          ...doc.data()
        } as TestRide);
      });

      setTestRides(rides);
    } catch (error) {
      console.error('Error loading test rides:', error);
      toast.error('Failed to load test ride bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: TestRide['status']) => {
    try {
      const rideRef = doc(db, 'testRides', id);
      await updateDoc(rideRef, {
        status: newStatus,
        updatedAt: new Date()
      });
      
      setTestRides(prev => prev.map(ride => 
        ride.id === id ? { ...ride, status: newStatus } : ride
      ));
      
      toast.success('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const filteredRides = selectedStatus === 'all' 
    ? testRides 
    : testRides.filter(ride => ride.status === selectedStatus);

  const getStatusBadge = (status: TestRide['status']) => {
    const variants: Record<string, { label: string; className: string }> = {
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: 'Confirmed', className: 'bg-blue-100 text-blue-800' },
      completed: { label: 'Completed', className: 'bg-emerald-100 text-emerald-800' },
      cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800' }
    };
    
    const variant = variants[status] || variants.pending;
    return (
      <Badge className={variant.className}>
        {variant.label}
      </Badge>
    );
  };

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    try {
      const d = date.toDate ? date.toDate() : new Date(date);
      return d.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const formatDateTime = (date: any) => {
    if (!date) return 'N/A';
    try {
      const d = date.toDate ? date.toDate() : new Date(date);
      return d.toLocaleString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <XCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              You don&apos;t have permission to access this page.
            </p>
            <Button asChild>
              <Link href="/login">Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <XCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Admin Access Required</h2>
            <p className="text-muted-foreground mb-4">
              Only administrators can access test ride management.
            </p>
            <Button asChild>
              <Link href="/login">Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Admin
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Test Ride Bookings</h1>
                <p className="text-gray-600">Manage test drive bookings</p>
              </div>
            </div>
            <Button onClick={loadTestRides} variant="outline" disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Status Filter */}
        <div className="flex flex-wrap gap-3 mb-6">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
            <Button
              key={status}
              variant={selectedStatus === status ? 'default' : 'outline'}
              onClick={() => setSelectedStatus(status)}
              className="capitalize"
            >
              {status === 'all' ? 'All' : 
               status === 'pending' ? 'Pending' :
               status === 'confirmed' ? 'Confirmed' :
               status === 'completed' ? 'Completed' : 'Cancelled'}
              {status !== 'all' && (
                <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                  {testRides.filter(r => r.status === status).length}
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* Test Rides List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : filteredRides.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Car className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bookings</h3>
              <p className="text-gray-600">No test ride bookings found in this category.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredRides.map((ride, index) => (
              <motion.div
                key={ride.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">{ride.fullName}</CardTitle>
                          {getStatusBadge(ride.status)}
                        </div>
                        <p className="text-sm text-gray-600">
                          Booked at: {formatDateTime(ride.createdAt)}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Email</p>
                          <a href={`mailto:${ride.email}`} className="text-sm text-emerald-600 hover:underline">
                            {ride.email}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Phone</p>
                          <a href={`tel:${ride.phone}`} className="text-sm text-emerald-600 hover:underline">
                            {ride.phone}
                          </a>
                        </div>
                      </div>
                      {ride.productInterest && (
                        <div className="flex items-start gap-3">
                          <Car className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Product of Interest</p>
                            <p className="text-sm text-gray-600">{ride.productInterest}</p>
                          </div>
                        </div>
                      )}
                      {ride.preferredDate && (
                        <div className="flex items-start gap-3">
                          <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Preferred Date</p>
                            <p className="text-sm text-gray-600">
                              {formatDate(ride.preferredDate)} {ride.preferredTime && `- ${ride.preferredTime}`}
                            </p>
                          </div>
                        </div>
                      )}
                      {ride.location && (
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Location</p>
                            <p className="text-sm text-gray-600">{ride.location}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {ride.notes && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-900 mb-1">Notes</p>
                        <p className="text-sm text-gray-600">{ride.notes}</p>
                      </div>
                    )}

                    {/* Status Actions */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t">
                      {ride.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            onClick={() => updateStatus(ride.id, 'confirmed')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => updateStatus(ride.id, 'cancelled')}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        </>
                      )}
                      {ride.status === 'confirmed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                          onClick={() => updateStatus(ride.id, 'completed')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Mark as Completed
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


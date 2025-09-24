import { collection, addDoc, serverTimestamp, query, orderBy, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  inquiryType: string;
  status?: 'new' | 'in-progress' | 'resolved' | 'closed';
  createdAt?: any;
  updatedAt?: any;
  notes?: string;
}

export const submitContactForm = async (formData: Omit<ContactSubmission, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    console.log('📧 Submitting contact form to Firebase:', formData);
    
    const docRef = await addDoc(collection(db, 'contactSubmissions'), {
      ...formData,
      status: 'new',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log('✅ Contact form submitted successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error submitting contact form:', error);
    throw new Error('Failed to submit contact form');
  }
};

export const getContactSubmissions = async (): Promise<ContactSubmission[]> => {
  try {
    const q = query(
      collection(db, 'contactSubmissions'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const submissions: ContactSubmission[] = [];
    
    querySnapshot.forEach((doc) => {
      submissions.push({
        id: doc.id,
        ...doc.data()
      } as ContactSubmission);
    });
    
    return submissions;
  } catch (error) {
    console.error('❌ Error fetching contact submissions:', error);
    throw new Error('Failed to fetch contact submissions');
  }
};

export const updateContactSubmissionStatus = async (
  id: string, 
  status: ContactSubmission['status'], 
  notes?: string
): Promise<void> => {
  try {
    const docRef = doc(db, 'contactSubmissions', id);
    await updateDoc(docRef, {
      status,
      notes: notes || '',
      updatedAt: serverTimestamp()
    });
    
    console.log('✅ Contact submission status updated:', id, status);
  } catch (error) {
    console.error('❌ Error updating contact submission:', error);
    throw new Error('Failed to update contact submission');
  }
};

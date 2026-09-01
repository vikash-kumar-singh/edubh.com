import { collection, addDoc, doc, updateDoc, getDocs, increment, query, orderBy, limit, runTransaction, where, type QueryConstraint } from 'firebase/firestore'; // Import Firestore functions
import { firestore } from './firebase'; // Import only firestore
import type { UtmAttribution } from './utm';

// Check if Firebase is initialized
const isFirebaseInitialized = () => Boolean(firestore);

export interface ApplicationData {
  id?: string; // Make id optional
  fullName: string;
  email: string;
  phone: string;
  state: string;
  program: string;
  qualification?: string;
  preferredUniversity?: string;
  budget?: string;
  customBudget?: string;
  preferredSession?: string;
  customPreferredSession?: string;
  lastPassingPercentage?: string;
  callbackDate?: string;
  callbackTime?: string;
  leadSource?: string;
  utmAttribution?: UtmAttribution;
  timestamp: number;
  status: 'pending' | 'approved' | 'rejected';
  peopleDeliveryStatus?: 'pending' | 'delivered' | 'failed' | 'skipped';
  peopleLeadId?: string | null;
  peopleDeliveryError?: string | null;
  peopleDeliveryUpdatedAt?: number;
  peopleDeliveryAttemptCount?: number;
}

export interface ContactFormData {
  id?: string; // Add optional id to interface
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  timestamp: number;
  status: 'new' | 'responded';
}

// Save application data to Firebase
export const saveApplication = async (data: Omit<ApplicationData, 'timestamp' | 'status'>): Promise<{ success: boolean; id?: string; application?: ApplicationData; error?: string }> => {
  if (!isFirebaseInitialized()) {
    return {
      success: false,
      error: 'Firebase is not initialized. Please check your configuration.'
    };
  }

  try {
    const applicationData: ApplicationData = {
      ...data,
      timestamp: Date.now(),
      status: 'pending',
      peopleDeliveryStatus: 'pending',
      peopleLeadId: null,
      peopleDeliveryError: null,
      peopleDeliveryAttemptCount: 0,
    };

    // Save to Firestore
    const firestoreApplicationsRef = collection(firestore, 'applications');
    const docRef = await addDoc(firestoreApplicationsRef, applicationData);
    
    return {
      success: true,
      id: docRef.id,
      application: applicationData,
    };
  } catch (error) {
    console.error('Error saving application:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

// Save contact form data to Firestore
export const saveContactForm = async (data: Omit<ContactFormData, 'timestamp' | 'status'>): Promise<{ success: boolean; id?: string; error?: string }> => {
  if (!isFirebaseInitialized()) {
    return {
      success: false,
      error: 'Firebase is not initialized. Please check your configuration.'
    };
  }

  try {
    const contactData: ContactFormData = {
      ...data,
      timestamp: Date.now(),
      status: 'new'
    };

    const contactsRef = collection(firestore, 'contacts');
    const docRef = await addDoc(contactsRef, contactData);

    return {
      success: true,
      id: docRef.id
    };
  } catch (error) {
    console.error('Error saving contact form:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

// Fetch all applications from Firestore
export const fetchApplicationsFirestore = async (): Promise<{ success: boolean; data?: ApplicationData[]; error?: string }> => {
  if (!isFirebaseInitialized()) {
    return {
      success: false,
      error: 'Firebase is not initialized. Please check your configuration.'
    };
  }

  try {
    const applicationsCol = collection(firestore, 'applications');
    const applicationsQuery = query(applicationsCol, orderBy('timestamp', 'desc'), limit(100));
    const querySnapshot = await getDocs(applicationsQuery);
    
    const applications: ApplicationData[] = [];
    querySnapshot.forEach((doc) => {
      applications.push({
        id: doc.id,
        ...(doc.data() as Omit<ApplicationData, 'id'>) // Cast doc.data() to Omit<ApplicationData, 'id'>
      });
    });
    
    return {
      success: true,
      data: applications
    };
  } catch (error) {
    console.error('Error fetching applications from Firestore:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};


// Fetch every application in an optional submission-date range for admin export.
export const fetchApplicationsForExportFirestore = async (
  fromTimestamp?: number,
  toTimestamp?: number,
): Promise<{ success: boolean; data?: ApplicationData[]; error?: string }> => {
  if (!isFirebaseInitialized()) {
    return {
      success: false,
      error: 'Firebase is not initialized. Please check your configuration.',
    };
  }

  try {
    const constraints: QueryConstraint[] = [];

    if (typeof fromTimestamp === 'number') {
      constraints.push(where('timestamp', '>=', fromTimestamp));
    }
    if (typeof toTimestamp === 'number') {
      constraints.push(where('timestamp', '<=', toTimestamp));
    }
    constraints.push(orderBy('timestamp', 'desc'));

    const snapshot = await getDocs(
      query(collection(firestore, 'applications'), ...constraints),
    );
    const applications = snapshot.docs.map((applicationDocument) => ({
      id: applicationDocument.id,
      ...(applicationDocument.data() as Omit<ApplicationData, 'id'>),
    }));

    return { success: true, data: applications };
  } catch (error) {
    console.error('Error exporting applications from Firestore:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Unable to export applications.',
    };
  }
};
// Update application status in Firestore
export const updateApplicationStatusFirestore = async (id: string, status: 'pending' | 'approved' | 'rejected'): Promise<{ success: boolean; error?: string }> => {
  if (!isFirebaseInitialized()) {
    return {
      success: false,
      error: 'Firebase is not initialized. Please check your configuration.'
    };
  }

  try {
    const applicationRef = doc(firestore, 'applications', id);
    await updateDoc(applicationRef, { status });
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error updating application status in Firestore:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export interface FeedbackData {
  id?: string;
  fullName: string;
  email: string;
  relationship: 'student' | 'alumni' | 'applicant' | 'parent' | 'other';
  course?: string;
  rating: number;
  message: string;
  utmAttribution?: UtmAttribution;
  timestamp: number;
  status: 'new';
}

const normalizeFeedbackEmail = (email: string) => email.trim().toLowerCase();

const createFeedbackDocumentId = async (email: string) => {
  const bytes = new TextEncoder().encode(normalizeFeedbackEmail(email));
  const hash = await crypto.subtle.digest('SHA-256', bytes);

  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

export const updateApplicationPeopleDeliveryFirestore = async (
  id: string,
  delivery: {
    status: 'delivered' | 'failed' | 'skipped';
    leadId?: string | null;
    error?: string | null;
  },
): Promise<void> => {
  if (!isFirebaseInitialized()) return;

  await updateDoc(doc(firestore, 'applications', id), {
    peopleDeliveryStatus: delivery.status,
    peopleLeadId: delivery.leadId ?? null,
    peopleDeliveryError: delivery.error?.slice(0, 500) ?? null,
    peopleDeliveryUpdatedAt: Date.now(),
    peopleDeliveryAttemptCount: increment(1),
  });
};

export const fetchApplicationsPendingPeopleDelivery = async (
  maximum = 25,
  dateRange?: { fromTimestamp: number; toTimestamp: number },
): Promise<ApplicationData[]> => {
  if (!isFirebaseInitialized()) return [];
  if (dateRange) {
    const snapshot = await getDocs(query(
      collection(firestore, 'applications'),
      where('timestamp', '>=', dateRange.fromTimestamp),
      where('timestamp', '<=', dateRange.toTimestamp),
      orderBy('timestamp', 'desc'),
      limit(maximum),
    ));
    return snapshot.docs.map((row) => ({
      id: row.id,
      ...(row.data() as Omit<ApplicationData, 'id'>),
    }));
  }
  const snapshots = await Promise.all([
    getDocs(query(collection(firestore, 'applications'), where('peopleDeliveryStatus', '==', 'pending'), limit(maximum))),
    getDocs(query(collection(firestore, 'applications'), where('peopleDeliveryStatus', '==', 'failed'), limit(maximum))),
  ]);
  const unique = new Map<string, ApplicationData>();
  snapshots.forEach((snapshot) => snapshot.docs.forEach((row) => {
    unique.set(row.id, { id: row.id, ...(row.data() as Omit<ApplicationData, 'id'>) });
  }));
  return Array.from(unique.values()).slice(0, maximum);
};

export const saveFeedback = async (
  data: Omit<FeedbackData, 'id' | 'timestamp' | 'status'>,
): Promise<{ success: boolean; duplicate?: boolean; id?: string; error?: string }> => {
  if (!isFirebaseInitialized()) {
    return {
      success: false,
      error: 'Feedback service is unavailable. Please try again later.',
    };
  }

  try {
    const normalizedEmail = normalizeFeedbackEmail(data.email);
    const feedbackId = await createFeedbackDocumentId(normalizedEmail);
    const feedbackRef = doc(firestore, 'feedback', feedbackId);

    const result = await runTransaction(firestore, async (transaction) => {
      const existingFeedback = await transaction.get(feedbackRef);

      if (existingFeedback.exists()) {
        return { duplicate: true };
      }

      transaction.set(feedbackRef, {
        ...data,
        fullName: data.fullName.trim(),
        email: normalizedEmail,
        course: data.course?.trim() || '',
        message: data.message.trim(),
        timestamp: Date.now(),
        status: 'new',
      } satisfies Omit<FeedbackData, 'id'>);

      return { duplicate: false };
    });

    if (result.duplicate) {
      return {
        success: false,
        duplicate: true,
        error: 'Feedback has already been submitted with this email address.',
      };
    }

    return {
      success: true,
      id: feedbackId,
    };
  } catch (error) {
    console.error('Error saving feedback:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Unable to submit feedback. Please try again.',
    };
  }
};

export interface PublicFeedback {
  id: string;
  fullName: string;
  relationship: FeedbackData['relationship'];
  course?: string;
  rating: number;
  message: string;
  timestamp: number;
}

export const fetchFiveStarFeedback = async (): Promise<{
  success: boolean;
  data?: PublicFeedback[];
  error?: string;
}> => {
  if (!isFirebaseInitialized()) {
    return {
      success: false,
      error: 'Feedback service is unavailable.',
    };
  }

  try {
    const feedbackQuery = query(
      collection(firestore, 'feedback'),
      where('rating', '==', 5),
      limit(20),
    );
    const snapshot = await getDocs(feedbackQuery);
    const feedback = snapshot.docs
      .map((feedbackDocument) => {
        const data = feedbackDocument.data() as Omit<FeedbackData, 'id'>;

        return {
          id: feedbackDocument.id,
          fullName: data.fullName,
          relationship: data.relationship,
          course: data.course,
          rating: data.rating,
          message: data.message,
          timestamp: data.timestamp,
        } satisfies PublicFeedback;
      })
      .sort((first, second) => second.timestamp - first.timestamp);

    return {
      success: true,
      data: feedback,
    };
  } catch (error) {
    console.error('Error fetching five-star feedback:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Unable to load feedback.',
    };
  }
};



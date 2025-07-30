import type { AdvertiserSubmission, WeekSlot } from '../types/advertiser';

// Mock data storage - in production, this would be a database
let advertiserSubmissions: AdvertiserSubmission[] = [];
let weekSlots: WeekSlot[] = [];

// Initialize available weeks (next 12 weeks)
const initializeWeekSlots = () => {
  if (weekSlots.length > 0) return;
  
  const today = new Date();
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + (1 + 7 - today.getDay()) % 7);
  
  for (let i = 0; i < 12; i++) {
    const weekStart = new Date(nextMonday);
    weekStart.setDate(nextMonday.getDate() + (i * 7));
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    weekSlots.push({
      weekStartDate: weekStart.toISOString().split('T')[0],
      weekEndDate: weekEnd.toISOString().split('T')[0],
      isAvailable: true
    });
  }
};

export class AdvertiserService {
  constructor() {
    initializeWeekSlots();
  }

  getAvailableWeeks(): WeekSlot[] {
    return weekSlots.filter(slot => slot.isAvailable);
  }

  getAllWeeks(): WeekSlot[] {
    return weekSlots;
  }

  async submitAdvertiserRequest(submission: Omit<AdvertiserSubmission, 'id' | 'createdAt' | 'updatedAt'>): Promise<AdvertiserSubmission> {
    const newSubmission: AdvertiserSubmission = {
      ...submission,
      id: `adv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    advertiserSubmissions.push(newSubmission);
    
    // Reserve the week slot
    const weekSlot = weekSlots.find(slot => slot.weekStartDate === submission.weekStartDate);
    if (weekSlot) {
      weekSlot.isAvailable = false;
      weekSlot.advertiser = newSubmission;
    }

    console.log('✅ Advertiser submission created:', newSubmission);
    return newSubmission;
  }

  async updatePaymentStatus(submissionId: string, paymentStatus: 'completed' | 'failed', stripePaymentIntentId?: string): Promise<void> {
    const submission = advertiserSubmissions.find(sub => sub.id === submissionId);
    if (submission) {
      submission.paymentStatus = paymentStatus;
      submission.stripePaymentIntentId = stripePaymentIntentId;
      submission.updatedAt = new Date().toISOString();
      
      if (paymentStatus === 'completed') {
        submission.status = 'approved';
      } else if (paymentStatus === 'failed') {
        // Release the week slot if payment failed
        const weekSlot = weekSlots.find(slot => slot.weekStartDate === submission.weekStartDate);
        if (weekSlot) {
          weekSlot.isAvailable = true;
          weekSlot.advertiser = undefined;
        }
      }
    }
  }

  getCurrentAdvertiser(): AdvertiserSubmission | null {
    const today = new Date().toISOString().split('T')[0];
    
    return advertiserSubmissions.find(submission => 
      submission.status === 'active' &&
      submission.paymentStatus === 'completed' &&
      submission.weekStartDate <= today &&
      submission.weekEndDate >= today
    ) || null;
  }

  getUpcomingAdvertiser(): AdvertiserSubmission | null {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextWeekStr = nextWeek.toISOString().split('T')[0];
    
    return advertiserSubmissions.find(submission => 
      submission.status === 'approved' &&
      submission.paymentStatus === 'completed' &&
      submission.weekStartDate === nextWeekStr
    ) || null;
  }

  // Cleanup expired advertisements
  cleanupExpiredAds(): void {
    const today = new Date().toISOString().split('T')[0];
    
    advertiserSubmissions.forEach(submission => {
      if (submission.weekEndDate < today && submission.status === 'active') {
        submission.status = 'expired';
        submission.updatedAt = new Date().toISOString();
      }
    });
  }
}

export const advertiserService = new AdvertiserService();
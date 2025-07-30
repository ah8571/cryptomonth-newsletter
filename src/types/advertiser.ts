export interface AdvertiserSubmission {
  id: string;
  companyName: string;
  pitch: string;
  contactEmail: string;
  website: string;
  weekStartDate: string;
  weekEndDate: string;
  status: 'pending' | 'approved' | 'active' | 'expired';
  paymentStatus: 'pending' | 'completed' | 'failed';
  stripePaymentIntentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeekSlot {
  weekStartDate: string;
  weekEndDate: string;
  isAvailable: boolean;
  advertiser?: AdvertiserSubmission;
}

export interface StripePaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
}
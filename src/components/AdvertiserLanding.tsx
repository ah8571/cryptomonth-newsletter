import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, CheckCircle, AlertCircle, ArrowLeft, CreditCard } from 'lucide-react';
import { advertiserService } from '../services/advertiserService';
import { stripeService } from '../services/stripeService';
import type { WeekSlot, AdvertiserSubmission } from '../types/advertiser';

interface AdvertiserLandingProps {
  onBack: () => void;
}

export const AdvertiserLanding: React.FC<AdvertiserLandingProps> = ({ onBack }) => {
  const [availableWeeks, setAvailableWeeks] = useState<WeekSlot[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<string>('');
  const [formData, setFormData] = useState({
    companyName: '',
    pitch: '',
    contactEmail: '',
    website: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [submission, setSubmission] = useState<AdvertiserSubmission | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const weeks = advertiserService.getAvailableWeeks();
    setAvailableWeeks(weeks);
    if (weeks.length > 0) {
      setSelectedWeek(weeks[0].weekStartDate);
    }
  }, []);

  const formatWeekRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWeek || !formData.companyName || !formData.pitch || !formData.contactEmail || !formData.website) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.pitch.length > 200) {
      setError('Pitch must be 200 characters or less');
      return;
    }

    // Validate website URL
    try {
      const url = formData.website.startsWith('http') ? formData.website : `https://${formData.website}`;
      new URL(url);
    } catch {
      setError('Please enter a valid website URL');
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      const selectedWeekSlot = availableWeeks.find(week => week.weekStartDate === selectedWeek);
      if (!selectedWeekSlot) {
        throw new Error('Selected week is no longer available');
      }

      const newSubmission = await advertiserService.submitAdvertiserRequest({
        companyName: formData.companyName,
        pitch: formData.pitch,
        contactEmail: formData.contactEmail,
        website: formData.website.startsWith('http') ? formData.website : `https://${formData.website}`,
        weekStartDate: selectedWeekSlot.weekStartDate,
        weekEndDate: selectedWeekSlot.weekEndDate,
        status: 'pending',
        paymentStatus: 'pending'
      });

      setSubmission(newSubmission);
      
      // Proceed to payment
      await processPayment(newSubmission);
      
    } catch (err) {
      console.error('Submission error:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit advertisement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const processPayment = async (submission: AdvertiserSubmission) => {
    setIsProcessingPayment(true);
    
    try {
      // Create payment intent for $10
      const paymentIntent = await stripeService.createPaymentIntent(1000); // $10.00 in cents
      
      // In a real implementation, you'd collect card details and confirm payment
      // For demo purposes, we'll simulate a successful payment
      const paymentResult = await stripeService.confirmPayment(paymentIntent.client_secret, {
        type: 'card',
        card: { /* card details would go here */ }
      });

      if (paymentResult.success) {
        await advertiserService.updatePaymentStatus(submission.id, 'completed', paymentIntent.id);
        setPaymentSuccess(true);
        console.log('✅ Payment successful for submission:', submission.id);
      } else {
        throw new Error(paymentResult.error || 'Payment failed');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'Payment processing failed');
      if (submission) {
        await advertiserService.updatePaymentStatus(submission.id, 'failed');
      }
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (paymentSuccess && submission) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-4">Advertisement Booked Successfully!</h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-green-800 mb-2">Booking Details:</h3>
              <div className="text-left space-y-2 text-green-700">
                <p><strong>Company:</strong> {submission.companyName}</p>
                <p><strong>Week:</strong> {formatWeekRange(submission.weekStartDate, submission.weekEndDate)}</p>
                <p><strong>Amount Paid:</strong> $10.00</p>
                <p><strong>Booking ID:</strong> {submission.id}</p>
              </div>
            </div>
            <div className="text-gray-600 mb-6">
              <p className="mb-2">Your advertisement will appear on CryptoMonth.info and in the weekly newsletter during your selected week.</p>
              <p>You'll receive a confirmation email at <strong>{submission.contactEmail}</strong> with all the details.</p>
            </div>
            <button
              onClick={onBack}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 mx-auto"
            >
              <ArrowLeft size={18} />
              <span>Back to Site</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Advertise on CryptoMonth</h1>
            <p className="text-gray-600">Reach crypto enthusiasts with your message</p>
          </div>
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
        </div>

        {/* Pricing & Benefits */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <DollarSign className="text-blue-600" size={24} />
            <h2 className="text-xl font-semibold text-blue-900">$10 per week</h2>
          </div>
          <div className="text-blue-800 space-y-2">
            <p>✅ Featured placement on CryptoMonth.info homepage</p>
            <p>✅ Mention in weekly newsletter (sent to all subscribers)</p>
            <p>✅ 7-day exposure to crypto-focused audience</p>
            <p>✅ Direct link to your website or landing page</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Week Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Calendar className="inline mr-2" size={16} />
              Select Advertisement Week
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableWeeks.map((week) => (
                <label
                  key={week.weekStartDate}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                    selectedWeek === week.weekStartDate
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="week"
                    value={week.weekStartDate}
                    checked={selectedWeek === week.weekStartDate}
                    onChange={(e) => setSelectedWeek(e.target.value)}
                    className="mr-3"
                  />
                  <span className="text-sm font-medium">
                    {formatWeekRange(week.weekStartDate, week.weekEndDate)}
                  </span>
                </label>
              ))}
            </div>
            {availableWeeks.length === 0 && (
              <p className="text-gray-500 text-sm mt-2">No weeks currently available. Please check back later.</p>
            )}
          </div>

          {/* Company Name */}
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              placeholder="Enter your company name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Contact Email */}
          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
              Contact Email
            </label>
            <input
              type="email"
              id="contactEmail"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              placeholder="Enter your email address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Website */}
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
              Company Website
            </label>
            <input
              type="url"
              id="website"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://yourcompany.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              This will be used to create a "Learn more about {formData.companyName || 'your company'}" link
            </p>
          </div>

          {/* Pitch */}
          <div>
            <label htmlFor="pitch" className="block text-sm font-medium text-gray-700 mb-2">
              Advertisement Pitch (Max 200 characters) - Link will be added automatically
            </label>
            <textarea
              id="pitch"
              value={formData.pitch}
              onChange={(e) => setFormData({ ...formData, pitch: e.target.value })}
              placeholder="Describe what you're offering to crypto enthusiasts... (We'll automatically add a 'Learn more' link to your website)"
              rows={4}
              maxLength={200}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {formData.pitch.length}/200 characters
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Note: We'll automatically add "Learn more about {formData.companyName || 'your company'}" with a link to your website
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="text-red-600" size={20} />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || isProcessingPayment || availableWeeks.length === 0 || !formData.companyName || !formData.pitch || !formData.contactEmail || !formData.website}
            className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting || isProcessingPayment ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <CreditCard size={20} />
                <span>Book Advertisement - $10</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            Secure payment processing powered by Stripe. Your advertisement will go live on the selected Monday and run for 7 days.
          </p>
        </div>
      </div>
    </div>
  );
};
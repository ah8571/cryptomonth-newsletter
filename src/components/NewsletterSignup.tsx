import React, { useState } from 'react';
import { Mail, Send, CheckCircle, AlertTriangle } from 'lucide-react';
import { convertKit } from '../services/convertkit';

export const NewsletterSignup: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if ConvertKit is configured
  const isConvertKitConfigured = convertKit.isFullyConfigured();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.name) return;

    setIsLoading(true);
    setError(null);
    
    try {
      await convertKit.subscribeToNewsletter({
        email: formData.email,
        first_name: formData.name,
        tags: ['CryptoMonth Newsletter'],
        fields: {
          source: 'Website Signup',
          signup_date: new Date().toISOString()
        }
      });
      
      console.log('✅ Newsletter subscription attempt completed');
      console.log('📧 Check ConvertKit dashboard for new subscriber');
      console.log('🔍 If subscriber not appearing, check:');
      console.log('   1. Form domain settings in ConvertKit');
      console.log('   2. Double opt-in requirements');
      console.log('   3. API key permissions');
      console.log('   4. Account owner emails cannot subscribe to their own forms');
      
      setIsSubscribed(true);
      setFormData({ name: '', email: '' });
    } catch (err) {
      console.error('Newsletter subscription error:', err);
      setError(err instanceof Error ? err.message : 'Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConvertKitConfigured) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="text-yellow-600" size={24} />
          <div>
            <h3 className="text-lg font-semibold text-yellow-800">Newsletter Setup Required</h3>
            <p className="text-yellow-700">ConvertKit configuration is incomplete. Please check environment variables.</p>
            <p className="text-yellow-600 text-sm mt-1">Recommended: Use forms.cryptomonth.info for ConvertKit to avoid email conflicts.</p>
          </div>
        </div>
      </div>
    );
  }

  if (isSubscribed) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <CheckCircle className="text-green-600" size={24} />
          <div>
            <h3 className="text-lg font-semibold text-green-800">Successfully Subscribed!</h3>
            <p className="text-green-700">Welcome! You'll receive your first CryptoMonth newsletter this Sunday.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
          <Mail className="text-white" size={20} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Weekly CryptoMonth Newsletter</h3>
          <p className="text-gray-600">Get the performance chart delivered to your inbox every Sunday</p>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold text-gray-900 mb-2">What you'll receive:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Interactive performance chart with clickable cryptocurrency links</li>
          <li>• Top 10 gainers and losers with detailed analysis</li>
          <li>• News sentiment highlights from the past week</li>
          <li>• Market trends and investment signals</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter your first name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
            required
          />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Enter your email address"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
        
        <button
          type="submit"
          disabled={isLoading || !formData.email || !formData.name}
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <Send size={18} />
              <span>Subscribe to Newsletter</span>
            </>
          )}
        </button>
      </form>

      <p className="text-xs text-gray-500 mt-3">
        Delivered every Sunday at 9 AM EST via ConvertKit. Unsubscribe anytime. No spam, ever.
      </p>
    </div>
  );
};
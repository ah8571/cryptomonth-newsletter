import React, { useState } from 'react';
import { Mail, Send, CheckCircle, X, ArrowRight, AlertTriangle } from 'lucide-react';
import { convertKit } from '../services/convertkit';

interface InlineNewsletterFormProps {
  isVisible: boolean;
  onClose: () => void;
}

export const InlineNewsletterForm: React.FC<InlineNewsletterFormProps> = ({ isVisible, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        tags: ['CryptoMonth Newsletter', 'Header Signup'],
        fields: {
          source: 'Header Form',
          signup_date: new Date().toISOString()
        }
      });
      
      setIsSubscribed(true);
      setTimeout(() => {
        setFormData({ name: '', email: '' });
        setIsSubscribed(false);
        onClose();
      }, 3000);
    } catch (err) {
      console.error('Newsletter subscription error:', err);
      setError(err instanceof Error ? err.message : 'Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  if (!isConvertKitConfigured) {
    return (
      <div className="bg-yellow-50 border-b border-yellow-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center space-x-3 text-yellow-600">
            <AlertTriangle size={20} />
            <span className="text-sm">Newsletter signup temporarily unavailable - ConvertKit configuration needed</span>
            <button onClick={onClose} className="text-yellow-600 hover:text-yellow-800">
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-b border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-2xl mx-auto">
          {isSubscribed ? (
            <div className="flex items-center justify-center space-x-3 text-green-600">
              <CheckCircle size={24} />
              <div>
                <h3 className="text-lg font-semibold">Successfully Subscribed!</h3>
                <p className="text-sm text-green-700">Welcome! You'll receive your first newsletter this Sunday.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <Mail className="text-white" size={16} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Join CryptoMonth Newsletter</h3>
                    <p className="text-sm text-gray-600">Get weekly crypto insights delivered every Sunday</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your first name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                      required
                    />
                  </div>
                </div>
                
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}
                
                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={isLoading || !formData.email || !formData.name}
                    className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <span>Subscribe Now</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  Weekly newsletter • Top gainers & losers • Market analysis • Unsubscribe anytime
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
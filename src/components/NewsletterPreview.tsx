import React, { useState } from 'react';
import { Eye, Download, Send, Mail, AlertTriangle, Calendar, Clock } from 'lucide-react';
import { generateNewsletterPreview } from '../utils/newsletterGenerator';
import { convertKit } from '../services/convertkit';
import type { CryptoData } from '../types/crypto';

interface NewsletterPreviewProps {
  cryptos: CryptoData[];
}

export const NewsletterPreview: React.FC<NewsletterPreviewProps> = ({ cryptos }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [newsletterHTML, setNewsletterHTML] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<string | null>(null);
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleStatus, setScheduleStatus] = useState<string | null>(null);

  const isConvertKitConfigured = convertKit.isFullyConfigured();

  // Calculate next Wednesday at 4:15 PM EST for testing
  const getNextWednesdaySchedule = () => {
    const now = new Date();
    
    // Create date in EST timezone
    const estOffset = -5; // EST is UTC-5 (or UTC-4 during DST)
    const isDST = isDaylightSavingTime(now);
    const offset = isDST ? -4 : -5;
    
    const nextWednesday = new Date();
    
    // Calculate days until next Wednesday (3 = Wednesday)
    const daysUntilWednesday = (3 - now.getDay() + 7) % 7;
    
    // Convert current time to EST
    const nowEST = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + (offset * 3600000));
    
    // If it's already Wednesday and past 4:15 PM EST, schedule for next Wednesday
    if (daysUntilWednesday === 0 && (nowEST.getHours() > 16 || (nowEST.getHours() === 16 && nowEST.getMinutes() >= 15))) {
      nextWednesday.setDate(now.getDate() + 7);
    } else if (daysUntilWednesday === 0) {
      // It's Wednesday but before 4:15 PM, schedule for today
      nextWednesday.setDate(now.getDate());
    } else {
      nextWednesday.setDate(now.getDate() + daysUntilWednesday);
    }
    
    // Set to 4:15 PM EST (convert to UTC for ConvertKit)
    const estHour = 16; // 4 PM
    const estMinute = 15;
    const utcHour = estHour - offset; // Convert EST to UTC
    
    nextWednesday.setUTCHours(utcHour, estMinute, 0, 0);
    return nextWednesday;
  };
  
  // Helper function to determine if it's daylight saving time
  const isDaylightSavingTime = (date: Date) => {
    const january = new Date(date.getFullYear(), 0, 1).getTimezoneOffset();
    const july = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
    return Math.max(january, july) !== date.getTimezoneOffset();
  };

  const handlePreview = () => {
    const html = generateNewsletterPreview(cryptos);
    setNewsletterHTML(html);
    setShowPreview(true);
  };

  const handleFullPreview = () => {
    const html = generateNewsletterPreview(cryptos);
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(html);
      newWindow.document.close();
    }
  };

  const handleDownload = () => {
    const html = generateNewsletterPreview(cryptos);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cryptomonth-newsletter-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleScheduleWeeklyNewsletter = async () => {
    if (!isConvertKitConfigured) {
      setScheduleStatus('ConvertKit is not fully configured. Please check environment variables.');
      return;
    }

    setIsScheduling(true);
    setScheduleStatus(null);
    
    try {
      const html = generateNewsletterPreview(cryptos);
      const nextWednesday = getNextWednesdaySchedule();
      const subject = `CryptoMonth Weekly Newsletter - ${nextWednesday.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}`;
      
      console.log('🔄 Creating scheduled broadcast for:', nextWednesday.toISOString());
      const broadcast = await convertKit.createBroadcast(subject, html, nextWednesday);
      
      console.log('✅ Broadcast created:', broadcast);
      console.log('📅 Scheduled for:', nextWednesday.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short'
      }));
      
      setScheduleStatus(`✅ Newsletter scheduled successfully! It will be sent on ${nextWednesday.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short'
      })} to all subscribers. Check ConvertKit Dashboard → Broadcasts - it should show as "Scheduled" not just "Draft".`);
    } catch (error) {
      console.error('Newsletter schedule error:', error);
      setScheduleStatus(error instanceof Error ? error.message : 'Failed to schedule newsletter');
    } finally {
      setIsScheduling(false);
    }
  };

  const handleSendNewsletterDraft = async () => {
    if (!isConvertKitConfigured) {
      setSendStatus('ConvertKit is not fully configured. Please check environment variables.');
      return;
    }

    setIsSending(true);
    setSendStatus(null);
    
    try {
      const html = generateNewsletterPreview(cryptos);
      const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      const subject = `CryptoMonth Weekly Newsletter - ${currentDate}`;
      
      // Create broadcast in ConvertKit
      const broadcast = await convertKit.createBroadcast(subject, html);
      setSendStatus(`Newsletter draft created successfully! Go to ConvertKit Dashboard → Broadcasts to find "${subject}" and send it manually.`);
    } catch (error) {
      console.error('Newsletter send error:', error);
      setSendStatus(error instanceof Error ? error.message : 'Failed to send newsletter');
    } finally {
      setIsSending(false);
    }
  };

  const handleSendTestNewsletter = async () => {
    const apiSecret = import.meta.env.VITE_CONVERTKIT_API_SECRET;
    if (!isConvertKitConfigured || !apiSecret) {
      setSendStatus('ConvertKit API secret is required for sending test newsletters. Please add VITE_CONVERTKIT_API_SECRET to your environment variables.');
      return;
    }

    const testEmail = prompt('Enter your email address for the test newsletter:');
    if (!testEmail) return;
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(testEmail)) {
      setSendStatus('Please enter a valid email address.');
      return;
    }
    
    setIsSending(true);
    setSendStatus(null);
    
    try {
      await convertKit.sendTestNewsletter(testEmail, cryptos);
      setSendStatus(`Test newsletter broadcast created successfully! Check ConvertKit Dashboard → Broadcasts to send it to ${testEmail}.`);
    } catch (error) {
      console.error('Test newsletter send error:', error);
      setSendStatus(error instanceof Error ? error.message : 'Failed to send test newsletter');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      {!isConvertKitConfigured && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center space-x-2">
          <AlertTriangle className="text-yellow-600" size={16} />
          <span className="text-yellow-700 text-sm">ConvertKit not fully configured - newsletter features limited</span>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Newsletter Preview</h3>
          <p className="text-gray-600">Preview the weekly newsletter format</p>
        </div>
      </div>

      {/* Simple Preview Controls */}
      <div className="flex space-x-3 mb-4">
        <button
          onClick={handlePreview}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Eye size={16} />
          <span>Preview</span>
        </button>
        <button
          onClick={handleFullPreview}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
        >
          <Eye size={16} />
          <span>Full Preview</span>
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
        >
          <Download size={16} />
          <span>Download HTML</span>
        </button>
      </div>

      {showPreview && (
        <div className="mt-6">
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
              <span className="text-sm font-medium text-gray-700">Newsletter Preview</span>
              <button
                onClick={() => setShowPreview(false)}
                className="float-right text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="h-96 overflow-auto">
              <iframe
                srcDoc={newsletterHTML}
                className="w-full h-full border-none"
                title="Newsletter Preview"
              />
            </div>
          </div>
        </div>
      )}

      {/* Newsletter Features */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Newsletter Features:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Interactive performance chart with clickable cryptocurrency links</li>
          <li>• Top 50 gainers and top 10 losers with detailed analysis</li>
          <li>• Market sentiment analysis with investment insights</li>
          <li>• News highlights and exchange listings for each cryptocurrency</li>
          <li>• Professional HTML formatting optimized for email clients</li>
          <li>• Automated weekly delivery every Sunday at 9 AM EST</li>
        </ul>
      </div>
    </div>
  );
};
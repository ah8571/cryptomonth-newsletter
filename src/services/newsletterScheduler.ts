// Real newsletter scheduling service with automatic sending
import { convertKit } from './convertkit';
import { generateNewsletterPreview } from '../utils/newsletterGenerator';
import type { CryptoData } from '../types/crypto';

interface ScheduledNewsletter {
  id: string;
  scheduledTime: Date;
  subject: string;
  html: string;
  status: 'scheduled' | 'sent' | 'failed';
  createdAt: Date;
}

class NewsletterScheduler {
  private scheduledNewsletters: Map<string, ScheduledNewsletter> = new Map();
  private checkInterval: NodeJS.Timeout | null = null;
  private isRunning = false;

  constructor() {
    this.startScheduler();
  }

  // Start the scheduler that checks every minute for newsletters to send
  startScheduler() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('📅 Newsletter scheduler started - checking every minute for scheduled sends');
    
    // Check immediately
    this.checkScheduledNewsletters();
    
    // Then check every minute
    this.checkInterval = setInterval(() => {
      this.checkScheduledNewsletters();
    }, 60000); // Check every minute
  }

  stopScheduler() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.isRunning = false;
    console.log('📅 Newsletter scheduler stopped');
  }

  // Schedule a newsletter to be sent at a specific time
  scheduleNewsletter(scheduledTime: Date, cryptos: CryptoData[]): string {
    const id = `newsletter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const html = generateNewsletterPreview(cryptos);
    const subject = `CryptoMonth Weekly Newsletter - ${scheduledTime.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}`;

    const newsletter: ScheduledNewsletter = {
      id,
      scheduledTime,
      subject,
      html,
      status: 'scheduled',
      createdAt: new Date()
    };

    this.scheduledNewsletters.set(id, newsletter);
    
    console.log(`📅 Newsletter scheduled for ${scheduledTime.toLocaleString()}`);
    console.log(`📧 Subject: ${subject}`);
    console.log(`🆔 ID: ${id}`);
    
    return id;
  }

  // Check for newsletters that need to be sent
  private async checkScheduledNewsletters() {
    const now = new Date();
    console.log(`🔍 Checking scheduled newsletters at ${now.toLocaleString()}`);
    
    for (const [id, newsletter] of this.scheduledNewsletters) {
      if (newsletter.status === 'scheduled' && now >= newsletter.scheduledTime) {
        console.log(`📤 Time to send newsletter: ${newsletter.subject}`);
        await this.sendNewsletter(id, newsletter);
      }
    }
  }

  // Actually send the newsletter via ConvertKit
  private async sendNewsletter(id: string, newsletter: ScheduledNewsletter) {
    try {
      console.log(`🔄 Sending newsletter: ${newsletter.subject}`);
      
      // Create and immediately send the broadcast
      const broadcast = await convertKit.createAndSendBroadcast(
        newsletter.subject, 
        newsletter.html
      );
      
      // Update status
      newsletter.status = 'sent';
      this.scheduledNewsletters.set(id, newsletter);
      
      console.log(`✅ Newsletter sent successfully!`);
      console.log(`📧 ConvertKit Broadcast ID: ${broadcast.broadcast?.id}`);
      console.log(`📊 Sent at: ${new Date().toLocaleString()}`);
      
      // Show success notification
      this.showNotification(`✅ Newsletter sent successfully at ${new Date().toLocaleString()}!`);
      
    } catch (error) {
      console.error(`❌ Failed to send newsletter:`, error);
      newsletter.status = 'failed';
      this.scheduledNewsletters.set(id, newsletter);
      
      // Show error notification
      this.showNotification(`❌ Failed to send newsletter: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Show notification to user
  private showNotification(message: string) {
    // Create a temporary notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${message.includes('✅') ? '#10B981' : '#EF4444'};
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      font-weight: 500;
      max-width: 400px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 10 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 10000);
  }

  // Get all scheduled newsletters
  getScheduledNewsletters(): ScheduledNewsletter[] {
    return Array.from(this.scheduledNewsletters.values())
      .sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime());
  }

  // Cancel a scheduled newsletter
  cancelNewsletter(id: string): boolean {
    const newsletter = this.scheduledNewsletters.get(id);
    if (newsletter && newsletter.status === 'scheduled') {
      this.scheduledNewsletters.delete(id);
      console.log(`❌ Cancelled newsletter: ${newsletter.subject}`);
      return true;
    }
    return false;
  }

  // Schedule for next occurrence of specific day/time
  scheduleForNextOccurrence(dayOfWeek: number, hour: number, minute: number, cryptos: CryptoData[]): string {
    const now = new Date();
    const scheduledTime = new Date();
    
    // Calculate days until target day
    const daysUntil = (dayOfWeek - now.getDay() + 7) % 7;
    
    // If it's the same day but past the time, schedule for next week
    if (daysUntil === 0 && (now.getHours() > hour || (now.getHours() === hour && now.getMinutes() >= minute))) {
      scheduledTime.setDate(now.getDate() + 7);
    } else {
      scheduledTime.setDate(now.getDate() + daysUntil);
    }
    
    scheduledTime.setHours(hour, minute, 0, 0);
    
    return this.scheduleNewsletter(scheduledTime, cryptos);
  }
}

// Create singleton instance
export const newsletterScheduler = new NewsletterScheduler();

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    newsletterScheduler.stopScheduler();
  });
}
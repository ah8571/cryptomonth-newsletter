class ConvertKitService {
  private apiKey: string;
  private apiSecret: string;
  private formId: string;
  private baseUrl = 'https://api.convertkit.com/v3';

  constructor() {
    this.apiKey = import.meta.env.VITE_CONVERTKIT_API_KEY || '';
    this.apiSecret = import.meta.env.VITE_CONVERTKIT_API_SECRET || '';
    this.formId = import.meta.env.VITE_CONVERTKIT_FORM_ID || '';
  }

  isConfigured(): boolean {
    return !!(this.apiKey && this.formId);
  }

  isFullyConfigured(): boolean {
    return !!(this.apiKey && this.apiSecret && this.formId);
  }

  async subscribe(email: string, firstName?: string): Promise<any> {
    if (!this.isConfigured()) {
      throw new Error('ConvertKit is not configured');
    }

    const response = await fetch(`${this.baseUrl}/forms/${this.formId}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: this.apiKey,
        email,
        first_name: firstName || '',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async createBroadcast(subject: string, content: string, scheduledTime?: Date): Promise<any> {
    if (!this.isFullyConfigured()) {
      throw new Error('ConvertKit API secret is required for creating broadcasts');
    }

    const payload: any = {
      api_secret: this.apiSecret,
      subject,
      content,
      description: `Newsletter - ${new Date().toISOString()}`,
    };

    if (scheduledTime) {
      payload.send_at = scheduledTime.toISOString();
    }

    const response = await fetch(`${this.baseUrl}/broadcasts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to create broadcast: ${response.status}`);
    }

    return response.json();
  }

  async sendBroadcast(broadcastId: string): Promise<any> {
    if (!this.isFullyConfigured()) {
      throw new Error('ConvertKit API secret is required for sending broadcasts');
    }

    const response = await fetch(`${this.baseUrl}/broadcasts/${broadcastId}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_secret: this.apiSecret,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to send broadcast: ${response.status}`);
    }

    return response.json();
  }

  async sendTestNewsletter(testEmail: string, cryptos: any[]): Promise<any> {
    const { generateNewsletterPreview } = await import('../utils/newsletterGenerator');
    const html = generateNewsletterPreview(cryptos);
    const subject = `TEST: CryptoMonth Newsletter - ${new Date().toLocaleDateString()}`;
    
    return this.createBroadcast(subject, html);
  }

  async sendNewsletterNow(cryptos: any[]): Promise<any> {
    console.log('🚀 ConvertKit: Sending newsletter now...');
    
    const { generateNewsletterPreview } = await import('../utils/newsletterGenerator');
    const html = generateNewsletterPreview(cryptos);
    const subject = `CryptoMonth Weekly Newsletter - ${new Date().toLocaleDateString()}`;
    
    // Create and send broadcast immediately
    const broadcast = await this.createBroadcast(subject, html);
    console.log('✅ ConvertKit: Broadcast created:', broadcast);
    
    // Send the broadcast
    const sendResult = await this.sendBroadcast(broadcast.broadcast.id);
    console.log('✅ ConvertKit: Newsletter sent successfully!', sendResult);
    
    return sendResult;
  }
}

export const convertKit = new ConvertKitService();
/**
 * OTP (One-Time Password) utility for email verification
 * Note: In production, this should be handled by a backend service
 */

interface OtpRecord {
  code: string;
  email: string;
  createdAt: number;
  expiresAt: number;
}

const OTP_STORAGE_KEY = 'suka_otp_codes';
const OTP_EXPIRY_MINUTES = 10;
const OTP_LENGTH = 6;

/**
 * Generate a random 6-digit OTP
 */
export function generateOtp(): string {
  return Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(OTP_LENGTH, '0');
}

/**
 * Send OTP to email (mock - in production, use email service)
 * Returns the OTP code for demo purposes
 */
export function sendOtpToEmail(email: string): string {
  const otp = generateOtp();
  const now = Date.now();
  const expiresAt = now + OTP_EXPIRY_MINUTES * 60 * 1000;

  // Store in localStorage (mock - backend would handle this)
  const otpRecord: OtpRecord = {
    code: otp,
    email: email.toLowerCase().trim(),
    createdAt: now,
    expiresAt,
  };

  try {
    const stored = localStorage.getItem(OTP_STORAGE_KEY);
    const records = stored ? JSON.parse(stored) : [];
    records.push(otpRecord);
    // Keep only recent records (prevent bloat)
    const filtered = records.slice(-50);
    localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(filtered));
  } catch {
    console.error('Failed to store OTP');
  }

  // In real world, send via email service
  console.log(`[OTP Demo] Code for ${email}: ${otp}`);

  return otp;
}

/**
 * Verify OTP against stored code
 */
export function verifyOtp(email: string, code: string): boolean {
  try {
    const stored = localStorage.getItem(OTP_STORAGE_KEY);
    if (!stored) return false;

    const records: OtpRecord[] = JSON.parse(stored);
    const normalizedEmail = email.toLowerCase().trim();
    const now = Date.now();

    // Find matching OTP record
    const record = records.find(
      (r) =>
        r.email === normalizedEmail &&
        r.code === code &&
        r.expiresAt > now // Not expired
    );

    if (record) {
      // Delete used OTP to prevent reuse
      const filtered = records.filter((r) => r !== record);
      localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(filtered));
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Check if OTP has been sent and is still valid
 */
export function hasValidOtp(email: string): boolean {
  try {
    const stored = localStorage.getItem(OTP_STORAGE_KEY);
    if (!stored) return false;

    const records: OtpRecord[] = JSON.parse(stored);
    const normalizedEmail = email.toLowerCase().trim();
    const now = Date.now();

    return records.some(
      (r) =>
        r.email === normalizedEmail &&
        r.expiresAt > now
    );
  } catch {
    return false;
  }
}

/**
 * Get remaining time for OTP (in seconds)
 */
export function getOtpRemainingTime(email: string): number {
  try {
    const stored = localStorage.getItem(OTP_STORAGE_KEY);
    if (!stored) return 0;

    const records: OtpRecord[] = JSON.parse(stored);
    const normalizedEmail = email.toLowerCase().trim();
    const now = Date.now();

    const record = records.find(
      (r) =>
        r.email === normalizedEmail &&
        r.expiresAt > now
    );

    if (!record) return 0;

    return Math.max(0, Math.floor((record.expiresAt - now) / 1000));
  } catch {
    return 0;
  }
}

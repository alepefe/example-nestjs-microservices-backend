import { EmailAddress } from 'src/shared/domain/value-objects/email-address.value-object';
import { ILoginAttemptStore } from 'src/users/domain/login-attempt-store';

export class InMemoryLoginAttemptStore implements ILoginAttemptStore {
  private readonly windowMs: number;
  private readonly maxAttempts: number;
  private readonly attempts: Map<string, number[]>;

  constructor (windowMs: number, maxAttempts: number) {
    this.windowMs = windowMs;
    this.maxAttempts = maxAttempts;
    this.attempts = new Map();

    setInterval(() => {
      this.cleanupStaleAttempts();
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  // Record a failed login attempt.
  public async recordFailedAttempt (email: EmailAddress): Promise<void> {
    const now = Date.now();
    const timestamps = this.attempts.get(email.value) ?? [];
    timestamps.push(now);
    this.attempts.set(email.value, timestamps);
  }

  // Check if a user has exceeded the maximum number of attempts.
  public async hasExceededAttempts (email: EmailAddress): Promise<boolean> {
    const now = Date.now();
    const timestamps = this.attempts.get(email.value) ?? [];
    // Trim timestamps outside the window
    while (timestamps.length && timestamps[0] <= now - this.windowMs) {
      timestamps.shift();
    }
    // Update the timestamps in the map
    this.attempts.set(email.value, timestamps);
    // Check if the count exceeds the maximum
    return timestamps.length >= this.maxAttempts;
  }

  // Clean up any stale login attempt records.
  private cleanupStaleAttempts (): void {
    const now = Date.now();
    for (const [email, timestamps] of this.attempts.entries()) {
      while (timestamps.length && timestamps[0] <= now - this.windowMs) {
        timestamps.shift();
      }
      if (!timestamps.length) {
        // If no timestamps remain for this email, delete the entry from the map
        this.attempts.delete(email);
      }
    }
  }
}

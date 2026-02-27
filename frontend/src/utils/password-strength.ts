/**
 * Calculate password strength as a 0–4 score.
 * Criteria: length ≥8, length ≥12, mixed case, digit, special char.
 */
export function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  // Clamp to 4
  score = Math.min(score, 4);

  const levels: Record<number, { label: string; color: string }> = {
    0: { label: 'Too weak', color: 'bg-red-500' },
    1: { label: 'Weak', color: 'bg-red-400' },
    2: { label: 'Fair', color: 'bg-yellow-500' },
    3: { label: 'Good', color: 'bg-emerald-400' },
    4: { label: 'Strong', color: 'bg-emerald-500' },
  };

  return { score, ...levels[score] };
}


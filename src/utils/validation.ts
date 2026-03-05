/**
 * Validation helpers for LifeOps Personal
 * Email, password strength, required fields, and guarded array utilities.
 */

/** Email regex (RFC 5322 simplified) */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(email: string): boolean {
  if (typeof email !== 'string' || !email.trim()) return false
  return EMAIL_REGEX.test(email.trim())
}

export interface PasswordStrength {
  score: number
  label: 'weak' | 'fair' | 'good' | 'strong'
  feedback: string[]
}

export function getPasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = []
  let score = 0

  if (!password || password.length < 8) {
    return { score: 0, label: 'weak', feedback: ['At least 8 characters required'] }
  }

  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1
  else if (password.length >= 8) feedback.push('Mix uppercase and lowercase')
  if (/\d/.test(password)) score += 1
  else feedback.push('Add a number')
  if (/[^a-zA-Z0-9]/.test(password)) score += 1
  else feedback.push('Add a special character')

  let label: PasswordStrength['label'] = 'weak'
  if (score >= 5) label = 'strong'
  else if (score >= 4) label = 'good'
  else if (score >= 3) label = 'fair'
  else label = 'weak'

  if (feedback.length === 0 && score < 5) {
    feedback.push('Consider a longer password with more variety')
  }

  return { score, label, feedback }
}

export function isStrongPassword(password: string): boolean {
  const { score } = getPasswordStrength(password)
  return score >= 4
}

export function validateRequired(value: string | null | undefined, fieldName: string): string | null {
  if (value == null || String(value).trim() === '') {
    return `${fieldName} is required`
  }
  return null
}

export function validateMaxLength(
  value: string | null | undefined,
  max: number,
  fieldName: string
): string | null {
  if (value == null) return null
  const str = String(value)
  if (str.length > max) {
    return `${fieldName} must be at most ${max} characters`
  }
  return null
}

export function validateMinLength(
  value: string | null | undefined,
  min: number,
  fieldName: string
): string | null {
  if (value == null) return null
  const str = String(value)
  if (str.length < min) {
    return `${fieldName} must be at least ${min} characters`
  }
  return null
}

export function validateName(value: string | null | undefined): string | null {
  return validateRequired(value, 'Name') ?? validateMaxLength(value, 100, 'Name')
}

export function validateEmail(value: string | null | undefined): string | null {
  const required = validateRequired(value, 'Email')
  if (required) return required
  if (value && !isValidEmail(value)) return 'Invalid email format'
  return null
}

export function validateBio(value: string | null | undefined): string | null {
  return validateMaxLength(value, 500, 'Bio')
}

export function validatePassword(value: string | null | undefined): string | null {
  const min = validateMinLength(value, 8, 'Password')
  if (min) return min
  if (value && !isStrongPassword(value)) return 'Password is too weak'
  return null
}

export function validateConfirmPassword(
  password: string | null | undefined,
  confirm: string | null | undefined
): string | null {
  if (!confirm?.trim()) return 'Please confirm your password'
  if (password !== confirm) return 'Passwords do not match'
  return null
}

/** Guarded array helpers */
export function safeMap<T, U>(items: T[] | null | undefined, fn: (item: T, i: number) => U): U[] {
  const arr = items ?? []
  return Array.isArray(arr) ? arr.map(fn) : []
}

export function safeFilter<T>(
  items: T[] | null | undefined,
  predicate: (item: T, i: number) => boolean
): T[] {
  const arr = items ?? []
  return Array.isArray(arr) ? arr.filter(predicate) : []
}

export function safeFind<T>(
  items: T[] | null | undefined,
  predicate: (item: T, i: number) => boolean
): T | undefined {
  const arr = items ?? []
  return Array.isArray(arr) ? arr.find(predicate) : undefined
}

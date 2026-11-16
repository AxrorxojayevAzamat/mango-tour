import {
  checkEmail,
  checkName,
  checkPhone,
  cleanText,
  formatPhone,
  validateLead,
} from './lead-rules';

describe('formatPhone', () => {
  it.each([
    ['', ''],
    ['+', '+'],
    ['+998', '+998'],
    ['+9989', '+998 (9'],
    ['+99890', '+998 (90'],
    ['+998901', '+998 (90) 1'],
    ['+99890123', '+998 (90) 123'],
    ['+998901234', '+998 (90) 123-4'],
    ['+99890123456', '+998 (90) 123-45-6'],
    ['+998901234567', '+998 (90) 123-45-67'],
    ['998 90 123 45 67', '+998 (90) 123-45-67'],
    ['+998 (90) 123-45-6789', '+998 (90) 123-45-67'],
  ])('formats Uzbek number %j as %j', (raw, expected) => {
    expect(formatPhone(raw)).toBe(expected);
  });

  it('keeps foreign numbers as +digits', () => {
    expect(formatPhone('+7 (912) 345-67-89')).toBe('+79123456789');
    expect(formatPhone('+44 20 7946 0000')).toBe('+442079460000');
  });

  it('never adds a separator that Backspace would have to delete', () => {
    // Deleting ")" from "+998 (90) 1" leaves "+998 (90 1" → still 3 local digits.
    expect(formatPhone('+998 (90')).toBe('+998 (90');
    expect(formatPhone('+998 (90) 123-')).toBe('+998 (90) 123');
  });

  it('caps input at 15 digits (E.164)', () => {
    expect(formatPhone('+1234567890123456789')).toBe('+123456789012345');
  });
});

describe('checkPhone', () => {
  it('requires a number beyond the +998 prefix', () => {
    expect(checkPhone('')).toBe('required');
    expect(checkPhone('+998 ')).toBe('required');
  });

  it('accepts a complete Uzbek number', () => {
    expect(checkPhone('+998 (90) 123-45-67')).toBeNull();
  });

  it('rejects an incomplete Uzbek number', () => {
    expect(checkPhone('+998 (90) 123-45')).toBe('invalid');
  });

  it('accepts foreign numbers with 8–15 digits', () => {
    expect(checkPhone('+79123456789')).toBeNull();
    expect(checkPhone('+4915112345678')).toBeNull();
  });

  it('rejects numbers without "+", too short, or starting with 0', () => {
    expect(checkPhone('79123456789')).toBe('invalid');
    expect(checkPhone('+1234567')).toBe('invalid');
    expect(checkPhone('+0123456789')).toBe('invalid');
  });
});

describe('field checks', () => {
  it('name: required, min 2, max 80, whitespace collapsed', () => {
    expect(checkName('   ')).toBe('required');
    expect(checkName('A')).toBe('tooShort');
    expect(checkName('A'.repeat(81))).toBe('tooLong');
    expect(checkName('  Aziza  ')).toBeNull();
  });

  it('email: optional, validated when present', () => {
    expect(checkEmail('')).toBeNull();
    expect(checkEmail('aziza@example.com')).toBeNull();
    expect(checkEmail('aziza@example')).toBe('invalid');
    expect(checkEmail('not an email')).toBe('invalid');
  });

  it('cleanText strips control characters', () => {
    expect(cleanText('Az\u0000iza\u0007')).toBe('Aziza');
    expect(cleanText(' line 1\r\nline 2 ', true)).toBe('line 1\nline 2');
  });
});

describe('validateLead', () => {
  const valid = {
    name: '  Aziza ',
    phone: '+998 (90) 123-45-67',
    email: '',
    destination: 'samarkand',
    comment: 'Samarqand bo‘yicha',
    lang: 'uz',
  };

  it('normalizes a valid lead', () => {
    const result = validateLead(valid);
    expect(result).toEqual({
      ok: true,
      lead: {
        name: 'Aziza',
        phone: '+998901234567',
        email: '',
        destination: 'samarkand',
        comment: 'Samarqand bo‘yicha',
        lang: 'uz',
      },
    });
  });

  it('reports every invalid field', () => {
    const result = validateLead({
      ...valid,
      name: '',
      phone: '123',
      email: 'x@',
      destination: 'mars',
      lang: 'de',
    });
    expect(result).toEqual({
      ok: false,
      errors: {
        name: 'required',
        phone: 'invalid',
        email: 'invalid',
        destination: 'invalid',
        lang: 'invalid',
      },
    });
  });

  it('treats non-object and wrongly typed input as empty', () => {
    expect(validateLead(null).ok).toBe(false);
    expect(validateLead({ ...valid, name: 42 }).ok).toBe(false);
  });

  it('allows "other" and an empty destination', () => {
    expect(validateLead({ ...valid, destination: 'other' }).ok).toBe(true);
    expect(validateLead({ ...valid, destination: '' }).ok).toBe(true);
  });
});

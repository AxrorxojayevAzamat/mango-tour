import { caretAfterDigits } from './phone-mask';

describe('caretAfterDigits', () => {
  it('puts the caret right after the n-th digit, skipping separators', () => {
    const value = '+998 (90) 123-45-67';
    expect(caretAfterDigits(value, 5)).toBe(value.indexOf(')')); // after "90"
    expect(caretAfterDigits(value, 6)).toBe(value.indexOf('1') + 1);
    expect(caretAfterDigits(value, 12)).toBe(value.length);
  });

  it('keeps the caret after "+" when no digit precedes it', () => {
    expect(caretAfterDigits('+998', 0)).toBe(1);
    expect(caretAfterDigits('', 0)).toBe(0);
  });

  it('clamps to the end when asked for more digits than exist', () => {
    expect(caretAfterDigits('+7912', 9)).toBe(5);
  });
});

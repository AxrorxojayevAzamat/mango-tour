import { Directive, ElementRef, inject } from '@angular/core';
import { NgControl } from '@angular/forms';
import { formatPhone } from '../../core/lead/lead-rules';

/**
 * Live phone formatting for an <input formControlName>: `+998 (90) 123-45-67` for Uzbek
 * numbers, `+<digits>` for any other country (see `formatPhone`). Keeps the caret after the
 * same number of digits, so editing in the middle feels natural.
 */
@Directive({
  selector: 'input[appPhoneMask]',
  host: { '(input)': 'onInput()', '(focus)': 'onFocus()' },
})
export class PhoneMask {
  private readonly input: HTMLInputElement = inject(ElementRef).nativeElement;
  private readonly control = inject(NgControl, { self: true });

  protected onFocus(): void {
    if (!this.input.value.trim()) this.write('+998 ', 5);
  }

  protected onInput(): void {
    const raw = this.input.value;
    const caret = this.input.selectionStart ?? raw.length;
    const digitsBeforeCaret = raw.slice(0, caret).replace(/\D/g, '').length;

    const formatted = formatPhone(raw);
    this.write(formatted, caretAfterDigits(formatted, digitsBeforeCaret));
  }

  private write(value: string, caret: number): void {
    this.input.value = value;
    this.control.control?.setValue(value, { emitModelToViewChange: false });
    if (this.input.ownerDocument.activeElement === this.input) {
      this.input.setSelectionRange(caret, caret);
    }
  }
}

/** Index in `text` just after its n-th digit (or the end). */
export function caretAfterDigits(text: string, digits: number): number {
  if (digits <= 0) return text.startsWith('+') ? 1 : 0;
  let seen = 0;
  for (let i = 0; i < text.length; i++) {
    if (/\d/.test(text[i]) && ++seen === digits) return i + 1;
  }
  return text.length;
}

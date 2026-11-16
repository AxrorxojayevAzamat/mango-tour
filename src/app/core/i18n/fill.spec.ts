import { fill, placeholdersOf } from './fill';

describe('fill', () => {
  it('replaces every known placeholder', () => {
    expect(fill('{current} / {total}', { current: 2, total: 9 })).toBe('2 / 9');
  });

  it('keeps unknown placeholders visible', () => {
    expect(fill('Hello {name}', {})).toBe('Hello {name}');
  });

  it('does not treat inherited object keys as values', () => {
    expect(fill('{toString}', {})).toBe('{toString}');
  });

  it('lists placeholders', () => {
    expect(placeholdersOf('{a} and {b}, again {a}')).toEqual(['a', 'b', 'a']);
  });
});

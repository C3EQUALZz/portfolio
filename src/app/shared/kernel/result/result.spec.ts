import { describe, expect, it } from 'vitest';

import { collect, err, flatMap, map, ok, type Result, unwrapOr } from './result';

describe('Result', () => {
  it('создаёт успешный результат со значением', () => {
    const result = ok(42);

    expect(result).toEqual({ ok: true, value: 42 });
  });

  it('создаёт результат с ошибкой', () => {
    const result = err('corrupt content');

    expect(result).toEqual({ ok: false, error: 'corrupt content' });
  });

  it('map трансформирует значение успешного результата', () => {
    const result = map(ok(2), (n) => n * 10);

    expect(result).toEqual({ ok: true, value: 20 });
  });

  it('map пробрасывает ошибку, не вызывая колбэк', () => {
    let called = false;
    const failure: Result<number, string> = err('no data');
    const result = map(failure, (n) => {
      called = true;
      return n * 10;
    });

    expect(result).toEqual({ ok: false, error: 'no data' });
    expect(called).toBe(false);
  });

  it('flatMap связывает цепочку вычислений с Result', () => {
    const parse = (raw: string): Result<number, string> =>
      raw === '' ? err('empty') : ok(raw.length);

    expect(flatMap(ok('abc'), parse)).toEqual({ ok: true, value: 3 });
    expect(flatMap(ok(''), parse)).toEqual({ ok: false, error: 'empty' });
  });

  it('flatMap обрывает цепочку на ошибке входа', () => {
    let called = false;
    const failure: Result<number, string> = err('no data');
    const result = flatMap(failure, (n) => {
      called = true;
      return ok(n * 10);
    });

    expect(result).toEqual({ ok: false, error: 'no data' });
    expect(called).toBe(false);
  });

  it('unwrapOr отдаёт значение или fallback при ошибке', () => {
    expect(unwrapOr(ok(7), 0)).toBe(7);
    expect(unwrapOr(err('no data'), 0)).toBe(0);
  });

  it('collect собирает список успешных результатов', () => {
    expect(collect([ok(1), ok(2), ok(3)])).toEqual({ ok: true, value: [1, 2, 3] });
  });

  it('collect останавливается на первой ошибке', () => {
    const first: Result<number, string> = err('first');
    const second: Result<number, string> = err('second');

    expect(collect([ok(1), first, second])).toEqual({ ok: false, error: 'first' });
  });
});

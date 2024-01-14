export function mapRecord<T, U>(record: Record<string, T>, f: (key: string, value: T) => U): Record<string, U> {
  return Object.entries(record).reduce<Record<string, U>>((res, [key, value]) => {
    res[key] = f(key, value);
    return res;
  }, {});
}

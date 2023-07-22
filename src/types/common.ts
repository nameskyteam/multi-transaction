/**
 * Refers to a class that implements `T`
 */
export type Class<T> = new (...args: any[]) => T;

/**
 * Refers to a class that implements `Wrapper<T>`
 */
export type WrapperClass<T> = Class<Wrapper<T>>;

/**
 * Wrapper
 */
export interface Wrapper<T> {
  unwrap(): T;
}

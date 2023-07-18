/**
 * Refers to a class itself
 */
export type Class<T> = new (...args: any[]) => T;

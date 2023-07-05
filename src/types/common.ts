/**
 * Allow a type to have a required field that is actually `undefined`.
 * This is very useful when distinguishing between types with similar fields, as different types can have
 * different type marks, and these type marks usually do not affect the code logic.
 * @example
 * class Person {
 *   __person__: PhantomData; // a type mark, required field
 *   name: string; // required field
 *   age?: number; // optional field
 *
 *   constructor(name: string, age?: number) {
 *     this.name = name;
 *     this.age = age;
 *   }
 * }
 * const alice: Person = { name: 'alice' } // error TS2741: Property '__person__' is missing
 */
export type PhantomData = undefined;

/**
 * Refers to a class itself
 */
export type Class<T> = new (...args: any[]) => T;

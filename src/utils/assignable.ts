import { Assignable, Enum } from 'near-api-js/lib/utils/enums';

/**
 * Refers to a `class` where the constructor has only one parameter and will iterate parameter's fields into its fields
 */
export type AssignableClass<T> = new (props: any) => T;

/**
 * Struct like assignable `class`
 */
export abstract class AssignableStruct extends Assignable {}

/**
 * Enum like assignable `class`
 */
export abstract class AssignableEnum extends Enum {}

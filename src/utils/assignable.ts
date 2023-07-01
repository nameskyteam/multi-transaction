import { Assignable, Enum } from 'near-api-js/lib/utils/enums';

export type AssignableClass<T> = new (props: any) => T;

export abstract class AssignableStruct extends Assignable {}

export abstract class AssignableEnum extends Enum {}

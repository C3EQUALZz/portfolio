/** Nominal typing: raw strings cannot stand in for validated values. */
declare const brand: unique symbol;

export type Brand<T, Name extends string> = T & { readonly [brand]: Name };

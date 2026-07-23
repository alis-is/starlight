export const RADIO_GROUP = Symbol('sl-radio-group');

export interface RadioGroupContext {
	readonly name: string;
	value: unknown;
	readonly disabled: boolean;
}

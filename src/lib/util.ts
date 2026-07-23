import type { SelectItem } from './types';

export function pick_select_option<T>(options: Array<SelectItem<T>>, value?: T, default_value?: T) {
	const selected_option = options.find((x) => x.value == value);
	if (selected_option || default_value === undefined) return selected_option;
	return options.find((x) => x.value === default_value);
}

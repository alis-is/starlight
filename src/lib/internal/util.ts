import type { ValidationRules } from '../types';
import { MENU_LAYER_ID } from './constants';

export function teleport_under_element(
	element: HTMLElement & { __origin?: HTMLElement | null },
	targetId: string
) {
	element.__origin = element.parentElement;
	element.parentElement?.removeChild(element);
	document.getElementById(targetId)?.appendChild(element);
}

export function teleport_back(element: HTMLElement & { __origin?: HTMLElement | null }) {
	element.parentElement?.removeChild(element);
	element.__origin?.appendChild(element);
	element.__origin = null;
}

export function teleport_to_menu_layer(element: HTMLElement & { __origin?: HTMLElement | null }) {
	teleport_under_element(element, MENU_LAYER_ID);
}

export function create_menu_layer() {
	if (document.getElementById(MENU_LAYER_ID)) return;
	const menuLayer = document.createElement('div');
	menuLayer.id = MENU_LAYER_ID;
	document.body.appendChild(menuLayer);
}

export function validate(value: any, rules: ValidationRules): true | string {
	for (const rule of rules) {
		const result = rule(value);
		if (result !== true) return result;
	}
	return true;
}

export function create_key_press_handler(
	keys: Array<string>,
	handler: (...args: Array<any>) => any
) {
	return function (event: KeyboardEvent) {
		if (keys.includes(event.key)) {
			handler(event);
		}
	};
}

export function array_to_file_list(files: Array<File>) {
	const dataTransfer = new DataTransfer();
	for (const file of files) {
		dataTransfer.items.add(file);
	}
	return dataTransfer.files;
}

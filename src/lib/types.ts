import type { Component } from 'svelte';

export type FontIcon = {
	id: string;
	family: string;
};

export type ComponentIcon = Component<any, any, any> | typeof import('svelte').SvelteComponent;
export type Icon = FontIcon | ComponentIcon;

export type NavMenuItemType = {
	icon: Icon;
	label: string;
	hidden?: boolean;
	disabled?: boolean;
	path?: string;
	click?: () => void;
	isActive?: boolean | ((path: string) => boolean);
};

export interface MenuItem<T = any> {
	icon?: Icon;
	label: string;
	value: T;
	hidden?: boolean;
	disabled?: boolean;
	isActive?: boolean;
	click?: () => void;
}

export type SelectItem<T = any> = MenuItem<T>;

export type ValidationRule<T = any> = (value: T) => true | string;
export type ValidationRules<T = any> = Array<ValidationRule<T>>;

export type ProgressValue = number | 'indeterminate';

export type PromiseFinalizers = {
	resolve: (value?: any) => void;
	reject: (reason?: any) => void;
};

export type DataTableItem<T = any> = T & {
	selected?: boolean;
};

export type DataTableColumn<T = any> = {
	hidden?: boolean;
	name: string;
	label?: string;
	sortable?: boolean;
	filterable?: boolean;
	sortFn?: (a: DataTableItem<T>, b: DataTableItem<T>) => number;
	getValue?: (item: DataTableItem<T>) => any;
	component?: Component<{ item: DataTableItem<T>; compactModeEnabled: boolean }>;
	click?: (item: DataTableItem<T>) => any;
	disableSelect?: boolean;
	width?: string;
};

export type DataTableFilterFunction = (item: DataTableItem, filter: any) => boolean;
export enum DataTableSelectMode {
	single = 'single',
	multiple = 'multiple',
	none = 'none'
}
export type DataTableSort = {
	column: string;
	direction: 'asc' | 'desc';
	sortFn?: (a: DataTableItem, b: DataTableItem) => number;
};
export enum DataTableHighlightMode {
	none = 'none',
	row = 'row',
	column = 'column',
	cell = 'cell',
	'row-column' = 'row-column'
}
export enum DataTableLayoutMode {
	auto = 'auto',
	compact = 'compact',
	standard = 'standard'
}

export type DataTableRowClickHandler = (item: DataTableItem) => void;
export type DataTableCellClickHandler = (item: DataTableItem, column: DataTableColumn) => void;

export enum ExpandingContainerDirection {
	horizontal = 'horizontal',
	vertical = 'vertical'
}

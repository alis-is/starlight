// Components
export { default as Alert } from './components/Alert.svelte';
export { default as Avatar } from './components/Avatar.svelte';
export { default as Badge } from './components/Badge.svelte';
export { default as Breadcrumbs } from './components/Breadcrumbs.svelte';
export { default as Button } from './components/Button.svelte';
export { default as Card } from './components/Card.svelte';
export { default as CheckBox } from './components/CheckBox.svelte';
export { default as DataGrid } from './components/DataGrid.svelte';
export type { DataGridColumn } from './components/DataGrid.svelte';
export { default as Expander } from './components/Expander.svelte';
export { default as ExpandingContainer } from './components/ExpandingContainer.svelte';
export { default as FileInput } from './components/FileInput.svelte';
export { default as Icon } from './components/Icon.svelte';
export { default as Input } from './components/Input.svelte';
export { default as Island } from './components/Island.svelte';
export { default as List } from './components/List.svelte';
export { default as Menu } from './components/Menu.svelte';
export { default as NavHamburgerIcon } from './components/NavHamburgerIcon.svelte';
export { default as NavMenu } from './components/NavMenu.svelte';
export { default as NavMenuItem } from './components/NavMenuItem.svelte';
export { default as Pagination } from './components/Pagination.svelte';
export { default as ProgressBar } from './components/ProgressBar.svelte';
export { default as Radio } from './components/Radio.svelte';
export { default as RadioGroup } from './components/RadioGroup.svelte';
export { default as Select } from './components/Select.svelte';
export { default as Separator } from './components/Separator.svelte';
export { default as Skeleton } from './components/Skeleton.svelte';
export { default as Slider } from './components/Slider.svelte';
export { default as Spinner } from './components/Spinner.svelte';
export { default as Tabs } from './components/Tabs.svelte';
export { default as Textarea } from './components/Textarea.svelte';
export { default as Toaster } from './components/Toaster.svelte';
export {
	toast,
	dismissToast,
	clearToasts,
	type ToastItem,
	type ToastOptions,
	type ToastVariant
} from './components/toast.svelte';
export { default as Toggle } from './components/Toggle.svelte';
export { default as Tooltip } from './components/Tooltip.svelte';
// Terminal + TerminalDialog depend on the optional @xterm/* peers and are NOT
// re-exported here, so importing the barrel never pulls xterm. Import directly:
//   import Terminal from '@alis-is/starlight/components/Terminal.svelte';
//   import TerminalDialog from '@alis-is/starlight/dialogs/Terminal.svelte';

// Dialogs (suffixed to avoid clashing with the Select/Terminal components)
export { default as AlertDialog } from './dialogs/Alert.svelte';
export { default as ConfirmDialog } from './dialogs/Confirm.svelte';
export { default as FileDialog } from './dialogs/File.svelte';
export { default as Overlay } from './dialogs/Overlay.svelte';
export { default as ProgressDialog } from './dialogs/Progress.svelte';
export { default as PromptDialog } from './dialogs/Prompt.svelte';
export { default as SelectDialog } from './dialogs/Select.svelte';

// Types & utilities
export * from './types';
export * from './util';
export * from './internal/util';
export { USER_CANCELED } from './internal/constants';

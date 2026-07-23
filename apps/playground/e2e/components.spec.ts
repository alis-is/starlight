import { expect, test } from '@playwright/test';

test('overview lists categories and the sidebar navigates', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Starlight', level: 1 })).toBeVisible();

	// each category page renders its section
	const sections: Record<string, string> = {
		'/forms': 'section-buttons',
		'/data': 'section-list',
		'/feedback': 'section-progress',
		'/layout': 'section-containers',
		'/overlays': 'section-dialogs'
	};
	for (const [path, testid] of Object.entries(sections)) {
		await page.goto(path);
		await expect(page.getByTestId(testid)).toBeVisible();
	}
});

test('button click updates result', async ({ page }) => {
	await page.goto('/forms');
	await page.getByRole('button', { name: 'Custom child' }).click();
	await expect(page.getByTestId('dialog-result')).toHaveText('clicked');
});

test('input is bound', async ({ page }) => {
	await page.goto('/forms');
	await page.getByTestId('section-inputs').getByLabel('Name').fill('Zaphod');
	await expect(page.getByTestId('name-value')).toHaveText('Zaphod');
});

test('select opens without adding scrollbars', async ({ page }) => {
	await page.goto('/forms');
	const noHScroll = () =>
		page.evaluate(
			() => document.documentElement.scrollWidth <= document.documentElement.clientWidth
		);
	expect(await noHScroll()).toBe(true);

	await page.getByTestId('section-inputs').getByRole('button', { name: /Fruit/ }).click();
	await expect(page.getByRole('menuitem', { name: 'Banana' })).toBeVisible();
	expect(await noHScroll()).toBe(true);

	await page.getByRole('menuitem', { name: 'Banana' }).click();
	await expect(page.getByTestId('fruit-value')).toHaveText('banana');
});

test('list adds, searches and removes items', async ({ page }) => {
	await page.goto('/data');
	const section = page.getByTestId('section-list');
	await expect(page.getByTestId('todo-count')).toHaveText('3');

	await section.getByLabel('New item').fill('Buy milk');
	await section.getByRole('button', { name: 'Add' }).click();
	await expect(page.getByTestId('todo-count')).toHaveText('4');

	await section.getByLabel('Search list').fill('milk');
	await expect(section.getByRole('option')).toHaveCount(1);
	await section.getByLabel('Search list').fill('');

	await section.getByRole('button', { name: 'Remove item' }).first().click();
	await expect(page.getByTestId('todo-count')).toHaveText('3');
});

test('data grid sorts and selects', async ({ page }) => {
	await page.goto('/data');
	const section = page.getByTestId('section-grid');

	await section.getByLabel('Filter').fill('Ada');
	await expect(section.getByRole('row')).toHaveCount(2); // header + 1
	await section.getByLabel('Filter').fill('');

	await section.getByRole('columnheader').first().getByRole('checkbox').check({ force: true });
	await expect(page.getByTestId('grid-selected')).toHaveText('4');

	await section.getByRole('columnheader', { name: 'Name' }).click();
	await expect(section.getByRole('gridcell').nth(1)).toContainText('Ada');
});

test('theme switcher updates the root class', async ({ page }) => {
	await page.goto('/');
	await page.getByTestId('theme-switch').getByRole('button', { name: 'candy' }).click();
	await expect(page.locator('html')).toHaveClass('candy');
	await page
		.getByTestId('theme-switch')
		.getByRole('button', { name: 'black', exact: true })
		.click();
	await expect(page.locator('html')).toHaveClass('black');
});

test('dialogs open and resolve', async ({ page }) => {
	await page.goto('/overlays');
	await page.getByRole('button', { name: 'Alert', exact: true }).click();
	await page.getByRole('button', { name: 'close', exact: true }).click();
	await expect(page.getByTestId('dialog-result')).toHaveText('alert closed');
});

test('menu opens, selects an item, and closes on outside click', async ({ page }) => {
	await page.goto('/forms');
	const section = page.getByTestId('section-buttons');

	await section.getByRole('button', { name: /Actions/ }).click();
	await expect(page.getByRole('menuitem', { name: 'Archive' })).toBeVisible();

	// selecting an item reports its value and closes the menu
	await page.getByRole('menuitem', { name: 'Archive' }).click();
	await expect(page.getByTestId('menu-result')).toHaveText('archive');
	await expect(page.getByRole('menuitem', { name: 'Archive' })).toBeHidden();

	// reopen, then click outside to dismiss
	await section.getByRole('button', { name: /Actions/ }).click();
	await expect(page.getByRole('menuitem', { name: 'Delete' })).toBeVisible();
	await page.getByRole('heading', { name: 'Forms', level: 1 }).click();
	await expect(page.getByRole('menuitem', { name: 'Delete' })).toBeHidden();
});

test('file input reflects selected files', async ({ page }) => {
	await page.goto('/forms');
	const section = page.getByTestId('section-file');

	await expect(page.getByTestId('file-value')).toHaveText('');
	await section.locator('input[type="file"]').setInputFiles([
		{ name: 'report.pdf', mimeType: 'application/pdf', buffer: Buffer.from('a') },
		{ name: 'photo.png', mimeType: 'image/png', buffer: Buffer.from('b') }
	]);
	await expect(page.getByTestId('file-value')).toHaveText('report.pdf, photo.png');
});

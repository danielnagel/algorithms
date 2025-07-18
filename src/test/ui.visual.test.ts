import {
	test, expect
} from '@playwright/test';

test('UI state screenshots before and after interaction', async({page}) => {
	await page.goto('http://localhost:5173/test.html');
	const container = page.locator('#test-root');
	await expect(container).toHaveScreenshot('step-1-initial.png');
	await page.click('#step-forward-button');
	await expect(container).toHaveScreenshot('step-2-after-click.png');
	await page.click('#step-forward-button');
	for (let i = 0; i < 7; i++) {
		await page.click('#step-forward-button');
		await expect(container).toHaveScreenshot(`step-${i + 3}-animating.png`);
	}
});

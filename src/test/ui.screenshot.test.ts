import {
	test 
} from '@playwright/test';

test('UI state screenshots before and after interaction', async({page}) => {
	const DELAY_MS = 150;
	const ATTEMPTS = 3;
	await page.goto('http://localhost:5173');

	await page.waitForTimeout(DELAY_MS);
	await page.screenshot({
		path: 'src/test/screenshots/step-1-initial.png' 
	});

	await page.waitForTimeout(DELAY_MS);
	await page.click('#play-button');

	await page.waitForTimeout(DELAY_MS);
	await page.screenshot({
		path: 'src/test/screenshots/step-2-after-click.png' 
	});

	for (let i = 0; i < ATTEMPTS; i++) {
		await page.waitForTimeout(DELAY_MS);
		await page.screenshot({
			path: `src/test/screenshots/step-${i + 3}-animating.png` 
		});
	}
});

describe('Simple Test', () => {
    it('should open Google and check title', async () => {
        await browser.url('https://www.google.com');
        const title = await browser.getTitle();
        console.log('Page title:', title);
        expect(title).toContain('Google');
    });
});

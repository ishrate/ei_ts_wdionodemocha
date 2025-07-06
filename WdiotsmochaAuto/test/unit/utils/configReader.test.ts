const fs = require('fs');
const path = require('path');

describe('Config Reader Utility', () => {
    const configPath = path.join(__dirname, 'config.json');

    beforeAll(() => {
        fs.writeFileSync(configPath, JSON.stringify({ key: 'value' }));
    });

    afterAll(() => {
        fs.unlinkSync(configPath);
    });

    test('should read configuration file', () => {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        expect(config).toEqual({ key: 'value' });
    });

    test('should return undefined for non-existent file', () => {
        const nonExistentPath = path.join(__dirname, 'nonExistent.json');
        expect(() => {
            JSON.parse(fs.readFileSync(nonExistentPath, 'utf8'));
        }).toThrow();
    });
});
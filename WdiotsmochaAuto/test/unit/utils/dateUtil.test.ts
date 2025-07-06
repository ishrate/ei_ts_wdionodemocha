const { formatDate, parseDate } = require('../../utils/dateUtil');

test('formatDate should return the correct formatted date', () => {
    const date = new Date('2025-07-04T00:00:00Z');
    expect(formatDate(date)).toBe('07/04/2025');
});

test('parseDate should return the correct Date object', () => {
    const dateString = '07/04/2025';
    expect(parseDate(dateString)).toEqual(new Date('2025-07-04T00:00:00Z'));
});
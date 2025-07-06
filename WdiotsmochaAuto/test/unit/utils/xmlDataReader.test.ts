const fs = require('fs');
const path = require('path');
const xmlDataReader = require('../../utils/xmlDataReader');

test('should read and parse XML data correctly', () => {
    const xmlFilePath = path.join(__dirname, 'testData.xml');
    const xmlData = xmlDataReader.readXML(xmlFilePath);
    
    expect(xmlData).toEqual({
        invoiceRef: 'STD-INV-001',
        location: 'WSV Test GP & Allied Health Practice',
        provider: 'Mt Ablitt Physio',
        injuredWorker: 'Earlof Lemongrab',
        item: 'AP001',
        description: 'Standard invoice description'
    });
});
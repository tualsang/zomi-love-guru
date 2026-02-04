import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { GoogleGenerativeAI } from '@google/generative-ai';

console.log('Instantiating...');
try {
    const jwt = new JWT({ email: 'test@example.com', key: 'test', scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
    const doc = new GoogleSpreadsheet('some-id', jwt);
    const genAI = new GoogleGenerativeAI('some-key');
} catch (e) {
    console.log('Error ignoring for repro:', e);
}
console.log('Done instantiating');

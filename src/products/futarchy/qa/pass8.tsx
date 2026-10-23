import { checkPass8Data } from './pass8-data';
import { checkPass8Renders } from './pass8-render';

async function main() { await checkPass8Data(); checkPass8Renders(); }
void main().catch(error => { console.error(error); throw error; });

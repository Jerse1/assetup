import fs from 'fs';
import path from 'path';

export async function version() {
    const packageJson = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf8'));
    console.log(packageJson.version);
}

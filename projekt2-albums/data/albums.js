import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(path.resolve(), 'albums.json');

export const readData = () => {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify({}, null, 2));
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
};

export const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};
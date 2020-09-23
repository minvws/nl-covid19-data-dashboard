import fs from 'fs';
import path from 'path';

export async function readFromFSorFetch(file: string) {
  let data;
  const filePath = path.join(process.cwd(), 'public', 'json', file);
  if (fs.existsSync(filePath)) {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    data = JSON.parse(fileContents);
  } else {
    if (process.env.NODE_ENV === 'development') {
      const res = await fetch(
        `https://coronadashboard.rijksoverheid.nl/json/${file}`
      );
      data = await res.json();
    } else {
      console.error(
        'You are running a production build without having the files available locally. To prevent a DoS attack on the production server your build will now fail. To resolve this, get a copy of the local data on your machine in /public/json/'
      );
      process.exit(1);
    }
  }
  return data;
}

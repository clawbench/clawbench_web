import fs from 'fs';
import path from 'path';

const LOGOS_DIR = path.join(process.cwd(), 'public', 'logos');

async function downloadLogo(url: string, filename: string) {
  const filepath = path.join(LOGOS_DIR, filename);
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      console.error(`Failed to download: ${response.status} ${response.statusText}`);
      return;
    }
    
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(filepath, Buffer.from(buffer));
    console.log(`Downloaded ${filename} from ${url}`);
  } catch (error) {
    console.error(`Error downloading:`, error);
  }
}

async function main() {
  if (!fs.existsSync(LOGOS_DIR)) {
    fs.mkdirSync(LOGOS_DIR, { recursive: true });
  }
  await downloadLogo('https://artificialanalysis.ai/img/logos/deepseek_small.svg', 'deepseek.svg');
}

main();

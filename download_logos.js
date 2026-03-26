import https from 'https';
import fs from 'fs';
import path from 'path';

const logos = {
  'DeepSeek': 'https://artificialanalysis.ai/img/logos/deepseek_small.svg',
  'MiniMax': 'https://artificialanalysis.ai/img/logos/minimax_small.svg',
  'StepFun': 'https://artificialanalysis.ai/img/logos/stepfun_small.svg',
  'Xiaomi': 'https://artificialanalysis.ai/img/logos/xiaomi_small.svg',
  'Z.ai': 'https://artificialanalysis.ai/img/logos/zai_small.svg',
  'Amazon': 'https://artificialanalysis.ai/img/logos/aws_small.svg',
  'Anthropic': 'https://artificialanalysis.ai/img/logos/anthropic_small.svg',
  'Google': 'https://artificialanalysis.ai/img/logos/google_small.svg',
  'OpenAI': 'https://artificialanalysis.ai/img/logos/openai_small.svg',
  'MistralAI': 'https://artificialanalysis.ai/img/logos/mistral_small.png',
  'Nvidia': 'https://artificialanalysis.ai/img/logos/nvidia_small.svg',
  'xAI': 'https://artificialanalysis.ai/img/logos/xai.svg'
};

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
};

async function main() {
  const dir = './public/logos';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  for (const [name, url] of Object.entries(logos)) {
    const ext = url.split('.').pop();
    const dest = path.join(dir, `${name}.${ext}`);
    console.log(`Downloading ${name} from ${url} to ${dest}...`);
    try {
      await download(url, dest);
      console.log(`Downloaded ${name}`);
    } catch (err) {
      console.error(`Failed to download ${name}: ${err.message}`);
    }
  }
}

main();

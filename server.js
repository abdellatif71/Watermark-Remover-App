import express from 'express';
import { Jimp } from 'jimp'; // Namensierter Export für Jimp v1
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

app.post('/remove-watermark', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Keine Datei hochgeladen.' });
  }

  const filePath = req.file.path;
  const outputPath = path.join(__dirname, 'public', 'output.png');

  try {
    const image = await Jimp.read(filePath); // Statische Methode
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];
      if (red > 240 && green > 240 && blue > 240) {
        this.bitmap.data[idx + 3] = 0;
      }
    });
    await image.write(outputPath); // oder writeAsync
    res.json({ outputPath: '/output.png', message: 'Wasserzeichen entfernt.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
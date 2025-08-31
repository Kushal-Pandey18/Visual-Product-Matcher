const tf = require('@tensorflow/tfjs');
const mobilenet = require('@tensorflow-models/mobilenet');
const mockProducts = require('./src/data/mock-products.json');
const fs = require('fs');
const path = require('path');
const { Image, createCanvas } = require('canvas');

async function generateEmbeddings() {
  console.log('Loading MobileNet model...');
  const model = await mobilenet.load();
  console.log('Model loaded.');

  const productsWithEmbeddings = [];
  const imageDir = path.join(__dirname, 'src', 'data', 'images'); // Path to your downloaded image directory

  for (const product of mockProducts) {
    console.log(`Processing image for product: ${product.name}`);
    try {
      const imagePath = path.join(imageDir, product.imageFileName);
      const buffer = fs.readFileSync(imagePath);

      const img = new Image();
      img.src = buffer;

      const canvas = createCanvas(img.width, img.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, img.width, img.height);

      const imageTensor = tf.browser.fromPixels(canvas);
      const resized = tf.image.resizeBilinear(imageTensor, [224, 224]);
      const embedding = model.infer(resized, true);
      const embeddingData = await embedding.data();

      productsWithEmbeddings.push({
        ...product,
        embedding: Array.from(embeddingData),
      });

      console.log(`- Generated embedding for ${product.name}`);
      imageTensor.dispose();
      resized.dispose();
      embedding.dispose();
    } catch (error) {
      console.error(`- Failed to process image for ${product.name}:`, error.message);
    }
  }

  console.log('\n--- Generated Embeddings ---');
  console.log(JSON.stringify(productsWithEmbeddings, null, 2));
}

generateEmbeddings();

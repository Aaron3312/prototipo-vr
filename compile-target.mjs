import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const imagePath = path.join(__dirname, "public/layers/plano-base.svg");
const outputPath = path.join(__dirname, "public/targets/plano.mind");

console.log("Convirtiendo SVG a datos raw con sharp...");

// Convertir SVG a RGBA raw usando sharp
const { data: rgbaData, info } = await sharp(imagePath)
  .resize(512, 512) // MindAR funciona mejor con imágenes cuadradas moderadas
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const width = info.width;
const height = info.height;

console.log(`Imagen procesada: ${width}x${height}`);

// Convertir RGBA a greyscale (igual que compiler-base.js hace internamente)
const greyImageData = new Uint8Array(width * height);
for (let i = 0; i < greyImageData.length; i++) {
  const offset = i * 4;
  greyImageData[i] = Math.floor(
    (rgbaData[offset] + rgbaData[offset + 1] + rgbaData[offset + 2]) / 3
  );
}

const targetImage = { data: greyImageData, width, height };

console.log("Importando pipeline interno de MindAR...");

// Importar las funciones internas directamente
const { buildImageList, buildTrackingImageList } = await import(
  "mind-ar/src/image-target/image-list.js"
);
const { build: hierarchicalClusteringBuild } = await import(
  "mind-ar/src/image-target/matching/hierarchical-clustering.js"
);
const { Detector } = await import(
  "mind-ar/src/image-target/detector/detector.js"
);
const { extractTrackingFeatures } = await import(
  "mind-ar/src/image-target/tracker/extract-utils.js"
);
const tf = await import("@tensorflow/tfjs");
const msgpack = await import("@msgpack/msgpack");

console.log("Compilando features de matching (50%)...");

// Paso 1: matching features
const imageList = buildImageList(targetImage);
const keyframes = [];

for (let i = 0; i < imageList.length; i++) {
  const image = imageList[i];
  const detector = new Detector(image.width, image.height);
  await tf.nextFrame();
  tf.tidy(() => {
    const inputT = tf
      .tensor(image.data, [image.data.length], "float32")
      .reshape([image.height, image.width]);
    const { featurePoints: ps } = detector.detect(inputT);
    const maximaPoints = ps.filter((p) => p.maxima);
    const minimaPoints = ps.filter((p) => !p.maxima);
    const maximaPointsCluster = hierarchicalClusteringBuild({ points: maximaPoints });
    const minimaPointsCluster = hierarchicalClusteringBuild({ points: minimaPoints });
    keyframes.push({
      maximaPoints,
      minimaPoints,
      maximaPointsCluster,
      minimaPointsCluster,
      width: image.width,
      height: image.height,
      scale: image.scale,
    });
  });
  process.stdout.write(`\r  Matching: ${Math.round(((i + 1) / imageList.length) * 50)}%`);
}
console.log("");

console.log("Compilando tracking features (50-100%)...");

// Paso 2: tracking features
const trackingImageList = buildTrackingImageList(targetImage);
const trackingData = extractTrackingFeatures(trackingImageList, (index) => {
  process.stdout.write(
    `\r  Tracking: ${Math.round(50 + ((index + 1) / trackingImageList.length) * 50)}%`
  );
});
console.log("");

// Armar estructura final igual que exportData()
const dataList = [
  {
    targetImage: { width, height },
    matchingData: keyframes,
    trackingData,
  },
];

const buffer = msgpack.encode({ v: 2, dataList });
fs.writeFileSync(outputPath, Buffer.from(buffer));

console.log(`\n✓ Archivo guardado: ${outputPath}`);
console.log(`  Tamaño: ${(buffer.byteLength / 1024).toFixed(1)} KB`);

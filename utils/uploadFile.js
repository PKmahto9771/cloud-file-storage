const { PutObjectCommand } = require('@aws-sdk/client-s3');
const r2 = require('./r2');

const uploadFile = async (file, key) => {
  if (!file || !file.buffer || !file.originalname) {
    throw new Error('Invalid file object');
  }
  
  const finalKey = key || `${Date.now()}-${file.originalname}`;

  const command = new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: finalKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  const result = await r2.send(command);

  return {
    Location: `${process.env.CLOUDFLARE_R2_ENDPOINT}/${finalKey}`,
    Key: finalKey,
  };
};

module.exports = uploadFile;

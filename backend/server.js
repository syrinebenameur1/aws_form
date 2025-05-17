require('dotenv').config();
const express = require('express'),
      multer  = require('multer'),
      AWS     = require('aws-sdk'),
      cors    = require('cors'),
      sequelize = require('./db'),
      User    = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
});
const s3 = new AWS.S3();
const upload = multer({ storage: multer.memoryStorage() });

sequelize.sync();

// Upload
app.post('/api/users', upload.single('file'), async (req, res) => {
  const { email, username, age } = req.body;
  const key = `${Date.now()}_${req.file.originalname}`;
  await s3.upload({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: req.file.buffer
  }).promise();
  const user = await User.create({ email, username, age, fileKey: key });
  res.json(user);
});

// Lister users
app.get('/api/users', async (_, res) => {
  res.json(await User.findAll());
});

// Lister fichiers
app.get('/api/files', async (_, res) => {
  const data = await s3.listObjectsV2({ Bucket: process.env.S3_BUCKET }).promise();
  res.json(data.Contents);
});

// Supprimer fichier
app.delete('/api/files/:key', async (req, res) => {
  await s3.deleteObject({ Bucket: process.env.S3_BUCKET, Key: req.params.key }).promise();
  res.json({ deleted: req.params.key });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server sur port ${PORT}`));

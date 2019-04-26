const AWS = require('aws-sdk');

// AWS S3 Configuration
const s3Client = new AWS.S3({
	apiVersion: '2006-03-01',
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION
});
const params = {
	ACL: 'public-read',
	Body: '',
	Bucket: process.env.S3_BUCKET,
	ContentType: '',
	Key: '',
	ServerSideEncryption: 'AES256'
};

const S3 = {};
S3.s3Client = s3Client;
S3.params = params;

module.exports = S3;

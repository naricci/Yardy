const AWS = require('aws-sdk');
const aws_env = require('./s3_env');

const s3Client = new AWS.S3({
	secretAccessKey: aws_env.AWS_SECRET_ACCESS_KEY,
	accessKey: aws_env.AWS_ACCESS_KEY_ID,
	region: aws_env.REGION
});

const uploadParams = {
	Bucket: aws_env.BUCKET,
	Key: '',	// pass key
	Body: null,	// pass file body
	ACL: 'public-read'
};

const s3 = {};
s3.s3Client = s3Client;
s3.uploadParams = uploadParams;

// module.exports = s3;

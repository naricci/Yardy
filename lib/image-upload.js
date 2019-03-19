const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
// const config = require('../config');

aws.config.update({
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	accessKey: process.env.AWS_ACCESS_KEY_ID,
	region: 'us-east-1'
});

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
	if (file.mimeType === 'image/jpeg' || file.mimeType === 'image/png') {
		cb(null, true);
	} else {
		cb(new Error('Invalid file type, only JPEG and PNG is allowed!'), false);
	}
};

const upload = multer({
	fileFilter,
	storage: multerS3({
		acl: 'public-read',
		s3,
		bucket: 'yardy123',
		metadata: function(req, file, cb) {
			cb(null, { fieldName: 'TESTING_METADATA' });	// file.fieldName || 'TESTING_METADATA'
		},
		key: function(req, file, cb) {
			cb(null, Date.now().toString());
		}
	})
});

module.exports = upload;
var stream = require('stream');

const s3 = require('../config/s3_config');

exports.fileUpload = (req, res) => {
	const s3Client = s3.s3Client;
	const params = s3.uploadParams;

	params.Key = req.body.profilepic;
	params.Body = req.body.buffer;

	s3Client.upload(params, (err, data) => {
		if (err) {
			res.status(500).json({error:'Error -> ' + err});
		}
		res.json({message: 'File uploaded successfully! -> keyname = ' + req.file.profilepic});
	});
};

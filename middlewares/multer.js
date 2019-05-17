const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({
	limits: {
		fileSize: 4 * 1024 * 1024,
	},
	storage: storage
});

module.exports = upload;

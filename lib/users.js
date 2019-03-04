function findUserByEmail(email) {
	if(email) {
		return new Promise((resolve, reject) => {
			User.findOne({ email: email })
				.exec((err, doc) => {
					if (err) return reject(err);
					if (doc) return reject(new Error('This email already exists. Please enter another email.'));
					else return resolve(email);
				});
		});
	}
}
const joiCheckPasswordError = errors => {
	errors.forEach(err => {
		if (err.code === "string.pattern.base") {
			err.message = "Wrong password validation"
		} else {
			err.message = "Something went wrong, please try again"
		}
	});
	return errors;
}

export default joiCheckPasswordError;
let file = document.getElementById('file');

file.onchange = (function() {
	if (file.files.length > 0) {
		document.getElementById('filename').innerHTML = file.files[0].name;
		document.getElementById('imagePreview').src = window.URL.createObjectURL(this.files[0]);
	}
});


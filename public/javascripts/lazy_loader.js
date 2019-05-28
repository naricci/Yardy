document.addEventListener('DOMContentLoaded', (() => {
	let lazyImages = [].slice.call(document.querySelectorAll('img.lazy'));

	if ('IntersectionObserver' in window) {
		let lazyImageObserver = new IntersectionObserver((entries, observer) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					let lazyImage = entry.target;
					lazyImage.src = lazyImage.dataset.src;
					// lazyImage.srcset = lazyImage.dataset.srcset;
					lazyImage.classList.remove('lazy');
					lazyImageObserver.unobserve(lazyImage);
				}
			});
		});

		lazyImages.forEach(lazyImage => {
			lazyImageObserver.observe(lazyImage);
		});
	} else {
		// Possibly fall back to a more compatible method here
	}
}));

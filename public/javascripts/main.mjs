/**
 * Close Error Messages
 */
const delete_toggle = document.addEventListener('DOMContentLoaded', () => {
	(document.querySelectorAll('.notification .delete') || []).forEach($delete => {
		let $notification = $delete.parentNode;
		$delete.addEventListener('click', () => {
			$notification.parentNode.removeChild($notification);
		});
	});
});


/**
 * Lazy Loader for images
 */
const lazy_loader = document.addEventListener('DOMContentLoaded', (() => {
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


/**
 * Hamburger Menu toggle
 */
const menu = document.addEventListener('DOMContentLoaded', (() => {
	// Get all "navbar-burger" elements
	const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
	// Check if there are any navbar burgers
	if ($navbarBurgers.length > 0) {
		// Add a click event on each of them
		$navbarBurgers.forEach(el => {
			el.addEventListener('click', () => {
				// Get the target from the "data-target" attribute
				const target = el.dataset.target;
				const $target = document.getElementById(target);
				// Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
				el.classList.toggle('is-active');
				$target.classList.toggle('is-active');
			});
		});
	}
}));

export default { delete_toggle, lazy_loader, menu };

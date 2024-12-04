loadTeamData = () => {
	fetch("data/team.json")
		.then((response) => {
			if (!response.ok) {
				throw new Error("HTTP error " + response.status);
			}
			return response.json();
		})
		.then((data) => {
			updatePageWithTeamData(data);
		})
		.catch((error) => {
			console.error("There was an error!", error);
		});
};

const updatePageWithTeamData = (data) => {
	const teamBoxes = document.getElementById("team-boxes");
	if (!teamBoxes) {
		console.error("Element with ID 'team-boxes' not found.");
		return;
	}

	data.forEach((member) => {
		const teamBox = createTeamBox(member);
		teamBoxes.appendChild(teamBox);
	});
};

const createTeamBox = (member) => {
	const teamBox = document.createElement("div");
	teamBox.classList.add("team-box");

	// Create and append the member's profile image
	const img = document.createElement("img");
	img.src = member.profile_img;
	img.alt = `${member.name} Image`;
	teamBox.appendChild(img);

	// Create and append the member's name
	const name = document.createElement("p");
	name.classList.add("name");
	name.textContent = member.name;
	teamBox.appendChild(name);

	// Create and append the member's position
	const position = document.createElement("p");
	position.classList.add("position");
	position.textContent = member.position;
	teamBox.appendChild(position);

	return teamBox;
};

const loadEvents = () => {
	fetch("data/events.json")
		.then((response) => {
			if (!response.ok) {
				throw new Error("HTTP error " + response.status);
			}
			return response.json();
		})
		.then((data) => {
			updatePageWithEventData(data);
		})
		.catch((error) => {
			console.error("There was an error!", error);
		});
};

const updatePageWithEventData = (data) => {
	const gallery = document.getElementById("gallery");
	if (!gallery) {
		console.error("Element with ID 'gallery' not found.");
		return;
	}

	const [leftData, rightData] = [
		data.slice(0, Math.floor(data.length / 2)),
		data.slice(Math.floor(data.length / 2)),
	];

	const appendAndDuplicate = (gallery, data) => {
		data.forEach((eventImages) => {
			createEventGallery(eventImages).forEach((eventBox) =>
				gallery.appendChild(eventBox)
			);
		});
		// Duplicate the entire row
		Array.from(gallery.children).forEach((child) =>
			gallery.appendChild(child.cloneNode(true))
		);
	};

	// Update both galleries
	[
		{ gallery: document.getElementById("gallery-left"), data: leftData },
		{ gallery: document.getElementById("gallery-right"), data: rightData },
	].forEach(({ gallery, data }) => {
		appendAndDuplicate(gallery, data);
		// Adjust parent container widths
		const totalWidth = Array.from(gallery.children).reduce(
			(sum, child) => sum + child.offsetWidth,
			0
		);
		gallery.parentElement.style.width = `${totalWidth / 2}px`;
	});
};

const createEventGallery = (eventImages) => {
	const eventImagesArray = [];

	eventImages.pictures.forEach((picture) => {
		const eventBox = document.createElement("div");
		eventBox.classList.add("event-box");

		const galleryOverlay = document.createElement("div");
		galleryOverlay.classList.add("gallery-overlay");

		const overlayText = document.createElement("p");
		overlayText.textContent = eventImages.name;
		galleryOverlay.appendChild(overlayText);

		eventBox.appendChild(galleryOverlay);

		const img = document.createElement("img");
		img.src = picture;
		img.alt = eventImages.name;
		img.classList.add("gallery-image");

		eventBox.appendChild(img);
		eventImagesArray.push(eventBox);
	});
	return eventImagesArray;
};

document.addEventListener("DOMContentLoaded", () => {
	loadTeamData();
	loadEvents();
});

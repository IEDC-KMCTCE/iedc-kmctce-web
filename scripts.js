const loadTeamData = async () => {
	try {
		const response = await fetch("data/team.json");
		if (!response.ok) {
			throw new Error("HTTP error " + response.status);
		}
		const data = await response.json();
		updatePageWithTeamData(data);
	} catch (error) {
		console.error("There was an error!", error);
	}
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

const loadEvents = async () => {
	try {
		const response = await fetch("data/events.json");
		if (!response.ok) {
			throw new Error("HTTP error " + response.status);
		}
		const data = await response.json();
		updatePageWithEventData(data);
	} catch (error) {
		console.error("There was an error!", error);
	}
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

const autoScrollGallery = () => {
	// It just works, I don't know why
	const galleryLeft = document.getElementById("gallery-left");
	const galleryRight = document.getElementById("gallery-right");

	const maxLeftWidth = parseInt(galleryLeft.parentElement.style.width);
	const minLeftWidth = 0;

	const maxRightWidth = parseInt(galleryRight.parentElement.style.width);
	const minRightWidth = 0;

	let leftStep = -1;
	let rightStep = 1;

	// Set the gallery to the initial position
	galleryLeft.style.left = "0px";
	galleryRight.style.left = `${-maxRightWidth}px`;

	const scroll = () => {
		const galleryLeft = document.getElementById("gallery-left");
		const galleryRight = document.getElementById("gallery-right");

		const leftWidth = parseInt(galleryLeft.style.left);
		const rightWidth = parseInt(galleryRight.style.left);

		// If borders are reached, change the direction
		if (leftWidth < -maxLeftWidth || leftWidth > minLeftWidth) {
			leftStep *= -1;
			rightStep *= -1;
		}

		if (rightWidth < -maxRightWidth || rightWidth > minRightWidth) {
			rightStep *= -1;
			leftStep *= -1;
		}

		galleryLeft.style.left = `${leftWidth + leftStep}px`;
		galleryRight.style.left = `${rightWidth + rightStep}px`;
	};

	setInterval(scroll, 10);
};

document.addEventListener("DOMContentLoaded", async () => {
	await loadTeamData();
	await loadEvents();
	autoScrollGallery();
});

loadTeamData = () => {
	fetch("/data/team.json")
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

document.onload = loadTeamData();

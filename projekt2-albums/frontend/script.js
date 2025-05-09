
const API_URL = "http://localhost:3000/albums";
const albumsContainer = document.getElementById("albums");
async function fetchAlbums() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch albums: ${response.statusText}`);
        }
        const data = await response.json();

        // Render albums as cards
        renderAlbums(data);
    } catch (error) {
        console.error("Error fetching albums:", error);
    }
}
function renderAlbums(data) {
    const albumsContainer = document.getElementById("albums");
    if (!albumsContainer) {
        console.error("Error: #albums container not found in the DOM.");
        return;
    }

    albumsContainer.innerHTML = "";

    data.sort((a, b) => a.artist.localeCompare(b.artist));

    data.forEach(entry => {
        const card = document.createElement("div");
        card.className = "album-card";
        card.style.backgroundImage = `url('${entry.coverUrl || "https://via.placeholder.com/300x400"}')`;
        card.innerHTML = `
            <div class="album-overlay">
                <h3>${entry.title}</h3>
                <p><strong>Artist:</strong> ${entry.artist}</p>
                <p><strong>Release Date:</strong> ${entry.releaseDate}</p>
                <p><strong>Genre:</strong> ${entry.genre}</p>
                <div class="album-actions">
                    <button onclick="editEntry(${entry.id}, '${entry.title}', '${entry.artist}', '${entry.releaseDate}', '${entry.genre}', '${entry.coverUrl}')">Edit</button>
                    <button onclick="deleteEntry(${entry.id})">Delete</button>
                </div>
            </div>
        `;
        albumsContainer.appendChild(card);
    });
}

function showAddForm() {
    document.getElementById("form-title").textContent = "Add Entry";
    document.getElementById("entry-id").value = "";
    document.getElementById("title").value = "";
    document.getElementById("artist").value = "";
    document.getElementById("releaseDate").value = "";
    document.getElementById("genre").value = "";
    document.getElementById("form-container").style.display = "block";
}

function editEntry(id, title, artist, releaseDate, genre, coverUrl) {
    document.getElementById("form-title").textContent = "Edit Entry";
    document.getElementById("entry-id").value = id;
    document.getElementById("title").value = title;
    document.getElementById("artist").value = artist;
    document.getElementById("releaseDate").value = releaseDate;
    document.getElementById("genre").value = genre;
    document.getElementById("coverUrl").value = coverUrl;
    document.getElementById("form-container").style.display = "block";
}

function hideForm() {
    document.getElementById("form-container").style.display = "none";
}

async function submitForm(event) {
    event.preventDefault();

    const id = document.getElementById("entry-id").value;
    const title = document.getElementById("title").value;
    const artist = document.getElementById("artist").value;
    const releaseDate = document.getElementById("releaseDate").value;
    const genre = document.getElementById("genre").value;
    const coverUrl = document.getElementById("coverUrl").value;

    console.log("Submitting form with data:", { title, artist, releaseDate, genre, coverUrl }); // Debugging

    const method = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, artist, releaseDate, genre, coverUrl })
        });

        if (!response.ok) {
            throw new Error(`Failed to ${id ? "update" : "add"} album: ${response.statusText}`);
        }

        hideForm();
        fetchAlbums(); 
    } catch (error) {
        console.error("Error submitting form:", error);
    }
}

async function deleteEntry(id) {
    if (confirm("Are you sure you want to delete this entry?")) {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        fetchAlbums();
    }
}
async function searchAlbums() {
    const query = document.getElementById("search-query").value;

    try {
        const response = await fetch(`${API_URL}/search?query=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error(`Failed to search albums: ${response.statusText}`);
        }
        const data = await response.json();

        // Render search results as cards
        renderAlbums(data);
    } catch (error) {
        console.error("Error searching albums:", error);
    }
}

// Fetch timetable on page load
fetchAlbums();
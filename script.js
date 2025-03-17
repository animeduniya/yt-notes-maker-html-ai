const CLIENT_ID = "388965281269-848les0kd3k867da98klvetvt7ackuor.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/youtube.force-ssl";

function authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({ scope: SCOPES })
        .then(() => console.log("✅ Signed in!"))
        .catch(error => console.error("❌ Error signing in:", error));
}

function loadClient() {
    gapi.client.setApiKey("AIzaSyD_64PJs5rFmAl_U1ON983bihNwMzy3nGc");
    gapi.client.load("youtube", "v3")
        .then(() => console.log("✅ GAPI client loaded"))
        .catch(error => console.error("❌ Error loading GAPI client:", error));
}

function fetchTranscript(videoId) {
    console.log("📹 Fetching transcript for Video ID:", videoId); // Debug Log

    gapi.client.youtube.captions.list({
        "part": "snippet",
        "videoId": videoId
    }).then(response => {
        console.log("🔄 API Response:", response); // Debug Log

        if (response.result.items.length > 0) {
            const captions = response.result.items[0].snippet;
            document.getElementById("transcriptContainer").innerHTML = `
                <p><strong>Transcript:</strong></p>
                <p>${captions.name}</p>
            `;
        } else {
            document.getElementById("transcriptContainer").innerHTML = `<p>❌ No transcript found.</p>`;
        }
    }).catch(error => {
        console.error("❌ Error fetching transcript:", error);
        document.getElementById("transcriptContainer").innerHTML = `<p>❌ Error fetching transcript. Check console.</p>`;
    });
}

function handleAuthClick() {
    authenticate().then(() => {
        let videoUrl = document.getElementById("videoUrl").value;
        let videoId = extractVideoID(videoUrl);

        console.log("🔎 Extracted Video ID:", videoId); // Debug Log

        if (videoId) {
            fetchTranscript(videoId);
        } else {
            alert("❌ Invalid YouTube URL");
        }
    });
}

function extractVideoID(url) {
    let match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([\w-]{11})/);
    return match ? match[1] : null;
}

function initGapi() {
    console.log("🔄 Initializing GAPI..."); // Debug Log
    gapi.load("client:auth2", () => {
        gapi.auth2.init({ client_id: CLIENT_ID }).then(() => {
            console.log("✅ GAPI initialized!");
            loadClient();
        });
    });
}

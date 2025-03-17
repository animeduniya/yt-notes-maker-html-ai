const CLIENT_ID = "388965281269-848les0kd3k867da98klvetvt7ackuor.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/youtube.force-ssl";

function authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({ scope: SCOPES })
        .then(() => console.log("Signed in!"))
        .catch(error => console.error("Error signing in:", error));
}

function loadClient() {
    gapi.client.setApiKey("AIzaSyD_64PJs5rFmAl_U1ON983bihNwMzy3nGc");
    gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(() => console.log("GAPI client loaded"))
        .catch(error => console.error("Error loading GAPI client:", error));
}

function fetchTranscript(videoId) {
    gapi.client.youtube.captions.list({
        "part": "snippet",
        "videoId": videoId
    }).then(response => {
        if (response.result.items.length > 0) {
            const captions = response.result.items[0];
            document.getElementById("transcriptContainer").innerHTML = `<p><strong>Transcript:</strong></p><p>${captions.snippet.name}</p>`;
        } else {
            document.getElementById("transcriptContainer").innerHTML = `<p>No transcript found.</p>`;
        }
    }).catch(error => {
        console.error("Error fetching transcript:", error);
    });
}

function handleAuthClick() {
    authenticate().then(() => {
        let videoUrl = document.getElementById("videoUrl").value;
        let videoId = extractVideoID(videoUrl);
        if (videoId) {
            fetchTranscript(videoId);
        } else {
            alert("Invalid YouTube URL");
        }
    });
}

function extractVideoID(url) {
    let match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([\w-]{11})/);
    return match ? match[1] : null;
}

function initGapi() {
    gapi.load("client:auth2", () => {
        gapi.auth2.init({ client_id: CLIENT_ID });
    });
}

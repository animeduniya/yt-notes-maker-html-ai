const API_KEY = "AIzaSyD_64PJs5rFmAl_U1ON983bihNwMzy3nGc";  // Replace with your YouTube API Key

async function fetchTranscript() {
    let videoUrl = document.getElementById("videoUrl").value;
    let videoId = extractVideoID(videoUrl);

    if (!videoId) {
        alert("Invalid YouTube URL!");
        return;
    }

    try {
        let response = await fetch(`https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${API_KEY}`);
        let data = await response.json();

        if (data.items && data.items.length > 0) {
            let transcriptText = await getTranscriptText(data.items[0].id);
            document.getElementById("transcript").innerText = transcriptText;
            document.getElementById("transcriptContainer").style.display = "block";
        } else {
            document.getElementById("transcript").innerText = "No transcript available!";
        }
    } catch (error) {
        console.error(error);
        document.getElementById("transcript").innerText = "Failed to fetch transcript.";
    }
}

async function getTranscriptText(captionId) {
    let response = await fetch(`https://www.googleapis.com/youtube/v3/captions/${captionId}?key=${API_KEY}`);
    return await response.text();
}

function extractVideoID(url) {
    let match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([\w-]{11})/);
    return match ? match[1] : null;
}

function copyTranscript() {
    let transcriptText = document.getElementById("transcript").innerText;
    navigator.clipboard.writeText(transcriptText);
    alert("Copied to clipboard!");
}

function downloadTranscript() {
    let transcriptText = document.getElementById("transcript").innerText;
    let blob = new Blob([transcriptText], { type: "text/plain" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "transcript.txt";
    link.click();
}

document.getElementById('imageInput').addEventListener('change', handleFileSelect, false);

function handleFileSelect(event) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const base64Image = e.target.result;
        document.getElementById('imagePreview').src = base64Image;
        document.getElementById('imagePreview').style.display = 'block';

        // Display loading text
        document.getElementById('responseText').innerText = 'Loading...';
        document.getElementById('responseText').classList.add('loading');

        // Send this base64Image to the cloud function
        sendToCloudFunction(base64Image);
    };

    reader.readAsDataURL(event.target.files[0]);
}

function sendToCloudFunction(base64Image) {
    const url = 'YOUR_CLOUD_FUNCTION_URL'; // Replace with your cloud function URL
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Image }),
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('responseText').innerText = data.answer;
        document.getElementById('responseText').classList.remove('loading');
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('responseText').innerText = 'Error loading response';
        document.getElementById('responseText').classList.remove('loading');
    });
}

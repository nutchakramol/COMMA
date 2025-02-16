// AWS Configuration
const AWS_CONFIG = {
    accessKeyId: 'AKIATNVEV2N7KS75GEBL',
    secretAccessKey: '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',
    region: 'ap-southeast-2'
};

const BUCKET_NAME = 'test-for-comma';


// Initialize AWS SDK
AWS.config.update(AWS_CONFIG);
const s3 = new AWS.S3();

// Upload functionality
if (document.getElementById('uploadForm')) {
    const uploadForm = document.getElementById('uploadForm');
    const messageDiv = document.getElementById('message');

    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const file = document.getElementById('imageInput').files[0];
        if (!file) {
            showMessage('Please select a file to upload.', 'error');
            return;
        }

        const params = {
            Bucket: BUCKET_NAME,
            Key: file.name,
            Body: file,
            ContentType: file.type,
        };


        try {
            const data = await s3.upload(params).promise();
            showMessage('Upload successful!', 'success');
            console.log('File uploaded successfully:', data.Location);
        } catch (error) {
            showMessage('Upload failed: ' + error.message, 'error');
            console.error('Upload error:', error);
        }
    });

    function showMessage(message, type) {
        messageDiv.textContent = message;
        messageDiv.className = type;
    }
}

// Gallery functionality
if (document.getElementById('gallery')) {
    const galleryDiv = document.getElementById('gallery');

    async function loadGallery() {
        try {
            const params = { Bucket: BUCKET_NAME };
            const data = await s3.listObjectsV2(params).promise();
            
            galleryDiv.innerHTML = data.Contents.map(item => `
                <div class="image-container">
                    <img src="https://${BUCKET_NAME}.s3.amazonaws.com/${item.Key}" alt="${item.Key}">
                    <button onclick="deleteImage('${item.Key}')">Delete</button>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error loading gallery:', error);
        }
    }

    async function deleteImage(key) {
        try {
            const params = { Bucket: BUCKET_NAME, Key: key };
            await s3.deleteObject(params).promise();
            loadGallery();
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    }

    window.deleteImage = deleteImage;
    loadGallery();
}

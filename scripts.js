const imageUpload = document.getElementById('imageUpload');
const downloadBtn = document.getElementById('downloadBtn');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Enable high-quality smoothing for modern look
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';

imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            try {
                // Convert to 1:1 square
                const size = Math.min(img.width, img.height);
                canvas.width = size;
                canvas.height = size;

                // Draw cropped 1:1 image
                ctx.drawImage(
                    img,
                    (img.width - size) / 2,
                    (img.height - size) / 2,
                    size,
                    size,
                    0,
                    0,
                    size,
                    size
                );

                // Crop 5% from bottom for banner space
                const cropHeight = size * 0.95;
                const imageData = ctx.getImageData(0, 0, size, cropHeight);
                canvas.height = cropHeight;
                ctx.putImageData(imageData, 0, 0);

                // Draw modern gradient banner (5% height: blue to dark blue)
                const bannerHeight = size * 0.05;
                const gradient = ctx.createLinearGradient(0, cropHeight - bannerHeight, 0, cropHeight);
                gradient.addColorStop(0, '#007bff');    // Light blue start
                gradient.addColorStop(1, '#0056b3');    // Dark blue end
                ctx.fillStyle = gradient;
                ctx.fillRect(0, cropHeight - bannerHeight, size, bannerHeight);

                // Modern text styling: Bold, shadowed, white
                ctx.fillStyle = "#ffffff";
                ctx.strokeStyle = "#ffffff";  // For subtle outline if needed
                ctx.lineWidth = 1;
                const fontSize = bannerHeight * 0.7;  // Slightly larger for impact
                ctx.font = `bold ${fontSize}px Arial Black, Arial`;  // Bold modern font
                ctx.textBaseline = "middle";
                ctx.shadowColor = "rgba(0, 0, 0, 0.5)";  // Subtle shadow for depth
                ctx.shadowBlur = 2;
                ctx.shadowOffsetX = 1;
                ctx.shadowOffsetY = 1;

                // Position text aesthetically: Left (LOGO), Center (Brand), Right (Enquiry)
                const logoX = 15;  // Left-aligned with padding
                const brandX = size * 0.35;  // Centered-ish, adjusted for length
                const enquiryX = size * 0.65;  // Right-aligned with space
                const y = cropHeight - bannerHeight / 2;

                // LOGO (small, bold)
                ctx.font = `bold ${fontSize * 0.9}px Arial Black, Arial`;
                ctx.fillText("LOGO", logoX, y);

                // Brand Name (italic for flair, centered)
                ctx.font = `italic bold ${fontSize}px Arial Black, Arial`;
                ctx.textAlign = "center";  // Temporarily center for brand
                ctx.fillText("Brand Name", size / 2, y);  // True center
                ctx.textAlign = "left";  // Reset

                // Enquiry (slightly smaller, right-aligned)
                ctx.font = `bold ${fontSize * 0.85}px Arial Black, Arial`;
                ctx.textAlign = "right";
                ctx.fillText("Enquiry: 1234567890", size - 15, y);  // Right with padding
                ctx.textAlign = "left";  // Reset

                // Clear shadows for clean finish
                ctx.shadowColor = "transparent";
                ctx.shadowBlur = 0;

                downloadBtn.disabled = false;
            } catch (error) {
                console.error('Error processing image:', error);
                alert('Failed to process image. Please try another file.');
            }
        };
        img.onerror = () => {
            alert('Invalid image file.');
        };
        img.src = event.target.result;
    };
    reader.onerror = () => {
        alert('Error reading file.');
    };
    reader.readAsDataURL(file);
});

downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'modern_brand_image.png';  // More descriptive filename
    link.href = canvas.toDataURL('image/png', 1.0);  // High quality PNG
    link.click();
});

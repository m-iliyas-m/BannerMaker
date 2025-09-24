const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const imageUpload = document.getElementById("imageUpload");
const logoUpload = document.getElementById("logoUpload");
const dropZone = document.getElementById("dropZone");

const bannerColor = document.getElementById("bannerColor");
const bannerHeight = document.getElementById("bannerHeight");
const zoomSlider = document.getElementById("zoom");

const brandName = document.getElementById("brandName");
const tagline = document.getElementById("tagline");
const contact = document.getElementById("contact");
const watermark = document.getElementById("watermark");

const rotateBtn = document.getElementById("rotateBtn");
const flipBtn = document.getElementById("flipBtn");
const resetBtn = document.getElementById("resetBtn");

const canvasSizeSelect = document.getElementById("canvasSize");
const bannerLayout = document.getElementById("bannerLayout");
const stickerSelect = document.getElementById("sticker");
const ctaSelect = document.getElementById("cta");

const fileType = document.getElementById("fileType");
const downloadBtn = document.getElementById("downloadBtn");

let img = null, logo = null;
let zoom = 1, rotation = 0, flipped = false;

// Load image
function loadImage(file, isLogo = false) {
  const reader = new FileReader();
  reader.onload = e => {
    const image = new Image();
    image.onload = () => {
      if (isLogo) {
        logo = image;
      } else {
        img = image;
        setCanvasSize("1:1");
      }
      drawCanvas();
      downloadBtn.disabled = false;
    };
    image.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

imageUpload.addEventListener("change", e => loadImage(e.target.files[0]));
logoUpload.addEventListener("change", e => loadImage(e.target.files[0], true));

// Drag & Drop
dropZone.addEventListener("dragover", e => {
  e.preventDefault();
  dropZone.style.borderColor = "#007bff";
});
dropZone.addEventListener("dragleave", () => dropZone.style.borderColor = "#aaa");
dropZone.addEventListener("drop", e => {
  e.preventDefault();
  dropZone.style.borderColor = "#aaa";
  if (e.dataTransfer.files.length) loadImage(e.dataTransfer.files[0]);
});

// Canvas Size
function setCanvasSize(type) {
  if (type === "1:1") { canvas.width = 800; canvas.height = 800; }
  else if (type === "4:5") { canvas.width = 800; canvas.height = 1000; }
  else if (type === "9:16") { canvas.width = 720; canvas.height = 1280; }
}

canvasSizeSelect.addEventListener("change", () => {
  setCanvasSize(canvasSizeSelect.value);
  drawCanvas();
});

// Draw everything
function drawCanvas() {
  if (!img) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(canvas.width/2, canvas.height/2);
  ctx.scale(flipped ? -1 : 1, 1);
  ctx.rotate(rotation * Math.PI/180);
  const drawSize = Math.min(canvas.width, canvas.height) * zoom;
  ctx.drawImage(img, -drawSize/2, -drawSize/2, drawSize, drawSize);
  ctx.restore();

  // Banner Layout
  const bh = (canvas.height * bannerHeight.value) / 100;
  ctx.fillStyle = bannerColor.value;

  if (bannerLayout.value === "bottom") {
    ctx.fillRect(0, canvas.height - bh, canvas.width, bh);
  } else if (bannerLayout.value === "top") {
    ctx.fillRect(0, 0, canvas.width, bh);
  } else if (bannerLayout.value === "side") {
    ctx.fillRect(canvas.width - bh, 0, bh, canvas.height);
  }

  // Texts
  ctx.fillStyle = "#fff";
  ctx.font = `${bh*0.4}px Arial`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  if (bannerLayout.value !== "none") {
    ctx.fillText(brandName.value || "Brand Name", 20, canvas.height - bh/2);
    ctx.fillText(tagline.value || "Tagline", canvas.width/3, canvas.height - bh/2);
    ctx.fillText(contact.value || "Enquiry: 1234567890", canvas.width*0.65, canvas.height - bh/2);
  }

  // Logo
  if (logo) {
    const size = bh * 0.8;
    ctx.drawImage(logo, canvas.width - size - 10, canvas.height - size - 5, size, size);
  }

  // Stickers
  if (stickerSelect.value) {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(100, 100, 70, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 28px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      stickerSelect.value === "sale" ? "SALE" :
      stickerSelect.value === "discount" ? "50% OFF" : "NEW",
      100, 110
    );
  }

  // CTA
  if (ctaSelect.value) {
    ctx.fillStyle = "#007bff";
    ctx.fillRect(canvas.width/2 - 120, canvas.height - bh - 60, 240, 50);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 22px Arial";
    ctx.textAlign = "center";
    let text = ctaSelect.value === "shop" ? "SHOP NOW" :
               ctaSelect.value === "dm" ? "DM TO BUY" : "SWIPE UP";
    ctx.fillText(text, canvas.width/2, canvas.height - bh - 35);
  }

  // Watermark
  if (watermark.checked) {
    ctx.globalAlpha = 0.3;
    ctx.font = `${canvas.width*0.05}px Arial`;
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.fillText("© My Brand", canvas.width/2, canvas.height/2);
    ctx.globalAlpha = 1;
  }
}

// Controls
zoomSlider.addEventListener("input", () => { zoom = zoomSlider.value; drawCanvas(); });
rotateBtn.addEventListener("click", () => { rotation += 90; drawCanvas(); });
flipBtn.addEventListener("click", () => { flipped = !flipped; drawCanvas(); });
[bannerColor, bannerHeight, brandName, tagline, contact, watermark, bannerLayout, stickerSelect, ctaSelect]
  .forEach(el => el.addEventListener("input", drawCanvas));

// Reset
resetBtn.addEventListener("click", () => { rotation = 0; flipped = false; zoom = 1; drawCanvas(); });

// Download
downloadBtn.addEventListener("click", () => {
  const type = fileType.value;
  const link = document.createElement("a");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  link.download = `banner_${timestamp}.${type}`;
  link.href = canvas.toDataURL(`image/${type}`);
  link.click();
});

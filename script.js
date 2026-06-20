const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const statusText = document.getElementById("status");
const downloadBtn = document.getElementById("downloadBtn");
const ratioButtons = document.querySelectorAll("[data-ratio]");

let cropper = null;
let currentFileType = "image/png";

imageInput.addEventListener("change", event => {
  const file = event.target.files[0];
  if (!file) return;

  if (!["image/jpeg", "image/png"].includes(file.type)) {
    alert("JPG 또는 PNG 파일만 업로드할 수 있습니다.");
    return;
  }

  currentFileType = file.type;
  const url = URL.createObjectURL(file);
  preview.src = url;

  preview.onload = () => {
    if (cropper) cropper.destroy();

    cropper = new Cropper(preview, {
      aspectRatio: NaN,
      viewMode: 1,
      autoCropArea: 0.8,
      background: false
    });

    statusText.textContent = "이미지가 업로드되었습니다. 원하는 비율을 선택한 뒤 다운로드하세요.";
    downloadBtn.disabled = false;
  };
});

ratioButtons.forEach(button => {
  button.addEventListener("click", () => {
    if (!cropper) {
      alert("먼저 이미지를 업로드하세요.");
      return;
    }

    const ratio = button.dataset.ratio;
    cropper.setAspectRatio(ratio === "free" ? NaN : Number(ratio));
  });
});

downloadBtn.addEventListener("click", () => {
  if (!cropper) return;

  const canvas = cropper.getCroppedCanvas({
    maxWidth: 2000,
    maxHeight: 2000,
    imageSmoothingEnabled: true,
    imageSmoothingQuality: "high"
  });

  const extension = currentFileType === "image/jpeg" ? "jpg" : "png";
  const link = document.createElement("a");
  link.href = canvas.toDataURL(currentFileType);
  link.download = `cropped-image.${extension}`;
  link.click();
});

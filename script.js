(function () {
    const form = document.getElementById('posterForm');
    const imageInput = document.getElementById('image');
    const modal = document.getElementById('modal');
    const cropImage = document.getElementById('cropImage');
    const cropButton = document.getElementById('cropButton');
    const closeModalButton = document.getElementById('closeModal');
    const generateButton = document.getElementById('generateButton');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const downloadBtn = document.getElementById('downloadBtn');
    const defaultImageSrc = './default-poster-background.png';
    let cropper;
    let croppedImageDataURL;

    function drawDefaultPoster() {
        const defaultImg = new Image();
        defaultImg.onload = function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(defaultImg, 0, 0, canvas.width, canvas.height);
        };
        defaultImg.src = defaultImageSrc;
    }

    window.onload = function () {
        drawDefaultPoster();
    };

    function showModal() {
        modal.style.display = 'flex';
    }

    function hideModal() {
        modal.style.display = 'none';
    }

    imageInput.addEventListener('change', function () {
        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                cropImage.src = event.target.result;
                showModal();
                if (cropper) {
                    cropper.destroy();
                }
                cropper = new Cropper(cropImage, {
                    viewMode: 1,
                    autoCropArea: 1,
                    aspectRatio: NaN,
                    responsive: true,
                    restore: true,
                });
            };
            reader.readAsDataURL(file);
        }
    });

    cropButton.addEventListener('click', function () {
        const croppedCanvas = cropper.getCroppedCanvas();
        croppedImageDataURL = croppedCanvas.toDataURL();
        hideModal();
    });

    closeModalButton.addEventListener('click', function () {
        hideModal();
    });

    function fitTextToRectangle(ctx, text, maxWidth, maxHeight) {
        let fontSize = 48;
        ctx.font = `bold ${fontSize}px sans-serif`;
        let textWidth = ctx.measureText(text).width;
        let textHeight = fontSize;
        while ((textWidth > maxWidth || textHeight > maxHeight) && fontSize > 1) {
            fontSize -= 1;
            ctx.font = `bold ${fontSize}px sans-serif`;
            textWidth = ctx.measureText(text).width;
            textHeight = fontSize;
        }
        return fontSize;
    }

    generateButton.addEventListener('click', function () {
        if (croppedImageDataURL) {
            const croppedImage = new Image();
            croppedImage.onload = function () {
                const name = document.getElementById('name').value;
                const defaultImg = new Image();
                defaultImg.onload = function () {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(croppedImage, 396, 1749, 750, 750);
                    ctx.drawImage(defaultImg, 0, 0, canvas.width, canvas.height);

                    const rectX = 385;
                    const rectY = 2580;
                    const rectWidth = 765;
                    const rectHeight = 115;
                    const fontSize = fitTextToRectangle(ctx, name, rectWidth, rectHeight);
                    ctx.font = `bold ${fontSize}px sans-serif`;
                    ctx.fillStyle = '#000000';
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 10;
                    const textWidth = ctx.measureText(name).width;
                    const textX = rectX + (rectWidth - textWidth) / 2;
                    const textY = rectY + (rectHeight + fontSize) / 2 - 10;
                    ctx.strokeText(name, textX, textY);
                    ctx.fillText(name, textX, textY);
                    downloadBtn.style.display = 'block';
                };
                defaultImg.src = defaultImageSrc;
            };
            croppedImage.src = croppedImageDataURL;
        } else {
            alert('Please crop the image first.');
        }
    });

    downloadBtn.addEventListener('click', function () {
        const link = document.createElement('a');
        link.download = 'poster.png';
        link.href = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
        link.click();
    });
})();

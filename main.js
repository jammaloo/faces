const defaultImageUrl = 'face.png';
const modes = ['normal', 'fixed'];
let currentMode = modes[0];
const crosshairSize = 6;
let previewOffset = [0, 0];
let imageCenterOffset = [0, 0];

function init(passedImageUrl = null) {
    const container = document.querySelector('.faceContainer');
    container.innerHTML = '';
    let imageUrl = defaultImageUrl;
    let sliceCount = 30;
    if (passedImageUrl) {
        imageUrl = passedImageUrl;
    } else {
        const uri = new URL(window.location.href);
        if (uri.hash) {
            try {
                const urlData = JSON.parse(decodeURIComponent(uri.hash.substring(1)));
                new URL(urlData.imageUrl);
                imageUrl = urlData.imageUrl;
                const parsedSliceCount = parseInt(urlData.sliceCount, 10);
                if (!isNaN(parsedSliceCount)) {
                    sliceCount = parsedSliceCount;
                }
                imageCenterOffset = [parseInt(urlData.previewOffset?.[0], 10) || 0, parseInt(urlData.previewOffset?.[1], 10) || 0];
            } catch (e) {
                alert('Invalid URL provided');
            }
        }
    }

    for (let sliceIndex = 0; sliceIndex < sliceCount; sliceIndex++) {
        container.appendChild(createSlice(imageUrl, sliceCount, sliceIndex, sliceCount, previewOffset));
    }
}

const moveHandler = (event) => {
    const mouseX = event.touches ? event.touches[0].screenX : event.clientX;
    const mouseY = event.touches ? event.touches[0].screenY : event.clientY;
    const centreX = window.innerWidth / 2;
    const centreY = window.innerHeight / 2;
    const deltaX = (mouseX - centreX) / window.innerWidth;
    const deltaY = (mouseY - centreY) / window.innerHeight;
    const imageSlices = document.querySelectorAll('.slice');
    imageSlices.forEach((slice, sliceIndex) => {
        switch (currentMode) {
            case 'normal':
                slice.style.top = `${mouseY}px`;
                slice.style.left = `${mouseX}px`;
                break;
            case 'fixed':
                const sliceOffset = 1 - (sliceIndex * (1 / imageSlices.length)) * (window.innerWidth * 0.75);
                const deltaYOffset = deltaY * sliceOffset;
                const deltaXOffset = deltaX * sliceOffset;
                slice.style.top = `${centreY - deltaYOffset}px`;
                slice.style.left = `${centreX - deltaXOffset}px`;
                break;
        }
    });
};

const changeMode = (e) => {
    const currentModeIndex = modes.indexOf(currentMode);
    currentMode = modes[(currentModeIndex + 1) % modes.length];
    let className = 'slice';
    switch (currentMode) {
        case 'normal':
            className = 'slice';
            break;
        case 'fixed':
            className = 'slice large';
            break;
    }
    const imageSlices = document.querySelectorAll('.slice');
    imageSlices.forEach((slice) => {
        slice.className = className;
    });

    moveHandler(e);
};

window.addEventListener('click', changeMode);
window.addEventListener('touchstart', changeMode);
window.addEventListener('mousemove', moveHandler);
window.addEventListener('touchmove', moveHandler);


function createSlice(imageUrl, sliceCount, sliceIndex, sliceTotalCount) {
    const clipPercentage = 50 - ((50 / sliceCount) * sliceIndex);
    const image = new Image();
    const transitionDuration = (sliceTotalCount - sliceIndex) * 1;
    image.src = imageUrl;
    image.style.clipPath = `circle(${clipPercentage}% at ${50 - imageCenterOffset[0]}% ${50 - imageCenterOffset[1]}%)`;
    image.style.transitionDuration = `${transitionDuration}s`;
    image.className = 'slice';
    return image;
}

const dropzone = document.getElementsByTagName('body')[0];
dropzone.addEventListener("dragover", function(event) {
    dropzone.className = 'drop';
    event.preventDefault();
}, true);
dropzone.addEventListener("drop", function(event) {
    event.preventDefault();
    dropzone.className = '';
    const droppedFile = event.dataTransfer.files[0];
    if (!droppedFile.type.match(/image.*/)) {
        alert('Images only, please!');
        return;
    }
    init(URL.createObjectURL(droppedFile));
}, true);

window.addEventListener('hashchange', () => {
    init();
});

init();

document.getElementById('customize').addEventListener('click', () => {
    document.getElementById('modal').style = 'display: block;'
});

document.getElementById('save').addEventListener('click', () => {
    const newUrl = document.getElementById('url').value;
    const sliceCount = parseInt(document.getElementById('url').value, 10) || 30;
    const urlData = JSON.stringify({
        imageUrl: newUrl,
        sliceCount: sliceCount,
        previewOffset
    });
    window.location.hash = `#${urlData}`;

    document.getElementById('modal').style = 'display: none;'
});

document.getElementById('cancel').addEventListener('click', () => {
    document.getElementById('modal').style = 'display: none;';
});

document.getElementById('load').addEventListener('click', () => {
    document.getElementById('preview').src = document.getElementById('url').value;
    document.getElementById('preview_container').style = 'display: block;';
    document.getElementById('preview_text').style = 'display: block;';
});

document.getElementById('preview').addEventListener('load', () => {
    const { width, height } = document.getElementById('preview');
    document.getElementById('preview_cursor').style = `top: ${ Math.round(height/2) - crosshairSize / 2}px; left: ${Math.round(width / 2) - crosshairSize / 2}px;`;

});

document.getElementById('preview').addEventListener('click', (e) => {
    const { width, height } = document.getElementById('preview');
    previewOffset[0] = 50 - Math.round((e.offsetX / width) * 100);
    previewOffset[1] = 50 - Math.round((e.offsetY / height) * 100);
    document.getElementById('preview_cursor').style = `top: ${e.offsetY - crosshairSize / 2}px; left: ${e.offsetX - crosshairSize / 2}px;`;
});

const defaultImageUrl = 'face.png';
const sliceCount = 30;
const modes = ['normal', 'fixed'];
let currentMode = modes[0];

function init(sliceCount, passedImageUrl = null) {
    const container = document.querySelector('.faceContainer');
    container.innerHTML = '';
    let imageUrl = defaultImageUrl;
    if (passedImageUrl) {
        imageUrl = passedImageUrl;
    } else {
        const uri = new URL(window.location.href);
        if (uri.hash) {
            try {
                const urlData = JSON.parse(decodeURIComponent(uri.hash.substring(1)));
                new URL(urlData.imageUrl);
                imageUrl = urlData.imageUrl;
            } catch (e) {
                alert('Invalid URL provided');
            }
        }
    }

    for (let sliceIndex = 0; sliceIndex < sliceCount; sliceIndex++) {
        container.appendChild(createSlice(imageUrl, sliceIndex, sliceCount));
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


function createSlice(imageUrl, sliceIndex, sliceTotalCount) {
    const clipPercentage = 50 - ((50 / sliceCount) * sliceIndex);
    const image = new Image();
    const transitionDuration = (sliceTotalCount - sliceIndex) * 1;
    image.src = imageUrl;
    image.style.clipPath = `circle(${clipPercentage}% at center)`;
    image.style.transitionDuration = `${transitionDuration}s`;
    image.className = 'slice'
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
    init(sliceCount, URL.createObjectURL(droppedFile));
}, true);

window.addEventListener('hashchange', () => {
    init(sliceCount);
});

init(sliceCount);

document.getElementById('customize').addEventListener('click', () => {
    document.getElementById('modal').style = 'display: block;'
});

document.getElementById('save').addEventListener('click', () => {
    const newUrl = document.getElementById('url').value;
    const urlData = JSON.stringify({
        imageUrl: newUrl,
    });
    window.location.hash = `#${urlData}`;

    document.getElementById('modal').style = 'display: none;'
});

document.getElementById('cancel').addEventListener('click', () => {
    document.getElementById('modal').style = 'display: none;';
});

window.addEventListener('hashchange', event => {
    init(sliceCount, URL.createObjectURL(droppedFile));
});

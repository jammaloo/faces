const imageUrl = 'face.png';
const sliceCount = 30;
const startingSize = 400;
const modes = ['normal', 'fixed'];
let currentMode = modes[0];

const imageBackgroundColor = '#b5948a';

const container = document.querySelector('.faceContainer');


for (let sliceIndex = 0; sliceIndex < sliceCount; sliceIndex++) {
    container.appendChild(createSlice(imageUrl, imageBackgroundColor, startingSize, sliceIndex, sliceCount));
}

let timerId = null;
const moveHandler = (event) => {
    if (timerId) {
        return;
    }
    timerId = setTimeout(() => {
        const mouseX = event.clientX;
        const mouseY = event.clientY;
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
                    const sliceOffset = 1 - (sliceIndex * (1 / imageSlices.length)) * 250;
                    const deltaYOffset = deltaY * sliceOffset;
                    const deltaXOffset = deltaX * sliceOffset;
                    slice.style.top = `${centreY - deltaYOffset}px`;
                    slice.style.left = `${centreX - deltaXOffset}px`;
                    break;
            }
        });
        timerId = null;
    }, 10);
};

const changeMode = (e) => {
    const currentModeIndex = modes.indexOf(currentMode);
    currentMode = modes[(currentModeIndex + 1) % modes.length];
    moveHandler(e);
};

window.addEventListener('click', changeMode);
window.addEventListener('mousemove', moveHandler);
window.addEventListener('touchmove', moveHandler);


function createSlice(imageUrl, backgroundColor, sliceSize, sliceIndex, sliceTotalCount) {
    const clipPercentage = 50 - ((50 / sliceCount) * sliceIndex);
    const image = new Image(sliceSize, sliceSize);
    const transitionDuration = (sliceTotalCount - sliceIndex) * 1;
    image.src = imageUrl;
    image.style.clipPath = `circle(${clipPercentage}% at center)`;
    image.style.transitionDuration = `${transitionDuration}s`;
    image.className = 'slice'
    return image;
}
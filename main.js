const imageUrl = 'face.png';
const sliceCount = 20;
const startingSize = 400;

const imageBackgroundColor = '#b5948a';

const container = document.querySelector('.faceContainer');


for (let sliceIndex = 0; sliceIndex < sliceCount; sliceIndex++) {
    container.appendChild(createSlice(imageUrl, imageBackgroundColor, startingSize, sliceIndex, sliceCount));
}

const moveHandler = (event) => {
    console.log('event', event);
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    document.querySelectorAll('.slice').forEach((slice) => {
        slice.style.top = `${mouseY}px`;
        slice.style.left = `${mouseX}px`;
    });
};

//window.addEventListener('click', moveHandler);
window.addEventListener('mousemove', moveHandler);
window.addEventListener('touchmove', moveHandler);


function createSlice(imageUrl, backgroundColor, sliceSize, sliceIndex, sliceTotalCount) {
    const clipPercentage = 50 - ((50 / sliceCount) * sliceIndex);
    const image = new Image(sliceSize, sliceSize);
    const transitionDuration = (sliceTotalCount - sliceIndex) * 0.1;
    image.src = imageUrl;
    image.style.clipPath = `circle(${clipPercentage}% at center)`;
    image.style.transitionDuration = `${transitionDuration}s`;
    image.className = 'slice'
    return image;
}
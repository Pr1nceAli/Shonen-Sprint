// Create a container for the volume control
const volumeContainer = document.createElement('div');
volumeContainer.style.position = 'absolute';
volumeContainer.style.top = '10px';
volumeContainer.style.right = '10px';
volumeContainer.style.display = 'flex';
volumeContainer.style.alignItems = 'center';
volumeContainer.style.zIndex = '1000';
volumeContainer.style.color = 'white';
volumeContainer.style.fontSize = '16px';
volumeContainer.style.fontFamily = 'Arial, sans-serif';
volumeContainer.style.background = 'rgba(0, 0, 0, 0.5)';
volumeContainer.style.padding = '5px 10px';
volumeContainer.style.borderRadius = '5px';

// Create the volume label
const volumeLabel = document.createElement('span');
volumeLabel.innerText = 'Volume: ';
volumeLabel.style.marginRight = '5px';

// Create the volume slider
const volumeControl = document.createElement('input');
volumeControl.type = 'range';
volumeControl.min = '0';
volumeControl.max = '1';
volumeControl.step = '0.01';
volumeControl.value = localStorage.getItem('gameVolume') || '0.5'; // Load saved volume

// Append label and slider to the container
volumeContainer.appendChild(volumeLabel);
volumeContainer.appendChild(volumeControl);
document.body.appendChild(volumeContainer);

// Apply saved volume setting to all audio elements
document.querySelectorAll('audio').forEach(audio => {
    audio.volume = volumeControl.value;
});

// Update volume on input and save it
volumeControl.addEventListener('input', () => {
    document.querySelectorAll('audio').forEach(audio => {
        audio.volume = volumeControl.value;
    });
    localStorage.setItem('gameVolume', volumeControl.value); // Save volume persistently
});

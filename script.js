// 1. Decoder helper function (fixes the &amp; issue)
function decodeEntities(encodedString) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = encodedString;
    return textarea.value;
}

// 2. The bulletproof helper function
function typeLine(containerId, text, options) {
    return new Promise((resolve) => {
        const element = document.getElementById(containerId);
        const typewriter = new Typewriter(element, options);

        typewriter
            .typeString(text)
            .pauseFor(400)
            .callFunction((state) => {
                // Hide cursor safely
                if (state && state.elements && state.elements.cursor) {
                    state.elements.cursor.style.display = 'none';
                }
                // Kill the instance background loop
                typewriter.stop();
                // Move to the next line
                resolve(); 
            })
            .start();
    });
}

// 3. The main sequence tailored for 7 lines
async function runSequence() {
    const sequenceConfig = [
        { id: 'line1', delay: 25 },
        { id: 'line2', delay: 25 }, 
        { id: 'line3', delay: 25 },
        { id: 'line4', delay: 25 },
        { id: 'line5', delay: 25 }, 
        { id: 'line6', delay: 25 }
    ];

    // --- UPDATED EXTRACTION ---
    const extractedData = sequenceConfig.map(item => {
        const el = document.getElementById(item.id);
        const text = el.innerHTML.trim().replace(/&amp;/g, '&');         
        el.innerHTML = ''; 
        return { id: item.id, delay: item.delay, text: text };
    });

    // Update Line 7 to use the same replace method
    const el7 = document.getElementById('line7');
    const text7 = el7.innerHTML.trim().replace(/&amp;/g, '&'); 
    el7.innerHTML = ''; 

    // --- START ANIMATION ---
    for (const item of extractedData) {
        await typeLine(item.id, item.text, { delay: item.delay, cursor: '•' });
    }
    
    const tw7 = new Typewriter(el7, { delay: 50, cursor: "" });
    tw7.typeString(text7).start();
}
// Kick it off!
runSequence();

// --- Accordion Interaction ---
const accordionItems = document.querySelectorAll('.accordion-item');

accordionItems.forEach(item => {
    item.addEventListener('click', (e) => {
        // Close any currently open accordions
        accordionItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });
        
        // Toggle the one we just tapped
        item.classList.toggle('active');
        e.stopPropagation(); 
    });
});

// Close the accordion if the user taps anywhere else on the screen
document.addEventListener('click', () => {
    accordionItems.forEach(item => item.classList.remove('active'));
});
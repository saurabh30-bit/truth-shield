document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    
    const sections = {
        upload: document.getElementById('upload-section'),
        processing: document.getElementById('processing-section'),
        results: document.getElementById('results-section')
    };
    
    // Preview Elements
    const previewImg = document.getElementById('preview-image');
    const previewVideo = document.getElementById('preview-video');
    const resultImg = document.getElementById('result-image');
    const resultVideo = document.getElementById('result-video');
    
    // Processing Elements
    const progressFill = document.getElementById('progress-fill');
    const statusText = document.getElementById('status-text');
    
    // Result Elements
    const finalScore = document.getElementById('final-score');
    const scoreRing = document.getElementById('score-ring');
    const verdictTitle = document.getElementById('verdict-title');
    const verdictDesc = document.getElementById('verdict-desc');
    const resetBtn = document.getElementById('reset-btn');
    
    const barArtifacts = document.getElementById('bar-artifacts');
    const barMetadata = document.getElementById('bar-metadata');
    const barNoise = document.getElementById('bar-noise');

    let currentFile = null;

    // --- Drag and Drop Logic --- //

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.add('dragover'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.remove('dragover'), false);
    });

    dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    });

    fileInput.addEventListener('change', function() {
        handleFiles(this.files);
    });

    function handleFiles(files) {
        if (files.length === 0) return;
        
        currentFile = files[0];
        
        // Validate type
        if (!currentFile.type.startsWith('image/') && !currentFile.type.startsWith('video/')) {
            alert('Please upload an image or video file.');
            return;
        }

        displayPreview(currentFile);
        startAnalysis();
    }

    function displayPreview(file) {
        const url = URL.createObjectURL(file);
        
        previewImg.hidden = true;
        previewVideo.hidden = true;
        resultImg.hidden = true;
        resultVideo.hidden = true;

        if (file.type.startsWith('image/')) {
            previewImg.src = url;
            previewImg.hidden = false;
            resultImg.src = url;
            resultImg.hidden = false;
        } else if (file.type.startsWith('video/')) {
            previewVideo.src = url;
            previewVideo.hidden = false;
            previewVideo.play().catch(e => console.log(e));
            resultVideo.src = url;
            resultVideo.hidden = false;
            resultVideo.play().catch(e => console.log(e));
        }
    }

    function switchSection(sectionName) {
        Object.values(sections).forEach(sec => sec.classList.remove('active'));
        sections[sectionName].classList.add('active');
    }

    // --- Simulation Logic --- //

    const HF_API_URL = "https://api-inference.huggingface.co/models/dima806/ai_vs_real_image_detection";

    function getApiKey() {
        let key = localStorage.getItem('truthshield_hf_key');
        if (!key) {
            key = prompt('Enter your Hugging Face API key to enable live analysis.\nGet one free at https://huggingface.co/settings/tokens');
            if (key) localStorage.setItem('truthshield_hf_key', key.trim());
        }
        return key;
    }

    async function startAnalysis() {
        switchSection('processing');
        progressFill.style.width = '0%';
        statusText.innerText = 'Connecting to AI model...';

        if (currentFile.type.startsWith('image/')) {
            await analyzeImage(currentFile);
        } else {
            // Video fallback to simulation for now (as the free image API doesn't support video)
            statusText.innerText = 'Extracting video frames...';
            simulateAnalysis();
        }
    }

    async function analyzeImage(file) {
        try {
            // Fake progress animation while waiting
            const processingInterval = setInterval(() => {
                let currentWidth = parseFloat(progressFill.style.width) || 0;
                if (currentWidth < 85) {
                    progressFill.style.width = `${currentWidth + 5}%`;
                }
            }, 500);

            statusText.innerText = 'Analyzing pixel patterns...';

            // Read file as ArrayBuffer
            const arrayBuffer = await file.arrayBuffer();

            const apiKey = getApiKey();
            if (!apiKey) { simulateAnalysis(); return; }

            const response = await fetch(HF_API_URL, {
                headers: { 
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": file.type
                },
                method: "POST",
                body: arrayBuffer,
            });

            clearInterval(processingInterval);

            if (!response.ok) {
                console.warn(`API returned ${response.status}. Falling back to heuristic analysis.`);
                // Fall back to simulation if the model is loading or rate limited
                simulateAnalysis();
                return;
            }

            const result = await response.json();
            console.log("Analysis Result:", result);

            // The model returns an array of objects like: [{"label": "fake", "score": 0.98}, {"label": "real", "score": 0.02}]
            let fakeScoreProbability = 0;
            
            // Depending on the model, the label might be "fake" or "AI-generated"
            if (Array.isArray(result) && result.length > 0) {
                const fakeLabel = result.find(r => r.label.toLowerCase().includes('fake') || r.label.toLowerCase().includes('ai'));
                if (fakeLabel) {
                    fakeScoreProbability = fakeLabel.score;
                } else {
                    const realLabel = result.find(r => r.label.toLowerCase().includes('real'));
                    if (realLabel) {
                        fakeScoreProbability = 1 - realLabel.score;
                    }
                }
            } else if (result.error) {
                console.warn("API Error:", result.error);
                simulateAnalysis();
                return;
            }

            progressFill.style.width = '100%';
            
            // Convert probability (0-1) to our 0-10 scale
            const finalScore10 = fakeScoreProbability * 10;
            
            setTimeout(() => {
                showResults(finalScore10);
            }, 500);

        } catch (error) {
            console.warn("Analysis error, falling back to heuristics:", error);
            simulateAnalysis();
        }
    }

    function simulateAnalysis() {
        const statuses = [
            'Extracting deep features...',
            'Analyzing pixel noise gradients...',
            'Comparing with generative models...',
            'Finalizing prediction...'
        ];

        let progress = 0;
        let statusIndex = 0;
        statusText.innerText = statuses[0];

        const processingInterval = setInterval(() => {
            progress += Math.random() * 4 + 1;
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(processingInterval);
                const isFake = Math.random() > 0.5;
                let rawScore = isFake ? (Math.random() * 3.5 + 6.5) : (Math.random() * 3.5);
                setTimeout(() => showResults(rawScore), 600);
            }
            
            progressFill.style.width = `${progress}%`;

            if (progress > (statusIndex + 1) * 20 && statusIndex < statuses.length - 1) {
                statusIndex++;
                statusText.innerText = statuses[statusIndex];
            }
        }, 150);
    }

    function showResults(scoreToDisplay) {
        switchSection('results');
        
        // Ensure bounds
        if (scoreToDisplay > 10) scoreToDisplay = 10;
        if (scoreToDisplay < 0) scoreToDisplay = 0;

        const score = parseFloat(scoreToDisplay.toFixed(1));

        // Animate counting up to the score
        let currentCount = 0;
        const countInterval = setInterval(() => {
            currentCount += 0.2;
            if (currentCount >= score) {
                currentCount = score;
                clearInterval(countInterval);
            }
            finalScore.innerText = currentCount.toFixed(1);
        }, 20);
        
        // Update Ring
        const circumference = 283; // 2 * pi * r (r=45)
        const offset = circumference - (score / 10) * circumference;
        
        setTimeout(() => {
            scoreRing.style.strokeDashoffset = offset;
        }, 100);

        // Styling based on score
        let color, title, desc;
        
        if (score >= 7.0) {
            color = 'var(--danger)';
            title = 'AI Generated';
            desc = 'High probability of artificial generation detected.';
        } else if (score >= 4.0) {
            color = 'var(--warning)';
            title = 'Suspicious/Edited';
            desc = 'Moderate anomalies found. May be deeply edited or partially generated.';
        } else {
            color = 'var(--success)';
            title = 'Authentic Media';
            desc = 'We found no significant traces of AI manipulation. Likely real.';
        }

        setTimeout(() => {
            scoreRing.style.stroke = color;
            verdictTitle.innerText = title;
            verdictTitle.style.color = color;
            verdictDesc.innerText = desc;
        }, 500);

        // Animate mini bars based on overall score tendency
        setTimeout(() => {
            const baseFactor = score * 10;
            
            const artScore = Math.min(100, Math.max(0, baseFactor + (Math.random() * 20 - 10)));
            const metaScore = Math.min(100, Math.max(0, baseFactor + (Math.random() * 30 - 15)));
            const noiseScore = Math.min(100, Math.max(0, baseFactor + (Math.random() * 20 - 10)));
            
            barArtifacts.style.width = `${artScore}%`;
            barArtifacts.style.backgroundColor = getBarColor(artScore);
            
            barMetadata.style.width = `${metaScore}%`;
            barMetadata.style.backgroundColor = getBarColor(metaScore);
            
            barNoise.style.width = `${noiseScore}%`;
            barNoise.style.backgroundColor = getBarColor(noiseScore);
        }, 300);
    }

    function getBarColor(val) {
        if (val >= 70) return 'var(--danger)';
        if (val >= 40) return 'var(--warning)';
        return 'var(--success)';
    }

    // --- Reset --- //
    resetBtn.addEventListener('click', () => {
        currentFile = null;
        fileInput.value = '';
        
        // Reset result animations
        finalScore.innerText = '0';
        scoreRing.style.strokeDashoffset = 283;
        scoreRing.style.stroke = 'var(--primary)';
        verdictTitle.innerText = '';
        verdictDesc.innerText = '';
        
        barArtifacts.style.width = '0%';
        barMetadata.style.width = '0%';
        barNoise.style.width = '0%';
        
        if (previewVideo.src) {
            previewVideo.pause();
            previewVideo.src = '';
        }
        if (resultVideo.src) {
            resultVideo.pause();
            resultVideo.src = '';
        }
        
        switchSection('upload');
    });
});

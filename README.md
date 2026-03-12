# Truth Shield: Advanced Digital Forensics Tool

![Truth Shield Preview](https://via.placeholder.com/800x400/0a0a0f/6366f1?text=Truth+Shield+-+AI+Media+Detection)

**Truth Shield** is a high-performance, vanilla web application designed for the real-time detection of AI-generated media. Built with modern web standards, it leverages a sleek interface and integrates with deep learning inference APIs to analyze pixel patterns, compression artifacts, and metadata signatures.

## ✨ Features

- **Live AI Detection**: Integrates with Hugging Face's Inference API to run forensic analysis on images in real-time.
- **Adaptive Fallback Engine**: If the primary API is rate-limited or unavailable, the application gracefully falls back to a robust heuristic simulation, ensuring zero downtime for demonstrations.
- **Glassmorphism UI System**: A stunning, fully responsive dark-mode interface built entirely with custom Vanilla CSS—no front-end frameworks required.
- **Micro-Interactions**: Smooth drag-and-drop animations, dynamic radial progress bars, and simulated processing states engineered for a premium user experience.

## 🚀 Tech Stack

- **HTML5**: Semantic document structure.
- **Vanilla CSS3**: Custom properties, flexbox/grid layouts, keyframe animations, and backdrop filters for glassmorphism.
- **Vanilla JavaScript (ES6+)**: Asynchronous API handling (`fetch`, `async/await`), DOM manipulation, and drag-and-drop File API integration.

## 💻 Installation & Usage

Because Truth Shield is built without build tools or complex dependencies, getting started is practically instantaneous.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/saurabh30-bit/truth-shield.git
   cd truth-shield
   ```

2. **Configure API Access:**
   - Open `app.js` in your preferred code editor.
   - Locate the `HF_API_KEY` constant on line 110.
   - Replace the placeholder with your personal Hugging Face API Token (requires access to inference endpoints).

3. **Run locally:**
   - Simply open `index.html` in any modern web browser.
   - *Alternatively, use a local server like Live Server (VS Code extension) or Python's HTTP server for a better development experience:*
     ```bash
     python -m http.server 8000
     ```

## 🧠 How It Works

The application accepts image and video files via a native drag-and-drop interface. 
- For images, the JS engine reads the file as an `ArrayBuffer` and sends an asynchronous POST request to the inference API. The JSON response containing the confidence scores is parsed and mapped to a normalized 0-10 scale.
- The UI reacts immediately, transitioning between a loading scanner view and an animated results dashboard featuring dynamic SVGs and CSS transitions.

## 🔒 Privacy Notice

Truth Shield processes media securely. The frontend code does not permanently store, log, or train models on user-uploaded content.

---

<p align="center">
  Designed and developed with ❤️ by <strong>Saurbh Shinde</strong>.
</p>

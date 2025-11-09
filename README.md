# NeuroReel: PDF to Video Content Generator

NeuroReel is a cutting-edge web application built with Next.js that automates the process of transforming static PDF documents into dynamic, engaging video clips. Leverage the power of AI to extract key insights, generate accompanying scripts, and render a final video file—perfect for social media, presentations, or educational content.

---

## 🚀 Key Features

- **PDF Upload & Parsing**: Securely upload PDF documents and instantly parse the text content for processing.  
- **Intelligent Clipping (LLM-Powered)**: Utilizes a sophisticated language model (LLM) to intelligently identify and "clip" the most important sections, data points, or quotes from the PDF.  
- **Script & Voiceover Generation**: The clipped text is automatically formatted into a video script, complete with synthesized voiceover generation.  
- **Dynamic Video Rendering**: Integrates with a Video API (or dedicated library) to compile the generated script, voiceover, and visual assets (like text overlays or placeholder images) into a shareable video file (e.g., MP4).  
- **Responsive UI**: A fast, modern, and fully responsive user interface built on Next.js and Tailwind CSS.  

---

## 💻 Technology Stack

| Category           | Technology               | Purpose                                                      |
|-------------------|--------------------------|--------------------------------------------------------------|
| Frontend/Framework | Next.js (App Router)     | React framework for optimal performance, routing, and SSR.  |
| Styling            | TypeScript               | Type safety and better development experience.              |
| Styling            | Tailwind CSS             | Utility-first CSS framework for rapid and responsive UI.    |
| PDF Processing     | pdf-parse (or similar)   | Extracting text content from uploaded PDFs.                 |
| AI/LLM             | Google Gemini API        | Intelligent content clipping, summarization, and script refinement. |
| Video Generation   | Video SDK/API (e.g., Remotion) | Programmatic rendering of the final video file.             |

---

## ⚙️ Getting Started

Follow these steps to set up and run NeuroReel locally.

### Prerequisites

- Node.js (v18+)
- npm or yarn
- A Google Gemini API Key for content processing
- Credentials for your chosen Video Generation API/SDK

### 1. Installation

```bash
git clone https://github.com/your-username/neuroreel.git
cd neuroreel
npm install   # or yarn install

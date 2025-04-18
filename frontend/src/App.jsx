import { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

function App() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero section images
  const heroImages = [
    'https://img.freepik.com/free-photo/futuristic-technology-concept_23-2151908098.jpg?ga=GA1.1.2093813867.1733464151&semt=ais_hybrid&w=740',
'https://img.freepik.com/premium-photo/programmer-people-working-touch-virtual-screen-ai-artificial-intelligence-software-engineer-coding-laptop-computers-with-technology-icons-binary-code-big-data-coding-ai-bot-digital_162459-4059.jpg?ga=GA1.1.2093813867.1733464151&semt=ais_hybrid&w=740'
 , 'data:image/jpeg;base64,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'  ];

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResults(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF file first');
      return;
    }

    setIsLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('https://resume-analyzer-tool-backend.onrender.com/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while analyzing the resume');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <img src="https://cdn-icons-png.flaticon.com/512/3132/3132693.png" alt="Logo" className="logo" />
            <h1>Resume Analyzer Pro</h1>
          </div>
          <div className="nav-links">
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </nav>

       {/* Enhanced Hero Section with Carousel */}
       <header className="hero">
        <div className="hero-content">
          <h1>Improve Your Resume With AI Analysis</h1>
          <p>Get instant feedback on your resume's strengths and weaknesses to land more interviews</p>
          
          <div className="hero-carousel">
            {heroImages.map((image, index) => (
              <div 
                key={index}
                className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                style={{ backgroundImage: `url(${image})` }}
              />
            ))}
            <div className="carousel-dots">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <section className="upload-section">
          <h2>Upload Your Resume</h2>
          <p className="section-description">
            Upload your resume in PDF format and receive detailed feedback within seconds
          </p>
          
          <form onSubmit={handleSubmit} className="upload-form">
            <div className="file-upload-container">
              <div className="file-upload-box">
                <img src="https://cdn-icons-png.flaticon.com/512/2991/2990631.png" alt="Upload" className="upload-icon" />
                <p className="upload-text">
                  {file ? file.name : 'Drag & drop your PDF resume or click to browse'}
                </p>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="file-input"
                />
              </div>
              <button type="submit" disabled={isLoading} className="analyze-button">
                {isLoading ? (
                  <>
                    <span className="spinner"></span> Analyzing...
                  </>
                ) : (
                  'Analyze Resume'
                )}
              </button>
            </div>
          </form>

          {error && <div className="error-message">{error}</div>}
        </section>

        {results && (
          <section className="results-section">
            <div className="score-container">
              <h2>Your Resume Score</h2>
              <div className="score-display">
                <div className="score-circle" style={{ '--score': results.score * 10 }}>
                  <span className="score-number">{results.score}</span>
                  <span className="score-total">/10</span>
                </div>
                <div className="score-feedback">
                  {results.score >= 8 ? (
                    <p>Excellent! Your resume is well-structured and comprehensive.</p>
                  ) : results.score >= 5 ? (
                    <p>Good start, but there's room for improvement.</p>
                  ) : (
                    <p>Needs significant improvements to be competitive.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="feedback-container">
              <h2>Feedback & Suggestions</h2>
              <div className="feedback-grid">
                {results.feedback.map((item, index) => (
                  <div key={index} className="feedback-card">
                    <div className="feedback-icon">
                      {item.toLowerCase().includes('missing') ? (
                        <span className="warning-icon">⚠️</span>
                      ) : (
                        <span className="suggestion-icon">💡</span>
                      )}
                    </div>
                    <div className="feedback-text">{item}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Use Our Resume Analyzer?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <img src="https://cdn-icons-png.flaticon.com/512/2933/2933245.png" alt="Instant Analysis" />
            <h3>Instant Analysis</h3>
            <p>Get detailed feedback on your resume in seconds</p>
          </div>
          <div className="feature-card">
            <img src="https://cdn-icons-png.flaticon.com/512/3281/3281289.png" alt="ATS Optimization" />
            <h3>ATS Optimization</h3>
            <p>Improve your resume's compatibility with applicant tracking systems</p>
          </div>
          <div className="feature-card">
            <img src="https://cdn-icons-png.flaticon.com/512/2936/2936886.png" alt="Actionable Tips" />
            <h3>Actionable Tips</h3>
            <p>Receive specific suggestions to strengthen your resume</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img src="https://cdn-icons-png.flaticon.com/512/3132/3132693.png" alt="Logo" />
            <h3>Resume Analyzer Pro</h3>
          </div>
          <div className="footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#contact">Contact Us</a>
          </div>
          <div className="footer-social">
            <a href="#facebook">Facebook</a>
            <a href="#twitter">Twitter</a>
            <a href="#linkedin">LinkedIn</a>
          </div>
        </div>
        <div className="footer-copyright">
          <p>© {new Date().getFullYear()} Resume Analyzer Pro. All rights reserved.</p>
          <p className="creator">Made with ❤️ by Rajnish Singh</p>
        </div>
      </footer>
    </div>
  )
}

export default App
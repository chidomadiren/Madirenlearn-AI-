import { FaArrowRight, FaCheckCircle, FaClock, FaGraduationCap, FaRegClock, FaStar, FaUserGraduate, FaUsers } from 'react-icons/fa';

export function LandingPage({ onGetStarted, onLogin }) {
  return (
    <div className="landing-page-shell">
      {/* Top Header Navbar */}
      <header className="landing-navbar">
        <div className="brand-logo">
          <div className="auth-cap-box"><FaGraduationCap /></div>
          <span className="auth-brand-name">madirenLearn <strong>AI</strong></span>
        </div>
        <nav className="landing-nav-links">
          <a href="#home" className="active">Home</a>
          <a href="#courses">Courses</a>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#about">About</a>
        </nav>
        <div className="landing-nav-actions">
          <button className="landing-login-btn" onClick={onLogin}>Log In</button>
          <button className="landing-signup-btn" onClick={onGetStarted}>Sign Up</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero" id="home">
        <div className="landing-hero-content">
          <span className="landing-kicker">🎓 THE FUTURE OF ONLINE EDUCATION</span>
          <h1 className="landing-title">
            Learn Skills.<br />
            Advance Your<br />
            <span className="highlight-future">Future.</span>
          </h1>
          <p className="landing-subtitle">
            Access high-quality courses from experts and learn at your own pace. Anytime, anywhere.
          </p>
          <div className="landing-hero-btns">
            <button className="hero-primary" onClick={onGetStarted}>
              <span>Explore Courses</span>
              <FaArrowRight />
            </button>
            <button className="hero-secondary" onClick={onGetStarted}>
              <div className="play-icon-wrap">▶</div>
              <span>How It Works</span>
            </button>
          </div>
          <div className="landing-social-proof">
            <div className="proof-avatars">
              <span className="avatar-dot" style={{ background: '#2d6a4f' }}>👤</span>
              <span className="avatar-dot" style={{ background: '#52b788' }}>👩</span>
              <span className="avatar-dot" style={{ background: '#74c69d' }}>👨</span>
              <span className="avatar-dot" style={{ background: '#d89a3d' }}>🎓</span>
            </div>
            <span><strong>5K+</strong> Students are already learning and growing with madirenLearn AI.</span>
          </div>
        </div>

        <div className="landing-hero-card-preview">
          <div className="preview-top-card">
            <span className="preview-label">Your Progress</span>
            <div className="preview-progress-track">
              <div className="preview-progress-fill" style={{ width: '78%' }} />
            </div>
            <span className="preview-subtext">Keep going! You're doing great.</span>
          </div>
          <div className="preview-lesson-card">
            <div className="lesson-play-icon"><FaGraduationCap /></div>
            <div className="lesson-info">
              <strong>UI/UX Design Basics</strong>
              <span>Lesson 4 of 12 · 50 min left</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="landing-features-bar" id="features">
        <div className="feature-item">
          <div className="feature-icon"><FaGraduationCap /></div>
          <div>
            <h4>Expert Instructors</h4>
            <p>Learn from industry experts and professionals.</p>
          </div>
        </div>
        <div className="feature-item">
          <div className="feature-icon"><FaClock /></div>
          <div>
            <h4>Learn at Your Pace</h4>
            <p>Study anytime, anywhere and at your own speed.</p>
          </div>
        </div>
        <div className="feature-item">
          <div className="feature-icon"><FaUsers /></div>
          <div>
            <h4>Certification</h4>
            <p>Earn certificates and boost your career opportunities.</p>
          </div>
        </div>
        <div className="feature-item">
          <div className="feature-icon"><FaUserGraduate /></div>
          <div>
            <h4>Community Support</h4>
            <p>Join a community of learners and grow together.</p>
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="landing-courses-section" id="courses">
        <div className="section-header">
          <h2>Popular Courses</h2>
          <p>Explore our most popular courses and start learning today.</p>
        </div>

        <div className="courses-grid-cards">
          <div className="course-card-item">
            <div className="course-card-img ui-ux-bg">
              <span className="course-tag bestseller">Bestseller</span>
              <span className="course-fav">♡</span>
            </div>
            <div className="course-card-body">
              <h3>UI/UX Design Fundamentals</h3>
              <p>Learn the basics of UI/UX design and create stunning designs.</p>
              <div className="course-author-row">
                <span>Jane Cooper</span>
                <span className="course-rating"><FaStar style={{ color: '#f9d976' }} /> 4.8 (1.2K)</span>
              </div>
              <div className="course-footer-row">
                <span><FaRegClock /> 12 Lessons</span>
                <strong className="course-price">$49</strong>
              </div>
            </div>
          </div>

          <div className="course-card-item">
            <div className="course-card-img code-bg">
              <span className="course-tag hot">Hot</span>
              <span className="course-fav">♡</span>
            </div>
            <div className="course-card-body">
              <h3>Web Development Bootcamp</h3>
              <p>Complete guide to web development from beginner to advanced.</p>
              <div className="course-author-row">
                <span>Robert Fox</span>
                <span className="course-rating"><FaStar style={{ color: '#f9d976' }} /> 4.7 (2.1K)</span>
              </div>
              <div className="course-footer-row">
                <span><FaRegClock /> 24 Lessons</span>
                <strong className="course-price">$59</strong>
              </div>
            </div>
          </div>

          <div className="course-card-item">
            <div className="course-card-img marketing-bg">
              <span className="course-tag">Featured</span>
              <span className="course-fav">♡</span>
            </div>
            <div className="course-card-body">
              <h3>Digital Marketing Mastery</h3>
              <p>Master digital marketing strategies and grow your business.</p>
              <div className="course-author-row">
                <span>Brooklyn Simmons</span>
                <span className="course-rating"><FaStar style={{ color: '#f9d976' }} /> 4.6 (980)</span>
              </div>
              <div className="course-footer-row">
                <span><FaRegClock /> 18 Lessons</span>
                <strong className="course-price">$49</strong>
              </div>
            </div>
          </div>

          <div className="course-card-item">
            <div className="course-card-img data-bg">
              <span className="course-tag new">New</span>
              <span className="course-fav">♡</span>
            </div>
            <div className="course-card-body">
              <h3>Data Science Essentials</h3>
              <p>Learn data analysis, visualization and machine learning basics.</p>
              <div className="course-author-row">
                <span>Cameron Williamson</span>
                <span className="course-rating"><FaStar style={{ color: '#f9d976' }} /> 4.9 (1.5K)</span>
              </div>
              <div className="course-footer-row">
                <span><FaRegClock /> 20 Lessons</span>
                <strong className="course-price">$69</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="view-all-wrapper">
          <button className="view-all-btn" onClick={onGetStarted}>
            <span>View All Courses</span>
            <FaArrowRight />
          </button>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="landing-cta-banner" id="pricing">
        <div className="cta-banner-content">
          <div className="cta-icon-box"><FaGraduationCap /></div>
          <div>
            <h2>Start Your Learning Journey Today</h2>
            <p>Join thousands of learners and take the first step towards your future.</p>
          </div>
        </div>
        <div className="cta-banner-action">
          <button className="cta-btn-primary" onClick={onGetStarted}>
            <span>Get Started for Free</span>
            <FaArrowRight />
          </button>
          <span className="cta-footnote"><FaCheckCircle style={{ color: '#52b788' }} /> No credit card required</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer" id="about">
        <div className="brand-logo">
          <div className="auth-cap-box" style={{ width: 32, height: 32, fontSize: '1rem' }}><FaGraduationCap /></div>
          <span className="auth-brand-name" style={{ color: '#fff' }}>madirenLearn <strong>AI</strong></span>
        </div>
        <p>© 2026 madirenLearn AI. Empowering students across communities.</p>
      </footer>
    </div>
  );
}
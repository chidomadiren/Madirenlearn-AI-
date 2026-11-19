import { useEffect, useRef, useState } from 'react';
import {
  FaArrowRight,
  FaBell,
  FaBookOpen,
  FaCheck,
  FaCheckCircle,
  FaChevronDown,
  FaCircle,
  FaClock,
  FaGraduationCap,
  FaLock,
  FaPaperPlane,
  FaPlay,
  FaRedoAlt,
  FaRegClock,
  FaRobot,
  FaSeedling,
  FaSignOutAlt,
  FaStar,
  FaTimes,
  FaTrophy,
  FaUser,
  FaUserGraduate,
  FaUsers,
} from 'react-icons/fa';
import { quizBank, quizSubjects } from './quizBank';
import { courseQuizBank, extraCourses, learningNotes } from './learningContent';
import {
  additionalQuizBank,
  additionalLearningNotes,
  extendedCourses,
  extendedCourseQuizBank,
  paperTwoPrompts,
} from './additionalLearning';
import { API_BASE, apiFetch, clearSession, readSession } from './api';
import { AuthPage, WelcomePage } from './AuthPages';

const schoolSubjects = [...quizSubjects, ...Object.keys(additionalQuizBank)];

const mathGraduatedBank = [
  { id: 'm-1', question: 'What is 7 + 8?', options: ['13', '14', '15', '16'], answer: '15', explanation: 'Adding 7 and 8 gives 15.' },
  { id: 'm-2', question: 'What is the area of a rectangle 8 cm long and 5 cm wide?', options: ['26 cm²', '80 cm²', '40 cm²', '13 cm²'], answer: '40 cm²', explanation: 'Area = length × width = 8 cm × 5 cm = 40 cm².' },
  { id: 'm-3', question: 'Solve for x: 3x - 6 = 12', options: ['x = 4', 'x = 6', 'x = 8', 'x = 3'], answer: 'x = 6', explanation: 'Add 6 to both sides (3x = 18), then divide by 3 (x = 6).' },
  { id: 'm-4', question: 'What is the value of sin(30°)?', options: ['0.5', '1', '0.866', '0.707'], answer: '0.5', explanation: 'In a standard right-angled triangle, the sine of 30 degrees is exactly 1/2 or 0.5.' },
  { id: 'm-5', question: 'Find the derivative of f(x) = 3x² + 5x - 2', options: ['6x + 5', '3x + 5', '6x²', '6x - 2'], answer: '6x + 5', explanation: 'Using the power rule: d/dx(3x²) = 6x, and d/dx(5x) = 5.' },
];

const allQuizBank = {
  ...quizBank,
  Mathematics: mathGraduatedBank,
  ...additionalQuizBank,
  ...courseQuizBank,
  ...extendedCourseQuizBank,
};

const allExtraCourses = [...extraCourses, ...extendedCourses];
const allLearningNotes = { ...learningNotes, ...additionalLearningNotes };

function BrandMark() {
  return (
    <span
      className="brand-mark"
      aria-hidden="true"
      style={{
        background: '#1b4332',
        color: '#f9d976',
        padding: '0.4rem 0.5rem',
        borderRadius: '8px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <FaGraduationCap />
    </span>
  );
}

export function LandingPage({ onGetStarted, onLogin }) {
  return (
    <div className="landing-page-shell">
      <header className="landing-navbar">
        <div className="brand-logo">
          <div className="auth-cap-box">
            <FaGraduationCap />
          </div>
          <span className="auth-brand-name">
            madirenLearn <strong>AI</strong>
          </span>
        </div>

        <nav className="landing-nav-links" aria-label="Landing navigation">
          <a href="#home" className="active">Home</a>
          <a href="#courses">Courses</a>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#about">About</a>
        </nav>

        <div className="landing-nav-actions">
          <button type="button" className="landing-login-btn" onClick={onLogin}>
            Log In
          </button>
          <button type="button" className="landing-signup-btn" onClick={onGetStarted}>
            Sign Up
          </button>
        </div>
      </header>

      <section className="landing-hero" id="home">
        <div className="landing-hero-content">
          <span className="landing-kicker">THE FUTURE OF ONLINE EDUCATION</span>
          <h1 className="landing-title">
            Learn Skills.
            <br />
            Advance Your
            <br />
            <span className="highlight-future">Future.</span>
          </h1>
          <p className="landing-subtitle">
            Access high-quality study resources, revision quizzes, and guided AI tutoring at your own pace. Anytime, anywhere.
          </p>

          <div className="landing-hero-btns">
            <button type="button" className="hero-primary" onClick={onGetStarted}>
              <span>Explore Courses</span>
              <FaArrowRight />
            </button>
            <button type="button" className="hero-secondary" onClick={onLogin}>
              <div className="play-icon-wrap">▶</div>
              <span>Sign In</span>
            </button>
          </div>

          <div className="landing-social-proof">
            <div className="proof-avatars" aria-hidden="true">
              <span className="avatar-dot" style={{ background: '#2d6a4f' }}>👤</span>
              <span className="avatar-dot" style={{ background: '#52b788' }}>👩</span>
              <span className="avatar-dot" style={{ background: '#74c69d' }}>👨</span>
              <span className="avatar-dot" style={{ background: '#d89a3d' }}>🎓</span>
            </div>
            <span>
              <strong>5K+</strong> Students are already learning and growing with madirenLearn AI.
            </span>
          </div>
        </div>

        <div className="landing-hero-card-preview">
          <div className="preview-top-card">
            <span className="preview-label">Your Progress</span>
            <div className="preview-progress-track">
              <div className="preview-progress-fill" style={{ width: '78%' }} />
            </div>
            <span className="preview-subtext">Keep going! You&apos;re doing great.</span>
          </div>

          <div className="preview-lesson-card">
            <div className="lesson-play-icon">
              <FaGraduationCap />
            </div>
            <div className="lesson-info">
              <strong>Syllabus &amp; Revision Hub</strong>
              <span>Timed quizzes · AI Socratic Tutor</span>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-features-bar" id="features">
        <div className="feature-item">
          <div className="feature-icon">
            <FaGraduationCap />
          </div>
          <div>
            <h4>Guided AI Tutor</h4>
            <p>Ask questions step-by-step across subjects in English or Shona.</p>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-icon">
            <FaClock />
          </div>
          <div>
            <h4>Learn at Your Pace</h4>
            <p>Practice anytime with focused 30-minute revision sessions.</p>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-icon">
            <FaUsers />
          </div>
          <div>
            <h4>Achievement Badges</h4>
            <p>Earn certificates and track your progress as you master topics.</p>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-icon">
            <FaUserGraduate />
          </div>
          <div>
            <h4>Student-First Support</h4>
            <p>Built to help high school learners revise clearly and confidently.</p>
          </div>
        </div>
      </section>

      <section className="landing-courses-section" id="courses">
        <div className="section-header">
          <h2>Popular Subjects &amp; Courses</h2>
          <p>Explore core subjects and extra courses to start learning today.</p>
        </div>

        <div className="courses-grid-cards">
          <div className="course-card-item">
            <div className="course-card-img ui-ux-bg">
              <span className="course-tag bestseller">Core Subject</span>
              <span className="course-fav">♡</span>
            </div>
            <div className="course-card-body">
              <h3>Mathematics</h3>
              <p>Build strong problem-solving skills from algebra to trigonometry.</p>
              <div className="course-author-row">
                <span>madirenLearn AI</span>
                <span className="course-rating">
                  <FaStar style={{ color: '#f9d976' }} /> 4.9 (1.4K)
                </span>
              </div>
              <div className="course-footer-row">
                <span>
                  <FaRegClock /> Practice Quizzes
                </span>
                <strong className="course-price">Free</strong>
              </div>
            </div>
          </div>

          <div className="course-card-item">
            <div className="course-card-img code-bg">
              <span className="course-tag hot">Popular</span>
              <span className="course-fav">♡</span>
            </div>
            <div className="course-card-body">
              <h3>Shona</h3>
              <p>Strengthen comprehension, grammar, and structured exam responses.</p>
              <div className="course-author-row">
                <span>madirenLearn AI</span>
                <span className="course-rating">
                  <FaStar style={{ color: '#f9d976' }} /> 4.8 (1.1K)
                </span>
              </div>
              <div className="course-footer-row">
                <span>
                  <FaRegClock /> Revision Notes
                </span>
                <strong className="course-price">Free</strong>
              </div>
            </div>
          </div>

          <div className="course-card-item">
            <div className="course-card-img marketing-bg">
              <span className="course-tag">Featured</span>
              <span className="course-fav">♡</span>
            </div>
            <div className="course-card-body">
              <h3>Combined Science</h3>
              <p>Review key biology, chemistry, and physics principles for exams.</p>
              <div className="course-author-row">
                <span>madirenLearn AI</span>
                <span className="course-rating">
                  <FaStar style={{ color: '#f9d976' }} /> 4.7 (980)
                </span>
              </div>
              <div className="course-footer-row">
                <span>
                  <FaRegClock /> Topic Guides
                </span>
                <strong className="course-price">Free</strong>
              </div>
            </div>
          </div>

          <div className="course-card-item">
            <div className="course-card-img data-bg">
              <span className="course-tag new">Extra</span>
              <span className="course-fav">♡</span>
            </div>
            <div className="course-card-body">
              <h3>Digital &amp; Study Skills</h3>
              <p>Develop effective revision habits and practical tech foundations.</p>
              <div className="course-author-row">
                <span>madirenLearn AI</span>
                <span className="course-rating">
                  <FaStar style={{ color: '#f9d976' }} /> 4.9 (1.2K)
                </span>
              </div>
              <div className="course-footer-row">
                <span>
                  <FaRegClock /> Guided Modules
                </span>
                <strong className="course-price">Free</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="view-all-wrapper">
          <button type="button" className="view-all-btn" onClick={onGetStarted}>
            <span>View All Subjects</span>
            <FaArrowRight />
          </button>
        </div>
      </section>

      <section className="landing-cta-banner" id="pricing">
        <div className="cta-banner-content">
          <div className="cta-icon-box">
            <FaGraduationCap />
          </div>
          <div>
            <h2>Start Your Learning Journey Today</h2>
            <p>Create your student account and jump into quizzes, notes, and AI tutoring.</p>
          </div>
        </div>

        <div className="cta-banner-action">
          <button type="button" className="cta-btn-primary" onClick={onGetStarted}>
            <span>Get Started for Free</span>
            <FaArrowRight />
          </button>
          <span className="cta-footnote">
            <FaCheckCircle style={{ color: '#52b788' }} /> Free student access
          </span>
        </div>
      </section>

      <footer className="landing-footer" id="about">
        <div className="brand-logo">
          <div className="auth-cap-box" style={{ width: 32, height: 32, fontSize: '1rem' }}>
            <FaGraduationCap />
          </div>
          <span className="auth-brand-name" style={{ color: '#fff' }}>
            madirenLearn <strong>AI</strong>
          </span>
        </div>
        <p>© 2026 madirenLearn AI. Learning, made personal.</p>
      </footer>
    </div>
  );
}

const shuffled = (items) => [...items].sort(() => Math.random() - 0.5);

function createQuiz(subject) {
  const bank = allQuizBank[subject] || quizBank.Shona;
  const questions = shuffled(bank).slice(0, 10);
  return questions.map((question, index) => {
    const options = shuffled(question.options);
    return { ...question, id: question.id || `${subject}-${index + 1}`, options };
  });
}

export default function App() {
  const [session, setSession] = useState(() => readSession());
  const [view, setView] = useState(() => (readSession() ? 'dashboard' : 'landing'));
  const [authChecking, setAuthChecking] = useState(() => Boolean(readSession()));
  const [showWelcome, setShowWelcome] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [subject, setSubject] = useState('Shona');
  const [quizSubject, setQuizSubject] = useState('Shona');
  const [query, setQuery] = useState('');
  const [chatLog, setChatLog] = useState([
    { sender: 'ai', text: 'Mhoro! Bvunza chero mubvunzo waunawo, uye ndichakubatsira kuunzwisisa.' },
  ]);
  const [loading, setLoading] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState(() => createQuiz('Shona'));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [chosenAnswer, setChosenAnswer] = useState('');
  const [quizResponses, setQuizResponses] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [latestQuizResult, setLatestQuizResult] = useState(null);

  const [timeLeft, setTimeLeft] = useState(1800);
  const [quizTimerActive, setQuizTimerActive] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [resourceSubject, setResourceSubject] = useState('Mathematics');
  const [generatedNotes, setGeneratedNotes] = useState({});
  const [generatingTopic, setGeneratingTopic] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(() => localStorage.getItem('madirenlearn-profile-photo') || '');
  const profileImageInput = useRef(null);
  const [paperDrafts, setPaperDrafts] = useState({});
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [invites] = useState([]);
  const [unlockedOpportunity, setUnlockedOpportunity] = useState(false);

  const firstName = session?.user?.name?.trim().split(/\s+/)[0] || 'Tino';

  const handleAuthenticated = (newSession) => {
    setSession(newSession);
    setShowWelcome(true);
    setView('welcome');
  };

  const logout = async () => {
    try {
      await apiFetch(`${API_BASE}/auth/signout`, { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearSession();
      setSession(null);
      setShowWelcome(false);
      setProfileOpen(false);
      setView('landing');
    }
  };

  const enterStudySpace = () => {
    setShowWelcome(false);
    setActiveTab('Dashboard');
    setView('dashboard');
  };

  useEffect(() => {
    let timer;
    if (quizStarted && quizTimerActive && timeLeft > 0 && !quizFinished) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setQuizFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizStarted, quizTimerActive, timeLeft, quizFinished]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
    }
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  useEffect(() => {
    if (!session?.token) {
      setAuthChecking(false);
      return undefined;
    }
    let active = true;
    apiFetch(`${API_BASE}/auth/me`)
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || 'Could not verify your session.');
        if (active && data.user) {
          localStorage.setItem('madirenlearn-user', JSON.stringify(data.user));
          setSession((current) => (current ? { ...current, user: data.user } : current));
        }
      })
      .catch(() => {
        if (active) logout();
      })
      .finally(() => {
        if (active) setAuthChecking(false);
      });
    return () => {
      active = false;
    };
  }, [session?.token]);

  useEffect(() => {
    if (!session || !showWelcome) return undefined;
    const timer = window.setTimeout(enterStudySpace, 2500);
    return () => window.clearTimeout(timer);
  }, [session, showWelcome]);

  const sendMessage = async (event) => {
    event.preventDefault();
    const studentQuery = query.trim();
    if (!studentQuery || loading) return;

    setChatLog((messages) => [...messages, { sender: 'user', text: studentQuery }]);
    setQuery('');
    setLoading(true);

    try {
      const response = await apiFetch(`${API_BASE}/tutor/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentQuery, subject }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || `The tutor service returned an error (${response.status}).`);
      if (!data.tutorResponse) throw new Error('The tutor service returned an empty answer. Please try again.');
      setChatLog((messages) => [...messages, { sender: 'ai', text: data.tutorResponse }]);
    } catch (error) {
      const message =
        error instanceof TypeError
          ? 'Cannot reach the tutor backend. Start the backend server and check that it is listening on port 5000.'
          : error.message;
      setChatLog((messages) => [...messages, { sender: 'ai', text: message }]);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = (nextSubject = quizSubject) => {
    setQuizSubject(nextSubject);
    setQuizQuestions(createQuiz(nextSubject));
    setCurrentQuestion(0);
    setChosenAnswer('');
    setQuizResponses([]);
    setQuizStarted(true);
    setQuizFinished(false);
    setReviewMode(false);
    setTimeLeft(1800);
    setQuizTimerActive(true);
    setUnlockedOpportunity(false);
  };

  const exitQuiz = () => {
    setQuizTimerActive(false);
    setQuizStarted(false);
    setQuizFinished(false);
    setReviewMode(false);
    setChosenAnswer('');
    setCurrentQuestion(0);
  };

  const loadProfilePhoto = (event) => {
    const [file] = event.target.files || [];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = Math.min(1, 512 / Math.max(image.width, image.height));
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        const photo = canvas.toDataURL('image/jpeg', 0.78);
        setProfilePhoto(photo);
        try {
          localStorage.setItem('madirenlearn-profile-photo', photo);
        } catch {}
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const generateNotesForTopic = async (item) => {
    const key = `${resourceSubject}:${item.topic}`;
    setGeneratingTopic(key);
    try {
      const response = await apiFetch(`${API_BASE}/ai/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: resourceSubject, topic: item.topic, syllabus: item.syllabus }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || `Notes service returned an error (${response.status}).`);
      setGeneratedNotes((notes) => ({ ...notes, [key]: data.notes }));
    } catch {
      setGeneratedNotes((notes) => ({
        ...notes,
        [key]: `Comprehensive Study Notes for ${item.topic} (${resourceSubject}):\n\n1. Core Concepts: ${item.syllabus}\n2. Key Formulas & Definitions: Master fundamental principles through step-by-step worked examples.\n3. Exam Tip: Pay close attention to unit conversions and structured reasoning in Paper 2.`,
      }));
    } finally {
      setGeneratingTopic('');
    }
  };

  const awardBadge = (badge) => {
    setEarnedBadges((current) => {
      const already = current.some((b) => b.label === badge.label && b.subject === badge.subject);
      if (already) return current;
      return [...current, { ...badge, earnedAt: new Date().toISOString() }];
    });
  };

  const saveBadgeAsSvg = () => {
    if (!latestQuizResult) return;
    const safeName = session?.user?.name || 'Tino';
    const badgeDate = new Date();
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="560" viewBox="0 0 900 560"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f9e2a2"/><stop offset="1" stop-color="#d89a3d"/></linearGradient></defs><rect x="22" y="22" width="856" height="516" rx="34" fill="#fffaf0" stroke="#c89035" stroke-width="12"/><rect x="48" y="48" width="804" height="464" rx="24" fill="none" stroke="#ead39f" stroke-width="3"/><circle cx="450" cy="180" r="78" fill="url(#g)" stroke="#b97d25" stroke-width="8"/><text x="450" y="310" text-anchor="middle" font-family="Arial,sans-serif" font-size="25" font-weight="700" fill="#80561f">CERTIFICATE OF ACHIEVEMENT</text><text x="450" y="370" text-anchor="middle" font-family="Arial,sans-serif" font-size="44" font-weight="700" fill="#213f2c">${safeName}</text><text x="450" y="420" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" fill="#536758">${latestQuizResult.subject} · ${latestQuizResult.score}/${latestQuizResult.total} correct (${latestQuizResult.percentage}%)</text><text x="450" y="465" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" fill="#7b8b7e">MadirenLearn AI · ${badgeDate.toLocaleDateString()}</text></svg>`;
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `madirenlearn-badge-${safeName.replace(/\s+/g, '-').toLowerCase()}.svg`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const submitAnswer = () => {
    if (!chosenAnswer) return;
    const question = quizQuestions[currentQuestion];
    const correct = chosenAnswer === question.answer;
    const updatedResponses = [
      ...quizResponses,
      { ...question, selected: chosenAnswer, correct, score: correct ? '1/1' : '0/1' },
    ];
    setChosenAnswer('');
    setQuizResponses(updatedResponses);

    if (currentQuestion === quizQuestions.length - 1) {
      setQuizTimerActive(false);
      const correctCount = updatedResponses.filter((answer) => answer.correct).length;
      setQuizFinished(true);
      const result = {
        subject: quizSubject,
        score: correctCount,
        total: quizQuestions.length,
        percentage: Math.round((correctCount / quizQuestions.length) * 100),
      };
      setLatestQuizResult(result);
      if (result.percentage >= 80) {
        awardBadge({
          label: `${quizSubject} Achiever`,
          icon: FaTrophy,
          color: 'gold',
          subject: quizSubject,
          score: result.score,
          total: result.total,
        });
      }
      return;
    }

    setCurrentQuestion((index) => index + 1);
  };

  const openQuiz = (subj) => {
    if (subj) {
      startQuiz(subj);
    } else {
      setQuizStarted(false);
      setQuizFinished(false);
      setReviewMode(false);
      setActiveTab('Quizzes');
    }
  };

  const openTab = (tab) => {
    setActiveTab(tab);
    setProfileOpen(false);
    setNotificationsOpen(false);
  };

  if (authChecking) {
    return (
      <main className="welcome-screen">
        <p className="welcome-redirect">Verifying your learning session…</p>
      </main>
    );
  }

  if (!session && view === 'landing') {
    return (
      <LandingPage
        onGetStarted={() => setView('auth')}
        onLogin={() => setView('auth')}
      />
    );
  }

  if (!session) {
    return <AuthPage onAuthenticated={handleAuthenticated} />;
  }

  if (showWelcome || view === 'welcome') {
    return <WelcomePage name={firstName} onEnter={enterStudySpace} />;
  }

  return (
    <div className="app-shell-sidebar">
      <header className="topbar">
        <button type="button" className="brand" onClick={() => openTab('Dashboard')} aria-label="Go to dashboard">
          <BrandMark />
          <span>
            madirenLearn <strong style={{ color: '#f9d976' }}>AI</strong>
          </span>
        </button>

        <div className="account-actions">
          <button
            type="button"
            className="account-button"
            onClick={() => {
              setProfileOpen((open) => !open);
              setNotificationsOpen(false);
            }}
          >
            <span className="avatar">{profilePhoto ? <img src={profilePhoto} alt="" /> : <FaUser />}</span>
            <span className="account-name">{firstName}</span>
            <FaChevronDown className="account-chevron" />
          </button>

          <button
            type="button"
            className="icon-button notification-button"
            aria-label="Notifications"
            onClick={() => {
              setNotificationsOpen((open) => !open);
              setProfileOpen(false);
            }}
          >
            <FaBell />
            <span className="notification-dot" />
          </button>

          {notificationsOpen && (
            <div className="notification-panel">
              <strong>You’re all caught up</strong>
              <p>Finish a subject quiz to add your latest learning progress here.</p>
              <button type="button" onClick={() => openQuiz()}>
                Choose a quiz <FaArrowRight />
              </button>
            </div>
          )}

          {profileOpen && (
            <div className="profile-popover">
              <strong>{session.user.name}</strong>
              <span>{session.user.email}</span>
              <button type="button" onClick={() => openTab('Profile')}>
                View profile <FaArrowRight />
              </button>
              <button type="button" className="logout-action" onClick={logout}>
                Log out
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="main-layout-wrapper">
        <aside className="left-sidebar" aria-label="Learning navigation">
          <div className="sidebar-section-title">Study space</div>
          <nav className="primary-nav">
            {['Dashboard', 'AI Tutor', 'Quizzes', 'Resources', 'Profile'].map((tab) => (
              <button
                key={tab}
                type="button"
                className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                onClick={() => openTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>

          <div className="sidebar-section-title revision-tests-title">REVISION TESTS</div>
          <div className="sidebar-subject-list">
            {['Shona', 'Mathematics', 'English', 'Combined Science'].map((sub) => (
              <button
                key={sub}
                type="button"
                className="sidebar-sub-item"
                onClick={() => {
                  startQuiz(sub);
                  setActiveTab('Quizzes');
                }}
              >
                {sub}
              </button>
            ))}
          </div>

          <div className="sidebar-footer">
            <button type="button" className="sign-out-button" onClick={logout}>
              <FaSignOutAlt />
              <span>Sign out</span>
            </button>
          </div>
        </aside>

        {invites.length > 0 && (
          <aside className="incoming-invites" aria-label="Quiz invitations">
            <strong>Quiz challenge invites</strong>
            {invites.map((invite) => (
              <article key={invite.id}>
                <p>
                  <b>{invite.hostName}</b> invited you to play {invite.subject}.
                </p>
                <div>
                  <button type="button" onClick={() => respondToInvite(invite, true)}>Accept</button>
                  <button type="button" onClick={() => respondToInvite(invite, false)}>Decline</button>
                </div>
              </article>
            ))}
          </aside>
        )}

        <main className="workspace">
          <div className="welcome-row">
            <div>
              <span className="eyebrow">YOUR LEARNING SPACE</span>
              <h1>Welcome Back, {firstName}!</h1>
            </div>
            <span className="welcome-note">
              <FaSeedling /> Your learning journey is growing
            </span>
          </div>

          {activeTab === 'Dashboard' && (
            <div className="dashboard-single-column">
              <section className="dashboard-hero">
                <div className="hero-copy">
                  <span className="hero-kicker">
                    <span style={{ color: '#d89a3d' }}>🎓</span> A BRIGHTER WAY TO LEARN
                  </span>
                  <h2>Small steps. Big understanding.</h2>
                  <p>Pick up where you left off, ask your tutor anything, or try a fresh subject quiz.</p>
                  <div className="hero-actions">
                    <button type="button" className="hero-primary" onClick={() => openTab('AI Tutor')}>
                      <FaRobot /> Ask your AI tutor
                    </button>
                    <button type="button" className="hero-secondary" onClick={() => openQuiz()}>
                      <FaPlay /> Start a quiz
                    </button>
                  </div>
                </div>
                <div className="hero-art" aria-hidden="true">
                  <img
                    className="hero-books-image"
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80"
                    alt="Students studying together with laptops"
                  />
                </div>
              </section>

              <section className="dashboard-subjects" style={{ marginTop: '2rem' }}>
                <div className="subjects-heading">
                  <span className="panel-kicker">QUICK START</span>
                  <h2>Choose a subject</h2>
                  <p>Pick any subject to begin a revision quiz.</p>
                </div>
                <div className="subjects-grid">
                  {schoolSubjects.map((subItem) => (
                    <button
                      key={subItem}
                      type="button"
                      className="subject-chip"
                      onClick={() => {
                        startQuiz(subItem);
                        setActiveTab('Quizzes');
                      }}
                    >
                      <span className="subject-icon-box">
                        <FaBookOpen />
                      </span>
                      <span>{subItem}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="panel tutor-panel" style={{ marginTop: '2rem' }}>
                <div className="panel-heading tutor-heading">
                  <div>
                    <span className="panel-kicker">YOUR PERSONAL GUIDE</span>
                    <h2>Your AI Socratic Tutor</h2>
                  </div>
                  <div className="heading-actions">
                    <button
                      type="button"
                      className="square-action"
                      aria-label="Open full tutor"
                      onClick={() => openTab('AI Tutor')}
                    >
                      <FaArrowRight />
                    </button>
                    <button
                      type="button"
                      className="square-action"
                      aria-label="Clear conversation"
                      onClick={() =>
                        setChatLog([
                          { sender: 'ai', text: 'Hi! Ask me anything you are learning, and I will explain it clearly.' },
                        ])
                      }
                    >
                      <FaRedoAlt />
                    </button>
                  </div>
                </div>

                <div className="chat-window">
                  <div className="chat-titlebar">
                    <span className="ai-orb">
                      <FaRobot />
                    </span>
                    <span>AI Chat</span>
                    <span className="online-indicator">
                      <FaCircle /> Online
                    </span>
                  </div>
                  <div className="chat-messages" aria-live="polite">
                    {chatLog.map((message, index) => (
                      <div className={`message-row ${message.sender}`} key={`${index}-${message.text.slice(0, 10)}`}>
                        {message.sender === 'ai' && (
                          <span className="message-avatar">
                            <FaRobot />
                          </span>
                        )}
                        <div className="message-bubble">
                          {message.sender === 'ai' && <span className="message-label">AI · Socratic tutor</span>}
                          {message.text}
                        </div>
                        {message.sender === 'user' && (
                          <span className="message-avatar user-avatar">
                            <FaUser />
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="composer-area">
                    <form className="chat-composer" onSubmit={sendMessage}>
                      <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Type your next homework question (e.g., math, science, language)..."
                        aria-label="Ask your tutor a question"
                      />
                      <button type="submit" disabled={!query.trim() || loading} aria-label="Send question">
                        <FaPaperPlane />
                      </button>
                    </form>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'AI Tutor' && (
            <div className="tutor-full-view panel">
              <h2>Dedicated AI Socratic Tutor</h2>
              <p>Ask in-depth questions across any O-Level or A-Level subject. Get step-by-step guidance in English or Shona.</p>
              <div className="chat-window full-height">
                <div className="chat-messages">
                  {chatLog.map((message, index) => (
                    <div className={`message-row ${message.sender}`} key={index}>
                      <div className="message-bubble">{message.text}</div>
                    </div>
                  ))}
                </div>
                <form className="chat-composer" onSubmit={sendMessage}>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask your AI tutor anything..."
                  />
                  <button type="submit">
                    <FaPaperPlane />
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'Quizzes' && (
            <div className="quizzes-container">
              {!quizStarted && !quizFinished && (
                <div className="quiz-selector-panel panel">
                  <h2>Select a Subject</h2>
                  <p>Choose from our comprehensive question bank.</p>

                  <div className="quiz-category-group">
                    <h3>School Subjects</h3>
                    <div className="subjects-grid">
                      {schoolSubjects.map((subj) => (
                        <button key={subj} type="button" className="subject-chip" onClick={() => startQuiz(subj)}>
                          <span className="subject-icon-box">
                            <FaBookOpen />
                          </span>
                          <span>{subj}</span>
                        </button>
                      ))}
                    </div>

                    <h3>Extra Courses</h3>
                    <div className="subjects-grid">
                      {allExtraCourses.map((crs) => (
                        <button
                          key={crs.title}
                          type="button"
                          className="subject-chip extra-course"
                          onClick={() => startQuiz(crs.title)}
                        >
                          <span className="subject-icon-box">
                            <FaGraduationCap />
                          </span>
                          <span>{crs.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {quizStarted && !quizFinished && (
                <div className="quiz-runner panel">
                  <div className="quiz-header-bar">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <button type="button" className="secondary-btn" onClick={exitQuiz}>
                        Exit Quiz
                      </button>
                      <h3>Quiz: {quizSubject}</h3>
                    </div>
                    <div className="quiz-timer">
                      ⏳ Time Left: <strong>{formatTime(timeLeft)}</strong>
                    </div>
                  </div>

                  <div className="quiz-progress-indicator">
                    Question {currentQuestion + 1} of {quizQuestions.length}
                  </div>

                  {quizQuestions[currentQuestion] && (
                    <div className="question-box">
                      <h4>{quizQuestions[currentQuestion].question}</h4>

                      <div className="options-column-list">
                        {quizQuestions[currentQuestion].options.map((opt, i) => (
                          <label
                            key={i}
                            className={`option-row-label ${chosenAnswer === opt ? 'selected' : ''}`}
                          >
                            <input
                              type="radio"
                              name="quiz-option"
                              value={opt}
                              checked={chosenAnswer === opt}
                              onChange={() => setChosenAnswer(opt)}
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                      <button
                        type="button"
                        className="primary-btn"
                        onClick={submitAnswer}
                        disabled={!chosenAnswer}
                        style={{ marginTop: '1.5rem' }}
                      >
                        {currentQuestion === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {quizFinished && latestQuizResult && !reviewMode && (
                <div className="quiz-results-panel panel">
                  <h2>Quiz Completed! 🎉</h2>
                  <div className="result-score-card">
                    <p>
                      Subject: <strong>{latestQuizResult.subject}</strong>
                    </p>
                    <p>
                      Score:{' '}
                      <strong>
                        {latestQuizResult.score} / {latestQuizResult.total}
                      </strong>
                    </p>
                    <p>
                      Accuracy: <strong>{latestQuizResult.percentage}%</strong>
                    </p>
                  </div>

                  <div
                    className="result-action-buttons"
                    style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}
                  >
                    <button type="button" className="primary-btn" onClick={() => setReviewMode(true)}>
                      🔍 Review Answers
                    </button>
                    <button
                      type="button"
                      className="secondary-btn"
                      onClick={() => {
                        setQuizFinished(false);
                        setQuizStarted(false);
                      }}
                    >
                      Back to Quizzes
                    </button>
                  </div>

                  {latestQuizResult.percentage >= 80 && (
                    <div className="badge-earned-box" style={{ marginTop: '1.5rem' }}>
                      <p>🏆 You earned an official Achievement Badge!</p>
                      <button type="button" className="primary-btn" onClick={saveBadgeAsSvg}>
                        Download Badge Certificate (.svg)
                      </button>
                    </div>
                  )}

                  {latestQuizResult.percentage === 100 && (
                    <div className="opportunity-lock-section" style={{ marginTop: '1.5rem' }}>
                      <div className="lock-box" onClick={() => setUnlockedOpportunity(true)}>
                        <FaLock className="lock-icon" />
                        <span>Click to Unlock Special Opportunity!</span>
                      </div>
                      {unlockedOpportunity && (
                        <div className="opportunity-reveal">
                          <h3>🎊 Congratulations on a Perfect Score! 🎊</h3>
                          <p>You have unlocked exclusive access to technical training programs and tech scholarships.</p>
                          <a
                            href="https://www.uncommon.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="opportunity-link-btn"
                          >
                            Explore Opportunities at Uncommon.org <FaArrowRight />
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {quizFinished && reviewMode && (
                <div className="quiz-review-panel panel">
                  <h2>Detailed Answer Review</h2>
                  <p>Review every question, see where you got things right or wrong, and study the correct explanations.</p>

                  <div
                    className="review-list"
                    style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}
                  >
                    {quizResponses.map((item, idx) => (
                      <div
                        key={idx}
                        className={`review-card ${item.correct ? 'correct-card' : 'incorrect-card'}`}
                      >
                        <div className="review-question-header">
                          <span className="q-num">Q{idx + 1}</span>
                          <h4>{item.question}</h4>
                          <span className={`status-badge ${item.correct ? 'correct' : 'incorrect'}`}>
                            {item.correct ? (
                              <>
                                <FaCheck /> Correct
                              </>
                            ) : (
                              <>
                                <FaTimes /> Incorrect
                              </>
                            )}
                          </span>
                        </div>
                        <p>
                          <strong>Your Answer:</strong>{' '}
                          <span className={item.correct ? 'correct-text' : 'incorrect-text'}>{item.selected}</span>
                        </p>
                        {!item.correct && (
                          <p>
                            <strong>Correct Answer:</strong> <span className="correct-text">{item.answer}</span>
                          </p>
                        )}
                        {item.explanation && (
                          <div className="explanation-box">
                            <strong>Explanation:</strong> {item.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="primary-btn"
                    onClick={() => {
                      setReviewMode(false);
                      setQuizFinished(false);
                      setQuizStarted(false);
                    }}
                    style={{ marginTop: '1.5rem' }}
                  >
                    Back to Quizzes
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Resources' && (
            <div className="panel">
              <h2>Study Resources</h2>
              <p>Select a subject to generate topic notes.</p>
              <div className="subjects-grid">
                {Object.keys(allLearningNotes).map((subj) => (
                  <button
                    key={subj}
                    type="button"
                    className={`subject-chip ${resourceSubject === subj ? 'active' : ''}`}
                    onClick={() => setResourceSubject(subj)}
                  >
                    <span>{subj}</span>
                  </button>
                ))}
              </div>
              {(allLearningNotes[resourceSubject] || []).map((item) => {
                const key = `${resourceSubject}:${item.topic}`;
                return (
                  <div key={item.topic} className="resource-section" style={{ marginTop: '1rem' }}>
                    <h3>{item.topic}</h3>
                    <p>{item.syllabus}</p>
                    <button
                      type="button"
                      className="primary-btn"
                      onClick={() => generateNotesForTopic(item)}
                      disabled={generatingTopic === key}
                    >
                      {generatingTopic === key ? 'Generating…' : 'Generate Notes'}
                    </button>
                    {generatedNotes[key] && <pre style={{ whiteSpace: 'pre-wrap' }}>{generatedNotes[key]}</pre>}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'Profile' && (
            <div className="profile-container panel">
              <h2>Student Profile &amp; Achievements</h2>
              <div className="profile-details-card">
                <div className="profile-avatar-section">
                  <div className="avatar-preview" onClick={() => profileImageInput.current?.click()}>
                    {profilePhoto ? <img src={profilePhoto} alt="Profile" /> : <FaUser />}
                  </div>
                  <input
                    type="file"
                    ref={profileImageInput}
                    onChange={loadProfilePhoto}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    className="small-btn"
                    onClick={() => profileImageInput.current?.click()}
                  >
                    Change Photo
                  </button>
                </div>
                <div className="profile-info-text">
                  <h3>{session.user.name}</h3>
                  <p>
                    Email: <strong>{session.user.email}</strong>
                  </p>
                  <p>
                    Activity Status: <span className="badge-status">Working Hard &amp; Excelling</span>
                  </p>
                </div>
              </div>

              <div className="achievements-section">
                <h3>Earned Badges &amp; Academic Record</h3>
                {earnedBadges.length === 0 ? (
                  <p>No badges earned yet. Take a quiz and score 80% or higher to earn certificates!</p>
                ) : (
                  <div className="earned-badges-grid">
                    {earnedBadges.map((badge, idx) => (
                      <div key={idx} className="earned-badge-card">
                        <FaTrophy style={{ color: badge.color }} />
                        <h4>{badge.label}</h4>
                        <p>
                          Score: {badge.score}/{badge.total} ({badge.subject})
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      <footer className="app-footer">
        <BrandMark />
        <span>madirenLearn AI</span>
        <span className="footer-separator">·</span>
        <span>Learning, made personal.</span>
        <span className="footer-status">
          <FaCircle style={{ color: '#2b8a3e', fontSize: '0.5rem' }} /> All progress saved
        </span>
      </footer>
    </div>
  );
}
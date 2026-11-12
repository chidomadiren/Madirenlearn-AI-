import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FaArrowRight,
  FaBell,
  FaBookOpen,
  FaCheck,
  FaCheckCircle,
  FaChevronDown,
  FaClipboardCheck,
  FaCircle,
  FaComment,
  FaEllipsisV,
  FaGraduationCap,
  FaImage,
  FaLightbulb,
  FaPaperPlane,
  FaPlay,
  FaRobot,
  FaRedoAlt,
  FaSeedling,
  FaStar,
  FaTrophy,
  FaUser,
  FaUsers,
} from 'react-icons/fa';
import { quizBank, quizSubjects } from './quizBank';
import { courseQuizBank, extraCourses, learningNotes } from './learningContent';
import { additionalQuizBank, additionalLearningNotes, extendedCourses, extendedCourseQuizBank, paperTwoPrompts, topicExercises } from './additionalLearning';
import { API_BASE, apiFetch, clearSession, readSession } from './api';
import { AuthPage, WelcomePage } from './AuthPages';
const schoolSubjects = [...quizSubjects, ...Object.keys(additionalQuizBank)];
const allQuizBank = { ...quizBank, ...additionalQuizBank, ...courseQuizBank, ...extendedCourseQuizBank };
const allExtraCourses = [...extraCourses, ...extendedCourses];
const allLearningNotes = { ...learningNotes, ...additionalLearningNotes };
const allTestSubjects = [...schoolSubjects, ...allExtraCourses.map((course) => course.title)];

function getTopicExercise(subject, topic, index) {
  if (topicExercises[topic]) return topicExercises[topic];
  const bank = allQuizBank[subject] || [];
  if (bank.length) return bank[index % bank.length];
  return null;
}

const initialFeed = [
  {
    id: 'quadratic',
    title: 'Discussing Quadratic Equations',
    excerpt: 'Discussing Quadratic Equations',
    replies: 3,
    questions: [
      { label: 'Q1: (Shona Q)...', correct: true, score: '1/1' },
      { label: 'Q2: (Shona Q)...', correct: false, score: '0/1' },
    ],
  },
];

const journeyBadges = [
  { icon: FaStar, label: 'Curious mind', color: 'gold' },
  { icon: FaBookOpen, label: 'Book lover', color: 'orange' },
  { icon: FaCheck, label: 'Quick learner', color: 'green' },
  { icon: FaTrophy, label: 'Rising star', color: 'blue' },
];

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <FaGraduationCap />
    </span>
  );
}

const shuffled = (items) => [...items].sort(() => Math.random() - 0.5);

function createQuiz(subject) {
  const bank = allQuizBank[subject] || quizBank.Shona;
  const questions = shuffled(bank).slice(0, 12);
  return questions.map((question, index) => {
    const options = shuffled(question.options);
    return { ...question, id: question.id || `${subject}-${index + 1}`, options };
  });
}

export default function App() {
  const [session, setSession] = useState(() => readSession());
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
  const [feed, setFeed] = useState(initialFeed);
  const [feedError, setFeedError] = useState('');
  const [quizQuestions, setQuizQuestions] = useState(() => createQuiz('Shona'));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [chosenAnswer, setChosenAnswer] = useState('');
  const [quizResponses, setQuizResponses] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [latestQuizResult, setLatestQuizResult] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeFeedItem, setActiveFeedItem] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [resourceSubject, setResourceSubject] = useState('Mathematics');
  const [expandedCourse, setExpandedCourse] = useState('');
  const [activeTopic, setActiveTopic] = useState('');
  const [exerciseChoice, setExerciseChoice] = useState('');
  const [exerciseResult, setExerciseResult] = useState('');
  const [generatedNotes, setGeneratedNotes] = useState({});
  const [generatingTopic, setGeneratingTopic] = useState('');
  const [notesError, setNotesError] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(() => localStorage.getItem('madirenlearn-profile-photo') || '');
  const [courseAssignment, setCourseAssignment] = useState({});
  const [savedAssignments, setSavedAssignments] = useState([]);
  const [completedCourses, setCompletedCourses] = useState(() => JSON.parse(localStorage.getItem('madirenlearn-completed-courses') || '[]'));
  const profileImageInput = useRef(null);
  const [paperDrafts, setPaperDrafts] = useState({});
  const [room, setRoom] = useState(null);
  const [roomPlayerId, setRoomPlayerId] = useState('');
  const [playerName, setPlayerName] = useState('Student');
  const [challengeBadge, setChallengeBadge] = useState(null);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [roomBusy, setRoomBusy] = useState(false);
  const [roomError, setRoomError] = useState('');
  const [showRoomTools, setShowRoomTools] = useState(false);
  const [students, setStudents] = useState([]);
  const [invites, setInvites] = useState([]);
  const [inviteError, setInviteError] = useState('');
  const [activeInviteRoom, setActiveInviteRoom] = useState(null);

  const firstName = session?.user?.name?.trim().split(/\s+/)[0] || 'Student';

  const handleAuthenticated = (user) => {
    setSession(readSession() || { user });
    setPlayerName(user.name || 'Student');
    setShowWelcome(true);
  };

  const logout = () => {
    clearSession();
    setSession(null);
    setShowWelcome(false);
    setProfileOpen(false);
  };

  const enterStudySpace = () => {
    setShowWelcome(false);
    setActiveTab('Dashboard');
  };

  useEffect(() => {
    const handleExpiredSession = () => logout();
    window.addEventListener('madirenlearn:session-expired', handleExpiredSession);
    return () => window.removeEventListener('madirenlearn:session-expired', handleExpiredSession);
  }, []);

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
          setSession((current) => current ? { ...current, user: data.user } : current);
          setPlayerName(data.user.name || 'Student');
        }
      })
      .catch(() => {
        if (active) logout();
      })
      .finally(() => {
        if (active) setAuthChecking(false);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!session || !showWelcome) return undefined;
    const timer = window.setTimeout(enterStudySpace, 2500);
    return () => window.clearTimeout(timer);
  }, [session, showWelcome]);

  useEffect(() => {
    if (!session) return undefined;
    let active = true;
    const loadClassmates = async () => {
      try {
        const response = await apiFetch(`${API_BASE}/users`);
        const data = await response.json().catch(() => ({}));
        if (response.ok && active) setStudents(data.users || []);
      } catch (error) {
        if (active && error.status) logout();
      }
    };
    const loadInvites = async () => {
      try {
        const response = await apiFetch(`${API_BASE}/quiz/invites`);
        const data = await response.json().catch(() => ({}));
        if (response.ok && active) setInvites(data.invites || []);
      } catch (error) {
        if (active && error.status) logout();
      }
    };
    loadClassmates();
    loadInvites();
    const timer = window.setInterval(() => { loadInvites(); loadClassmates(); }, 5000);
    return () => { active = false; window.clearInterval(timer); };
  }, [session]);

  const score = useMemo(() => quizAnswers.filter((answer) => answer.correct).length, [quizAnswers]);
  const progress = Math.min(100, 15 + quizAnswers.length * 3);
  const roomWinner = room?.status === 'finished' ? room.players.find((player) => player.id === room.winnerId) : null;
  const visibleChallengeBadge = challengeBadge || (roomWinner ? {
    name: roomWinner.name,
    subject: room.subject,
    score: roomWinner.score,
    total: room.totalQuestions,
  } : null);

  useEffect(() => {
    let cancelled = false;

    if (!session) return undefined;

    apiFetch(`${API_BASE}/community`)
      .then((response) => {
        if (!response.ok) throw new Error('Community feed is currently unavailable.');
        return response.json();
      })
      .then((data) => {
        if (!cancelled && Array.isArray(data.posts) && data.posts.length) setFeed(data.posts);
      })
      .catch(() => {
        if (!cancelled) setFeedError('Showing your latest learning activity.');
      });

    return () => {
      cancelled = true;
    };
  }, [session]);

  useEffect(() => {
    if (!room?.code || !roomPlayerId || room.status === 'finished') return undefined;
    const timer = window.setInterval(async () => {
      try {
        const response = await apiFetch(`${API_BASE}/quiz-rooms/${room.code}?playerId=${encodeURIComponent(roomPlayerId)}`);
        const data = await response.json();
        if (response.ok) setRoom(data);
      } catch {
        setRoomError('Lost connection to the quiz room. Retrying…');
      }
    }, 1800);
    return () => window.clearInterval(timer);
  }, [room?.code, room?.status, roomPlayerId]);

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
      const message = error instanceof TypeError
        ? 'Cannot reach the tutor backend. Start the backend server and check that it is listening on port 5000.'
        : error.message;
      setChatLog((messages) => [
        ...messages,
        { sender: 'ai', text: message },
      ]);
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
        } catch {
          // Keep the selected image in this session if browser storage is full.
        }
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const submitCourseAssignment = (courseTitle, moduleTitle) => {
    const key = `${courseTitle}:${moduleTitle}`;
    setSavedAssignments((assignments) => [...new Set([...assignments, key])]);
  };

  const generateNotesForTopic = async (item) => {
    const key = `${resourceSubject}:${item.topic}`;
    setGeneratingTopic(key);
    setNotesError('');
    try {
      const response = await apiFetch(`${API_BASE}/ai/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: resourceSubject, topic: item.topic, syllabus: item.syllabus }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || `Notes service returned an error (${response.status}).`);
      setGeneratedNotes((notes) => ({ ...notes, [key]: data.notes }));
    } catch (error) {
      setNotesError(error instanceof TypeError ? 'Cannot reach the AI service. Check that the backend is running.' : error.message);
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
    if (!visibleChallengeBadge) return;
    const safeName = visibleChallengeBadge.name.replace(/[<>&"']/g, ' ').trim().slice(0, 40);
    const safeSubject = visibleChallengeBadge.subject.replace(/[<>&"']/g, ' ').trim().slice(0, 48);
    const badgeDate = visibleChallengeBadge.date ? new Date(visibleChallengeBadge.date) : new Date();
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="560" viewBox="0 0 900 560"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f9e2a2"/><stop offset="1" stop-color="#d89a3d"/></linearGradient></defs><rect x="22" y="22" width="856" height="516" rx="34" fill="#fffaf0" stroke="#c89035" stroke-width="12"/><rect x="48" y="48" width="804" height="464" rx="24" fill="none" stroke="#ead39f" stroke-width="3"/><circle cx="450" cy="180" r="78" fill="url(#g)" stroke="#b97d25" stroke-width="8"/><path d="M450 116 466 154l42 4-32 27 10 41-36-22-36 22 10-41-32-27 42-4 16-38Z" fill="#fff9e6"/><text x="450" y="310" text-anchor="middle" font-family="Arial,sans-serif" font-size="25" font-weight="700" fill="#80561f">CHALLENGE WINNER</text><text x="450" y="370" text-anchor="middle" font-family="Arial,sans-serif" font-size="44" font-weight="700" fill="#213f2c">${safeName}</text><text x="450" y="420" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" fill="#536758">${safeSubject} · ${visibleChallengeBadge.score}/${visibleChallengeBadge.total} correct</text><text x="450" y="465" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" fill="#7b8b7e">MadirenLearn AI · ${badgeDate.toLocaleDateString()}</text></svg>`;
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `madirenlearn-winner-${safeName.replace(/\s+/g, '-').toLowerCase()}.svg`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const roomRequest = async (path, method, body) => {
    const response = await apiFetch(`${API_BASE}/quiz-rooms${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Could not update the quiz room.');
    return data;
  };

  const createRoom = async () => {
    setRoomBusy(true);
    setRoomError('');
    try {
      const data = await roomRequest('', 'POST', {
        subject: quizSubject,
        playerName,
        questions: quizQuestions.map(({ question, options, answer }) => ({ question, options, answer })),
      });
      setRoom(data.room);
      setRoomPlayerId(data.playerId);
      setActiveInviteRoom(data.room.code);
    } catch (error) {
      setRoomError(error.message);
    } finally {
      setRoomBusy(false);
    }
  };

  const inviteClassmate = async (inviteeId) => {
    setInviteError('');
    try {
      const response = await apiFetch(`${API_BASE}/quiz/invites`, {
        method: 'POST',
        body: JSON.stringify({ inviteeId, roomCode: room?.code, subject: quizSubject }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Could not invite this classmate.');
      setInviteError('Invitation sent. Your classmate will see an Accept prompt in their app.');
    } catch (error) {
      setInviteError(error.message);
    }
  };

  const respondToInvite = async (invite, accept) => {
    setInviteError('');
    try {
      const response = await apiFetch(`${API_BASE}/quiz/invites/${invite.id}/respond`, {
        method: 'POST',
        body: JSON.stringify({ accept }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Could not respond to invitation.');
      setInvites((current) => current.filter((item) => item.id !== invite.id));
      if (accept) {
        const joined = await roomRequest(`/${encodeURIComponent(invite.roomCode)}/join`, 'POST', { playerName: session.user.name });
        setRoom(joined.room);
        setRoomPlayerId(joined.playerId);
        setQuizSubject(invite.subject);
        setActiveInviteRoom(invite.roomCode);
        openTab('Quizzes');
      }
    } catch (error) {
      setInviteError(error.message);
    }
  };

  const startRoom = async () => {
    setRoomBusy(true);
    setRoomError('');
    try {
      setRoom(await roomRequest(`/${room.code}/start`, 'POST', { playerId: roomPlayerId }));
    } catch (error) {
      setRoomError(error.message);
    } finally {
      setRoomBusy(false);
    }
  };

  const submitRoomAnswer = async (answer) => {
    setRoomBusy(true);
    setRoomError('');
    try {
      const updatedRoom = await roomRequest(`/${room.code}/answer`, 'POST', {
        playerId: roomPlayerId,
        answer,
        questionIndex: room.questionIndex,
      });
      setRoom(updatedRoom);
      if (updatedRoom.status === 'finished' && updatedRoom.winnerId === roomPlayerId) {
        const winner = updatedRoom.players.find((player) => player.id === roomPlayerId);
        setChallengeBadge({
          name: winner?.name || playerName,
          subject: updatedRoom.subject,
          score: winner?.score || 0,
          total: updatedRoom.totalQuestions,
          date: new Date().toISOString(),
        });
        awardBadge({
          label: `${updatedRoom.subject} Champion`,
          icon: FaTrophy,
          color: 'gold',
          subject: updatedRoom.subject,
          score: winner?.score || 0,
          total: updatedRoom.totalQuestions,
        });
      }
    } catch (error) {
      setRoomError(error.message);
    } finally {
      setRoomBusy(false);
    }
  };

  const submitAnswer = () => {
    if (!chosenAnswer) return;
    const question = quizQuestions[currentQuestion];
    const correct = chosenAnswer === question.answer;
    const updatedResponses = [...quizResponses, { ...question, selected: chosenAnswer, correct, score: correct ? '1/1' : '0/1' }];
    setChosenAnswer('');
    setQuizResponses(updatedResponses);

    if (currentQuestion === quizQuestions.length - 1) {
      const correctCount = updatedResponses.filter((answer) => answer.correct).length;
      setQuizFinished(true);
      const result = {
        subject: quizSubject,
        score: correctCount,
        total: quizQuestions.length,
        percentage: Math.round((correctCount / quizQuestions.length) * 100),
      };
      setLatestQuizResult(result);
      if (allExtraCourses.some((course) => course.title === quizSubject) && result.percentage >= 80) {
        setCompletedCourses((courses) => {
          const updated = [...new Set([...courses, quizSubject])];
          localStorage.setItem('madirenlearn-completed-courses', JSON.stringify(updated));
          return updated;
        });
        awardBadge({
          label: `${quizSubject} Winner`,
          icon: FaTrophy,
          color: 'gold',
          subject: quizSubject,
          score: result.score,
          total: result.total,
        });
      }
      setQuizAnswers((answers) => [...answers, ...updatedResponses]);
      return;
    }

    setCurrentQuestion((index) => index + 1);
  };

  const openQuiz = () => {
    setQuizStarted(false);
    setQuizFinished(false);
    openTab('Quizzes');
  };

  const openTab = (tab) => {
    setActiveTab(tab);
    setProfileOpen(false);
    setNotificationsOpen(false);
  };

  if (authChecking) return <main className="welcome-screen"><p className="welcome-redirect">Verifying your learning session…</p></main>;
  if (!session) return <AuthPage onAuthenticated={handleAuthenticated} />;
  if (showWelcome) return <WelcomePage name={firstName} onEnter={enterStudySpace} />;

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => openTab('Dashboard')} aria-label="Go to dashboard">
          <BrandMark />
          <span>madirenLearn <strong>AI</strong></span>
        </button>

        <div className="account-actions">
          <button className="account-button" onClick={() => { setProfileOpen((open) => !open); setNotificationsOpen(false); }}>
            <span className="avatar">{profilePhoto ? <img src={profilePhoto} alt="" /> : <FaUser />}</span>
            <span className="account-name">{firstName}</span>
            <FaChevronDown className="account-chevron" />
          </button>
          <button className="icon-button notification-button" aria-label="Notifications" onClick={() => { setNotificationsOpen((open) => !open); setProfileOpen(false); }}>
            <FaBell />
            <span className="notification-dot" />
          </button>
          {notificationsOpen && <div className="notification-panel"><strong>You’re all caught up</strong><p>Finish a subject quiz to add your latest learning progress here.</p><button onClick={openQuiz}>Choose a quiz <FaArrowRight /></button></div>}
          {profileOpen && (
            <div className="profile-popover">
              <strong>{session.user.name}</strong>
              <span>{session.user.email}</span>
              <button onClick={() => openTab('Profile')}>View profile <FaArrowRight /></button>
              <button className="logout-action" onClick={logout}>Log out</button>
            </div>
          )}
        </div>
      </header>

      <aside className="right-rail" aria-label="Learning navigation">
        <div className="rail-brand"><BrandMark /><span>Study space</span></div>
        <nav className="primary-nav" aria-label="Main navigation">
          {['Dashboard', 'AI Tutor', 'Quizzes', 'Resources', 'Profile'].map((tab) => (
            <button key={tab} className={`nav-link ${activeTab === tab ? 'active' : ''}`} onClick={() => openTab(tab)}>
              {tab}
            </button>
          ))}
        </nav>
      </aside>

      {invites.length > 0 && <aside className="incoming-invites" aria-label="Quiz invitations"><strong>Quiz challenge invites</strong>{invites.map((invite) => <article key={invite.id}><p><b>{invite.hostName}</b> invited you to play {invite.subject}.</p><div><button onClick={() => respondToInvite(invite, true)}>Accept</button><button onClick={() => respondToInvite(invite, false)}>Decline</button></div></article>)}</aside>}

      <main className="workspace">
        <div className="welcome-row">
          <div>
            <span className="eyebrow">YOUR LEARNING SPACE</span>
            <h1>Welcome Back, {firstName}!</h1>
          </div>
          <span className="welcome-note"><FaSeedling /> Your learning journey is growing</span>
        </div>

        {activeTab === 'Dashboard' && (
          <>
          <section className="dashboard-hero">
            <div className="hero-copy">
              <span className="hero-kicker"><FaGraduationCap /> A brighter way to learn</span>
              <h2>Small steps. Big understanding.</h2>
              <p>Pick up where you left off, ask your tutor anything, or try a fresh subject quiz.</p>
              <div className="hero-actions">
                <button className="hero-primary" onClick={() => openTab('AI Tutor')}><FaRobot /> Ask your AI tutor</button>
                <button className="hero-secondary" onClick={openQuiz}><FaPlay /> Start a quiz</button>
              </div>
            </div>
            <div className="hero-art" aria-hidden="true"><img className="hero-books-image" src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80" alt="Student studying at desk with laptop" /></div>
          </section>
          <section className="dashboard-subjects" aria-label="Quick subjects">
            <div className="subjects-heading">
              <span className="panel-kicker">QUICK START</span>
              <h2>Choose a subject</h2>
              <p>Pick any subject to begin a revision quiz.</p>
            </div>
            <div className="subjects-grid">
              {schoolSubjects.map((item, index) => (
                <button
                  key={item}
                  className={`subject-chip ${quizSubject === item ? 'active' : ''}`}
                  onClick={() => {
                    setQuizSubject(item);
                    setQuizQuestions(createQuiz(item));
                    setCurrentQuestion(0);
                    setChosenAnswer('');
                    setQuizResponses([]);
                    setQuizStarted(false);
                    setQuizFinished(false);
                    openTab('Quizzes');
                  }}
                >
                  <span className={`subject-symbol subject-${index % 6}`}><FaBookOpen /></span>
                  <span>{item}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="dashboard-grid" aria-label="Learning dashboard">
            <section className="panel tutor-panel">
              <div className="panel-heading tutor-heading">
                <div>
                  <span className="panel-kicker">YOUR PERSONAL GUIDE</span>
                  <h2>Your AI Socratic Tutor</h2>
                </div>
                <div className="heading-actions">
                  <button className="square-action" aria-label="Open full tutor" onClick={() => openTab('AI Tutor')}><FaArrowRight /></button>
                  <button className="square-action" aria-label="Clear conversation" onClick={() => setChatLog([{ sender: 'ai', text: 'Hi! Ask me anything you are learning, and I will explain it clearly.' }])}><FaRedoAlt /></button>
                </div>
              </div>

              <div className="chat-window">
                <div className="chat-titlebar">
                  <span className="ai-orb"><FaRobot /></span>
                  <span>AI Chat</span>
                  <span className="online-indicator"><FaCircle /> Online</span>
                </div>
                <div className="chat-messages" aria-live="polite">
                  {chatLog.map((message, index) => (
                    <div className={`message-row ${message.sender}`} key={`${index}-${message.text.slice(0, 10)}`}>
                      {message.sender === 'ai' && <span className="message-avatar"><FaRobot /></span>}
                      <div className="message-bubble">
                        {message.sender === 'ai' && <span className="message-label">AI · Socratic tutor</span>}
                        {message.text}
                      </div>
                      {message.sender === 'user' && <span className="message-avatar user-avatar"><FaUser /></span>}
                    </div>
                  ))}
                  {loading && (
                    <div className="message-row">
                      <span className="message-avatar"><FaRobot /></span>
                      <div className="message-bubble typing"><span /><span /><span /></div>
                    </div>
                  )}
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
                  <div className="prompt-row">
                    <span className="prompt-label">Prompt suggestions</span>
                    <button type="button" className="suggestion-chip" onClick={() => setQuery(subject === 'Shona' ? 'Tsanangura kuti tsumo chii uye undipe muenzaniso.' : `Can you explain a key idea in ${subject} with an example?`)}>
                      Try a question about {subject}
                    </button>
                  </div>
                </div>
              </div>
              <div className="tutor-subject">
                <label htmlFor="subject-select"><FaLightbulb /> Learning in</label>
                <select id="subject-select" value={subject} onChange={(event) => setSubject(event.target.value)}>
                  {['Mathematics', 'English', 'Shona', 'Combined Science', 'Commerce', 'Geography'].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
            </section>

            <section className="panel assessment-panel">
              <div className="panel-heading light-heading">
                <div>
                  <span className="panel-kicker">KEEP IT UP</span>
                  <h2>Assessment Review</h2>
                </div>
                <button className="icon-button muted-action" aria-label="Browse quizzes" title="Browse quizzes" onClick={() => openTab('Quizzes')}><FaArrowRight /></button>
              </div>

              <div className="recent-quiz-card">
                <span className="card-label">{latestQuizResult ? `LATEST QUIZ: ${latestQuizResult.subject.toUpperCase()}` : 'YOUR QUIZ PROGRESS'}</span>
                <div className="score-layout">
                  <span className="score-caption">Score:</span>
                  <div className="score-ring" style={{ '--score-percent': `${latestQuizResult?.percentage || 0}%` }}>
                    <div><strong>{latestQuizResult?.score ?? '—'}</strong><span>/{latestQuizResult?.total ?? 12}</span></div>
                  </div>
                </div>
                <span className="score-footnote">{latestQuizResult ? `${latestQuizResult.percentage}% · ${latestQuizResult.percentage >= 50 ? 'Passed — well done!' : 'Keep practicing, you can do it!'}` : 'Complete a quiz to see your score here.'}</span>
              </div>

              <div className="answer-review">
                <div className="review-title"><span>Latest answers</span><span>{quizAnswers.length} reviewed</span></div>
                {quizAnswers.slice(-3).reverse().map((answer, index) => (
                  <div className="review-row" key={`${quizAnswers.length}-${index}`}>
                    <span className="review-question" title={answer.question}>{answer.question}</span>
                    <span className={`review-result ${answer.correct ? 'correct' : 'incorrect'}`}>
                      {answer.correct ? <FaCheckCircle /> : <FaCircle />}
                      {answer.correct ? 'Correct' : 'Incorrect'} <small>({answer.score})</small>
                    </span>
                  </div>
                ))}
              </div>
              <button className="text-action" onClick={() => openTab('Quizzes')}>Review all answers <FaArrowRight /></button>
            </section>

            <aside className="right-column">
              <section className="panel community-panel">
                <div className="community-heading">
                  <div>
                    <span className="panel-kicker">LEARN TOGETHER</span>
                    <h2>Community Learning Feed</h2>
                  </div>
                  <button className="icon-button light-action" aria-label="Open a community discussion" title="Open a discussion" onClick={() => setActiveFeedItem(feed[0]?.id || '')}><FaComment /></button>
                </div>
                {feedError && <p className="feed-note">{feedError}</p>}
                <div className="feed-content">
                  {feed.map((post) => (
                    <article className="feed-post" key={post.id}>
                      <button className="post-title" onClick={() => setActiveFeedItem(activeFeedItem === post.id ? '' : post.id)}>
                        <span className="post-avatar">M</span>
                        <span><strong>{post.title}</strong><small>{post.excerpt || 'Learning together, one question at a time.'}</small></span>
                        <FaEllipsisV className="post-more" />
                      </button>
                      <button className="reply-count" onClick={() => setActiveFeedItem(activeFeedItem === post.id ? '' : post.id)}>
                        <FaComment /> {post.replies || 0} replies <span>·</span> Join discussion
                      </button>
                      {activeFeedItem === post.id && <p className="discussion-preview">Share your ideas, compare approaches, and help a classmate understand the next step.</p>}
                      <div className="feed-questions">
                        {(post.questions || []).slice(0, 2).map((question, index) => (
                          <div className="feed-question" key={`${post.id}-${index}`}>
                            <span>{question.label}</span>
                            <span className={question.correct ? 'feed-correct' : 'feed-incorrect'}>
                              {question.correct ? <FaCheckCircle /> : <FaCircle />}
                              {question.correct ? 'Correct' : 'Incorrect'} <small>({question.score})</small>
                            </span>
                          </div>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="panel journey-panel">
                <div className="journey-heading">
                  <div>
                    <span className="panel-kicker">ONE STEP AT A TIME</span>
                    <h2>Your Learning Journey</h2>
                  </div>
                  <span className="journey-level">Level 2</span>
                </div>
                <div className="badge-row">
                  {journeyBadges.map(({ icon: Icon, label, color }, index) => (
                    <div className={`badge ${color}`} key={label} title={label}>
                      <span className="badge-medal"><Icon /></span>
                      <small>{index < 3 || score > 2 ? 'Earned' : 'Next'}</small>
                    </div>
                  ))}
                </div>
                <div className="journey-progress-label"><span>Learning path</span><strong>{progress}%</strong></div>
                <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
                <div className="journey-footer"><span><FaCheckCircle /> {score > 2 ? 'On a roll!' : 'Keep going'}</span><span>{quizAnswers.length} questions reviewed</span></div>
              </section>
            </aside>
          </section>
          </>
        )}

        {activeTab === 'AI Tutor' && (
          <section className="focused-view panel tutor-page">
            <div className="tutor-page-heading">
              <div className="tutor-page-title"><span className="focused-icon"><FaRobot /></span><div><span className="panel-kicker">YOUR PERSONAL LEARNING PARTNER</span><h2>Ask anything. Understand more.</h2><p>Get a clear answer, a step-by-step explanation, and examples you can use.</p></div></div>
              <div className="tutor-page-controls"><label htmlFor="tutor-page-subject">Study subject</label><select id="tutor-page-subject" value={subject} onChange={(event) => setSubject(event.target.value)}>{quizSubjects.map((item) => <option key={item}>{item}</option>)}</select><button className="clear-chat-button" onClick={() => setChatLog([{ sender: 'ai', text: 'Hello! I can help explain lessons, solve problems, or explore a new topic. What would you like to learn?' }])}><FaRedoAlt /> New chat</button></div>
            </div>
            <div className="tutor-prompts"><span>Try asking</span>{(subject === 'Shona' ? ['Tsanangura chirevo chetsumo.', 'Ndinganyora sei tsamba yepamutemo?', 'Ndeupi musiyano wezita nechiito?'] : [`Explain an important idea in ${subject}.`, `Show me an example problem in ${subject}.`, `Help me revise a topic in ${subject}.`]).map((prompt) => <button key={prompt} onClick={() => setQuery(prompt)}>{prompt}</button>)}</div>
            <div className="focused-chat tutor-chat" aria-live="polite">
              {chatLog.map((message, index) => <div className={`message-row ${message.sender}`} key={`focus-${index}`}><span className={`message-avatar ${message.sender === 'user' ? 'user-avatar' : ''}`}>{message.sender === 'user' ? <FaUser /> : <FaRobot />}</span><div className="message-bubble">{message.sender === 'ai' && <span className="message-label">{subject} · Learning support</span>}{message.text}</div></div>)}
              {loading && <div className="message-row"><span className="message-avatar"><FaRobot /></span><div className="message-bubble typing"><span /><span /><span /></div></div>}
            </div>
            <form className="chat-composer focused-composer tutor-page-composer" onSubmit={sendMessage}><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Ask a clear question about ${subject} or any topic...`} aria-label="Ask your AI tutor" /><button disabled={!query.trim() || loading} aria-label="Send question"><FaPaperPlane /></button></form>
            <p className="tutor-disclaimer">Check important facts with your teacher or textbook. Your tutor can make mistakes.</p>
          </section>
        )}

        {activeTab === 'Quizzes' && (
          <section className="focused-view panel quiz-view">
            {room && <section className="multiplayer-room"><div className="room-heading"><div><span className="panel-kicker">PLAY TOGETHER · {room.subject.toUpperCase()}</span><h2>{room.status === 'finished' ? `Winner: ${room.winner}` : room.status === 'lobby' ? 'Quiz room lobby' : `Question ${Math.min(room.questionIndex + 1, room.totalQuestions)} of ${room.totalQuestions}`}</h2></div><button className="quiz-exit" onClick={() => { setRoom(null); setRoomPlayerId(''); setRoomError(''); }}>Leave room</button></div>{room.status === 'lobby' && <><p className="room-invite">Share this code with friends on their own devices:</p><button className="room-code" onClick={() => navigator.clipboard?.writeText(room.code)} title="Copy room code">{room.code}</button><div className="room-player-list">{room.players.map((player) => <span key={player.id}><FaUser /> {player.name}{player.id === roomPlayerId ? ' (you)' : ''}</span>)}</div>{room.players.length >= 2 && room.players[0]?.id === roomPlayerId && <button className="primary-button" onClick={startRoom} disabled={roomBusy}><FaPlay /> Start together</button>}{room.players.length < 2 && <p className="room-wait">Waiting for at least one other player to join…</p>}</>}{room.status === 'playing' && room.question && <><div className="room-leaderboard live-leaderboard"><h3>Live standings</h3>{[...room.players].sort((a, b) => b.score - a.score).map((player, index) => <p key={player.id} className={player.id === roomPlayerId ? 'current-player' : ''}><strong>{index + 1}. {player.name}{player.id === roomPlayerId ? ' (you)' : ''}</strong><span>{player.score} pts</span></p>)}</div><h3 className="room-question">{room.question.question}</h3>{room.review && <div className={`room-review ${room.review.correct ? 'correct' : 'incorrect'}`}>{room.review.correct ? 'Correct!' : `Not quite. Correct answer: ${room.review.answer}`}</div>}{room.hasAnswered ? <p className="room-wait">Answer recorded. Waiting for the other players…</p> : <div className="quiz-options">{room.question.options.map((option) => <button key={option} disabled={roomBusy} onClick={() => submitRoomAnswer(option)}><span className="option-radio" />{option}</button>)}</div>}</>}{room.status === 'finished' && <><div className="room-winner-banner"><FaTrophy /><strong>{room.winner} wins the challenge!</strong><span>Final standings</span></div><div className="room-leaderboard"><h3>Final leaderboard</h3>{[...room.players].sort((a, b) => b.score - a.score).map((player, index) => <p key={player.id}><strong>{index + 1}. {player.name}{player.id === roomPlayerId ? ' (you)' : ''}</strong><span>{player.score} / {room.totalQuestions}</span></p>)}</div>{challengeBadge && <button className="badge-download-button" onClick={saveBadgeAsSvg}><FaTrophy /> Download {challengeBadge.name}’s winner badge</button>}</>}{roomError && <p className="room-error">{roomError}</p>}</section>}
            {!quizFinished && !quizStarted && (
              <div className="quiz-catalog">
                <div className="quiz-catalog-heading"><span className="focused-icon quiz-icon"><FaClipboardCheck /></span><div><span className="panel-kicker">PRACTICE & GROW</span><h2>Choose a revision test</h2><p>Choose any school subject or test what you learned in an extra course.</p></div></div>
                <div className="quiz-subject-filter"><label htmlFor="quiz-subject">Selected subject or course</label><select id="quiz-subject" value={quizSubject} onChange={(event) => { setQuizSubject(event.target.value); setQuizQuestions(createQuiz(event.target.value)); }}>
                  {allTestSubjects.map((item) => <option key={item}>{item}</option>)}
                </select></div>
                <div className="quiz-subject-grid">{allTestSubjects.map((item, index) => <button className={`quiz-subject-card ${quizSubject === item ? 'chosen' : ''}`} key={item} onClick={() => { setQuizSubject(item); setQuizQuestions(createQuiz(item)); }}><span className={`subject-symbol subject-${index % 6}`}><FaBookOpen /></span><span className="subject-card-copy"><strong>{item}</strong><small>{allQuizBank[item].length} questions in bank</small></span><FaArrowRight className="subject-card-arrow" /></button>)}</div>
                <div className="quiz-start-actions"><button className="primary-button quiz-start-button" onClick={() => startQuiz(quizSubject)}><FaPlay /> Start {quizSubject} quiz</button><button className="secondary-room-button" onClick={() => setShowRoomTools((visible) => !visible)}><FaUsers /> Play together</button></div>
                {showRoomTools && <div className="room-setup"><button className="primary-button" onClick={createRoom} disabled={roomBusy}><FaUsers /> {room ? 'Create a new challenge room' : `Create room for ${quizSubject}`}</button>{room && room.status === 'lobby' && <section className="peer-lobby"><h3>Invite classmates</h3><p>Choose who should receive an invite to this {quizSubject} challenge.</p>{students.length ? students.map((student) => <div className="peer-row" key={student.id}><span><FaUser /> {student.name}</span><button onClick={() => inviteClassmate(student.id)}>Invite</button></div>) : <p>No other student accounts are registered yet.</p>}{inviteError && <p className="room-error">{inviteError}</p>}</section>}{roomError && <p className="room-error">{roomError}</p>}</div>}
              </div>
            )}
            {!quizFinished && quizStarted && (
              <div className="quiz-active">
                <div className="focused-heading"><span className="focused-icon quiz-icon"><FaBookOpen /></span><div><span className="panel-kicker">{quizSubject.toUpperCase()} PRACTICE</span><h2>Question {currentQuestion + 1}</h2><p>Question {currentQuestion + 1} of {quizQuestions.length} · Choose the best answer.</p></div><button className="quiz-exit" onClick={() => { setQuizStarted(false); setQuizResponses([]); setCurrentQuestion(0); }}>Exit quiz</button></div>
                <div className="quiz-progress"><span style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }} /></div>
                <h3>{quizQuestions[currentQuestion].question}</h3>
                <div className="quiz-options">{quizQuestions[currentQuestion].options.map((option) => <button type="button" key={option} className={chosenAnswer === option ? 'selected' : ''} onClick={() => setChosenAnswer(option)}><span className="option-radio" />{option}</button>)}</div>
                <button className="primary-button" onClick={submitAnswer} disabled={!chosenAnswer}>{currentQuestion === quizQuestions.length - 1 ? 'Finish quiz' : 'Check answer'} <FaArrowRight /></button>
              </div>
            )}
            {quizFinished && latestQuizResult && (
              <div className="quiz-results">
                <div className={`result-banner ${latestQuizResult.percentage >= 50 ? 'passed' : 'needs-practice'}`}><span className="result-icon">{latestQuizResult.percentage >= 50 ? <FaCheckCircle /> : <FaLightbulb />}</span><div><span className="panel-kicker">{latestQuizResult.percentage >= 50 ? 'QUIZ PASSED' : 'KEEP PRACTICING'}</span><h2>{latestQuizResult.percentage >= 50 ? 'Great work!' : 'You’re building your skills.'}</h2><p>{latestQuizResult.subject} · {latestQuizResult.score} of {latestQuizResult.total} correct · {latestQuizResult.percentage}%</p></div><div className="result-percent">{latestQuizResult.percentage}<small>%</small></div></div>
                <div className="result-summary"><div><strong>{latestQuizResult.score}/{latestQuizResult.total}</strong><span>Score</span></div><div><strong>{latestQuizResult.percentage}%</strong><span>Percentage</span></div><div><strong>{latestQuizResult.percentage >= 50 ? 'Passed' : 'Not passed'}</strong><span>Result</span></div></div>
                {challengeBadge && <div className="winner-badge-preview"><div className="badge-seal"><FaTrophy /></div><div><span className="panel-kicker">PERSONALIZED WINNER BADGE</span><strong>{challengeBadge.name}</strong><span>{challengeBadge.subject} · {challengeBadge.score}/{challengeBadge.total}</span></div><button className="badge-download-button" onClick={saveBadgeAsSvg}>Download badge</button></div>}
                <div className="review-heading"><div><span className="panel-kicker">LEARN FROM EVERY ANSWER</span><h3>Question review</h3></div><button className="text-action" onClick={() => startQuiz(quizSubject)}><FaRedoAlt /> Try another set</button></div>
                <div className="detailed-review">{quizResponses.map((answer, index) => <article className={`detailed-review-item ${answer.correct ? 'correct' : 'incorrect'}`} key={answer.id}><div className="detailed-review-title"><span>Question {index + 1}</span><strong>{answer.correct ? 'Correct' : 'Incorrect'}</strong></div><p>{answer.question}</p><div className="review-answer-line"><span>Your answer</span><strong>{answer.selected}</strong></div>{!answer.correct && <div className="review-answer-line correct-answer"><span>Correct answer</span><strong>{answer.answer}</strong></div>}<p className="answer-explanation">{answer.explanation}</p></article>)}</div>
              </div>
            )}
          </section>
        )}

        {activeTab === 'Resources' && (
          <section className="focused-view panel resources-view">
            <div className="resources-header"><span className="focused-icon quiz-icon"><FaBookOpen /></span><div><span className="panel-kicker">READ · REVISE · PRACTICE</span><h2>Syllabus study notes</h2><p>Choose a subject and review topic notes aligned to its syllabus areas.</p></div></div>
            <div className="resources-layout">
              <aside className="resource-subject-list" aria-label="Subjects">
                {schoolSubjects.map((item) => <button key={item} className={resourceSubject === item ? 'active' : ''} onClick={() => { setResourceSubject(item); setActiveTopic(''); setExerciseChoice(''); setExerciseResult(''); }}><FaBookOpen /><span>{item}</span></button>)}
              </aside>
              <div className="notes-content">
                <div className="notes-title-row"><div><span className="panel-kicker">{resourceSubject.toUpperCase()}</span><h3>{resourceSubject} notes</h3></div><button className="primary-button" onClick={() => { startQuiz(resourceSubject); openTab('Quizzes'); }}><FaClipboardCheck /> Take revision test</button></div>
                <div className="notes-list">{(allLearningNotes[resourceSubject] || []).map((item, index) => { const exercise = getTopicExercise(resourceSubject, item.topic, index); const noteKey = `${resourceSubject}:${item.topic}`; return <article className={`note-card ${activeTopic === item.topic ? 'expanded' : ''}`} key={item.topic}><button className="note-topic-button" onClick={() => { setActiveTopic(activeTopic === item.topic ? '' : item.topic); setExerciseChoice(''); setExerciseResult(''); setNotesError(''); }}><span className="note-number">{String(index + 1).padStart(2, '0')}</span><span><h4>{item.topic}</h4><small>{item.syllabus}</small></span><FaChevronDown /></button>{activeTopic === item.topic && <div className="topic-detail"><p>{item.note}</p><button className="generate-notes-button" disabled={generatingTopic === noteKey} onClick={() => generateNotesForTopic(item)}><FaRobot /> {generatingTopic === noteKey ? 'Generating study notes…' : generatedNotes[noteKey] ? 'Regenerate AI study notes' : 'Generate detailed AI notes'}</button>{notesError && <p className="notes-error">{notesError}</p>}{generatedNotes[noteKey] && <article className="generated-notes"><h5>AI-generated study notes · {item.topic}</h5><p>{generatedNotes[noteKey]}</p><small>AI-generated for study support; verify syllabus details with your teacher.</small></article>}{exercise ? <div className="topic-exercise"><span className="panel-kicker">CHECK YOUR UNDERSTANDING</span><p>{exercise.question}</p><div className="exercise-options">{exercise.options.map((option) => <button key={option} className={exerciseChoice === option ? 'selected' : ''} onClick={() => { setExerciseChoice(option); setExerciseResult(''); }}>{option}</button>)}</div><button className="primary-button" disabled={!exerciseChoice} onClick={() => setExerciseResult(exerciseChoice === exercise.answer ? 'correct' : 'incorrect')}>Check exercise</button>{exerciseResult && <p className={`exercise-feedback ${exerciseResult}`}>{exerciseResult === 'correct' ? 'Correct — ' : 'Not quite — '}{exercise.explanation}</p>}</div> : <p className="exercise-placeholder">Read this topic, then try the full subject revision test to check your understanding.</p>}</div>}</article>; })}</div>
                {paperTwoPrompts[resourceSubject] && <section className="paper-two-section"><span className="panel-kicker">WRITE YOUR OWN ANSWERS</span><h3>{resourceSubject} · Extended responses</h3><p>These are open practice prompts. No answer is displayed so students can work them out themselves.</p>{paperTwoPrompts[resourceSubject].map((item) => <article className="paper-prompt" key={item.title}><h4>{item.title}</h4><p>{item.prompt}</p><textarea value={paperDrafts[item.title] || ''} onChange={(event) => setPaperDrafts((drafts) => ({ ...drafts, [item.title]: event.target.value }))} placeholder={item.type === 'essay' || item.type === 'comprehension' ? 'Write your response here…' : 'Show your working here…'} aria-label={`Your response for ${item.title}`} /><span className="draft-status">{(paperDrafts[item.title] || '').trim() ? 'Draft stays in this browser session.' : 'Write your own response before checking with a teacher or marking guide.'}</span></article>)}</section>}
              </div>
            </div>
            <section className="courses-section">
              <div className="courses-heading"><div><span className="panel-kicker">LEARN SOMETHING NEW</span><h3>Extra courses</h3><p>Short beginner-friendly courses beyond school subjects.</p></div><FaGraduationCap /></div>
              <div className="extra-course-grid">{allExtraCourses.map((course) => <article className="extra-course-card" key={course.title}><span className="course-tag">{course.level}</span><h4>{course.title}</h4><p>{course.description}</p><button className="text-action" onClick={() => setExpandedCourse(expandedCourse === course.title ? '' : course.title)}>{expandedCourse === course.title ? 'Hide course plan' : 'Read lessons & assignments'} <FaArrowRight /></button>{expandedCourse === course.title && <div className="course-lessons">{course.modules.map((module, index) => typeof module === 'string' ? <div className="course-lesson" key={module}><strong>Module {index + 1}: {module}</strong><p>Study this module, take notes, and discuss what you learned with a teacher or classmate.</p></div> : <div className="course-lesson" key={module.title}><strong>Module {index + 1}: {module.title}</strong><p>{module.lesson}</p><label htmlFor={`assignment-${course.title}-${index}`}>Assignment</label><p className="assignment-prompt">{module.assignment}</p><textarea id={`assignment-${course.title}-${index}`} value={courseAssignment[`${course.title}:${module.title}`] || ''} onChange={(event) => setCourseAssignment((assignments) => ({ ...assignments, [`${course.title}:${module.title}`]: event.target.value }))} placeholder="Write your assignment response…" /><button className="assignment-save" onClick={() => submitCourseAssignment(course.title, module.title)}>Save assignment draft</button>{savedAssignments.includes(`${course.title}:${module.title}`) && <span className="assignment-saved">Draft saved in this browser session.</span>}</div>)}</div>}{completedCourses.includes(course.title) ? <div className="course-unlock"><FaTrophy /><strong>Course winner badge earned · 80%+</strong><span>Opportunity guide unlocked</span><a href="https://www.uncommon.org/" target="_blank" rel="noreferrer">Visit uncommon.org to learn about post-school opportunities <FaArrowRight /></a></div> : <div className="course-locked"><FaTrophy /><span>Earn the winner badge with 80% or higher on the course revision test. This unlocks the uncommon.org opportunity link.</span></div>}<button className="course-test-button" onClick={() => { startQuiz(course.title); openTab('Quizzes'); }}>Take course revision test <FaArrowRight /></button></article>)}</div>
            </section>
          </section>
        )}

        {activeTab === 'Courses' && (
          <section className="focused-view panel courses-page">
            <div className="resources-header"><span className="focused-icon"><FaGraduationCap /></span><div><span className="panel-kicker">BUILD A NEW SKILL</span><h2>Extra learning courses</h2><p>Explore coding and web skills at your own pace.</p></div></div>
            <div className="extra-course-grid courses-page-grid">{allExtraCourses.map((course) => <article className="extra-course-card" key={course.title}><span className="course-tag">{course.level}</span><h4>{course.title}</h4><p>{course.description}</p><button className="primary-button" onClick={() => setExpandedCourse(expandedCourse === course.title ? '' : course.title)}>{expandedCourse === course.title ? 'Close course plan' : 'Explore course'} <FaArrowRight /></button>{expandedCourse === course.title && <div className="course-lessons">{course.modules.map((module, index) => typeof module === 'string' ? <div className="course-lesson" key={module}><strong>Module {index + 1}: {module}</strong><p>Study the topic, take notes, and discuss your learning with a teacher or classmate.</p></div> : <div className="course-lesson" key={module.title}><strong>Module {index + 1}: {module.title}</strong><p>{module.lesson}</p><label htmlFor={`course-assignment-${index}`}>Assignment</label><p className="assignment-prompt">{module.assignment}</p><textarea value={courseAssignment[`${course.title}:${module.title}`] || ''} onChange={(event) => setCourseAssignment((assignments) => ({ ...assignments, [`${course.title}:${module.title}`]: event.target.value }))} placeholder="Write your assignment response…" /><button className="assignment-save" onClick={() => submitCourseAssignment(course.title, module.title)}>Save assignment draft</button></div>)}</div>}{completedCourses.includes(course.title) ? <div className="course-unlock"><FaTrophy /><strong>Course winner badge earned · 80%+</strong><span>Opportunity guide unlocked</span><a href="https://www.uncommon.org/" target="_blank" rel="noreferrer">Visit uncommon.org <FaArrowRight /></a></div> : <div className="course-locked"><FaTrophy /><span>Score at least 80% on the course test to earn the winner badge and unlock the opportunity link.</span></div>}<button className="course-test-button" onClick={() => { startQuiz(course.title); openTab('Quizzes'); }}>Take course revision test <FaArrowRight /></button></article>)}</div>
          </section>
        )}

        {activeTab === 'Profile' && (
          <section className="focused-view panel simple-view profile-view"><button className="profile-photo-button" onClick={() => profileImageInput.current?.click()} aria-label="Upload profile photo">{profilePhoto ? <img src={profilePhoto} alt="Your profile" /> : <span className="large-avatar"><FaUser /></span>}<span className="photo-edit"><FaImage /> Change photo</span></button><input ref={profileImageInput} className="visually-hidden" type="file" accept="image/*" onChange={loadProfilePhoto} /><span className="panel-kicker">YOUR LEARNING PROFILE</span><h2>{session.user.name}</h2><p>{session.user.email} · Building a learning habit one day at a time.</p><div className="profile-stats"><div><strong>{quizAnswers.length}</strong><span>Answers reviewed</span></div><div><strong>{score}/{quizAnswers.length}</strong><span>Correct answers</span></div><div><strong>2</strong><span>Learning level</span></div></div>{earnedBadges.length > 0 && <div className="profile-badges"><span className="panel-kicker">EARNED BADGES</span><div className="badge-grid">{earnedBadges.map((badge, index) => <div className="profile-badge" key={index} title={badge.label}><span className="profile-badge-icon" style={{ color: badge.color === 'gold' ? '#b97d25' : badge.color === 'green' ? '#2e7d32' : badge.color === 'blue' ? '#1565c0' : '#80561f' }}><badge.icon /></span><div className="profile-badge-copy"><strong>{badge.label}</strong><p>{badge.subject} · {badge.score}/{badge.total} correct</p></div></div>)}</div></div>}<button className="logout-button" onClick={logout}>Log out</button></section>
        )}
      </main>
      <footer className="app-footer"><BrandMark /><span>madirenLearn AI</span><span className="footer-separator">·</span><span>Learning, made personal.</span><span className="footer-status"><FaCircle /> All progress saved</span></footer>
    </div>
  );
}

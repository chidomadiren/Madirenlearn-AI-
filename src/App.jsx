import React from 'react';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <aside className="sidebar">
        <div className="sidebar-brand">Study space</div>
        <nav className="sidebar-nav">
          <button className="sidebar-tab active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 6l2-2m-2-2v-10a1 1 0 011-1h3m6-6l2 2m-2 2v-10a1 1 0 01-1-1h-3"/><rect x="3" y="3" width="7" height="7"/><path d="M7 7h10a2 2 0 012 2v5"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>Dashboard
          </button>
          <button className="sidebar-tab"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>AI Tutor</button>
          <button className="sidebar-tab"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8l8 4 8-4z"/></svg>Quizzes</button>
          <button className="sidebar-tab"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/></svg>Resources</button>
          <button className="sidebar-tab"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/></svg>Profile</button>
        </nav>
        <div className="quick-links">
          <div className="quick-links-title">REVISION TESTS</div>
          <div className="quick-links-list">
            <button className="quick-link">Shona</button>
            <button className="quick-link">Mathematics</button>
            <button className="quick-link">English</button>
            <button className="quick-link">Combined Science</button>
          </div>
        </div>
        <button className="sign-out">Sign out</button>
      </aside>
      <main className="main-content">
        <div className="dashboard">
          <section className="welcome-section">
            <div className="welcome-header">
              <div className="welcome-title">
                <h1>Small steps. Big understanding.</h1>
                <p>Your personalized learning companion</p>
              </div>
              <div className="welcome-image"><img src="https://images.unsplash.com/photo-1503676030876-abc0d07e5f75?w=600&h=400&fit=crop" alt="Study room" /></div>
            </div>
            <div className="ai-tutor-chat">
              <div className="chat-header">
                <div className="chat-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.77-7.77m5.18 5.17a5.5 5.5 0 1 1-7.77 7.77m8.48-3.54a2.12 2.12 0 0 1-2.97 0M15 7a3 3 0 01-3 3v4a3 3 0 01-3 3m3-3a3 3 0 00-3-3v-4a3 3 0 00-3 3m3-3H6m3 3a3 3 0 100 6m3-3a3 3 0 11-6 0"/></svg>
                  <span>Your AI Socratic Tutor</span>
                </div>
                <div className="online-indicator"><span className="dot"></span>Online</div>
              </div>
              <div className="messages-container">
                <div className="message ai"><p>Hello! I'm your AI Socratic Tutor. I'm here to help you learn step-by-step. What would you like to study today?</p></div>
              </div>
              <div className="input-composer">
                <input type="text" placeholder="Type your message..." />
                <button>Send</button>
              </div>
            </div>
          </section>
          <aside className="right-sidebar">
            <div className="card assessment-review">
              <h4>Assessment Review</h4>
              <p>Recent Quiz Performance</p>
              <div className="progress-bar"><div className="progress-fill" /></div></div>
              <p>Score: 87%</p>
              <p>Last attempt: 2 days ago</p>
            </div>
            <div className="card">
              <h4>Community Learning Feed</h4>
              <div className="feed-post"><span className="author">Alex Johnson</span><span className="content">Just completed the Mathematics quiz! Great job everyone! 🎉</span></div>
              <div className="feed-post"><span className="author">Sam Smith</span><span className="content">Need help with Algebra - anyone online?</span></div>
              <div className="feed-post"><span className="author">TeachBot</span><span className="content">New discussion posted: Effective study techniques that work</span></div>
            </div>
            <div className="card">
              <h4>Your Learning Journey</h4>
              <div className="journey-badges"><div className="badge">🟢</div><div className="badge">🟢</div><div className="badge">🟡</div><div className="badge">🟢</div><div className="badge">🟢</div></div>
              <p>Progress: 65%</p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default App;
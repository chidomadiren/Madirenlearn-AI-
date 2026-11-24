import React, { useEffect, useState } from 'react';

export function DashboardMobileMenu({
  studyTabs = ['Dashboard', 'AI Tutor', 'Quizzes', 'Resources', 'Profile'],
  revisionSubjects = ['Shona', 'Mathematics', 'English', 'Combined Science'],
  activeTab = 'Dashboard',
  activeSubject = '',
  onSelectTab,
  onSelectSubject,
  onSignOut,
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTabClick = (tab) => {
    setOpen(false);
    if (typeof onSelectTab === 'function') {
      onSelectTab(tab);
    }
  };

  const handleSubjectClick = (subject) => {
    setOpen(false);
    if (typeof onSelectSubject === 'function') {
      onSelectSubject(subject);
    }
  };

  return (
    <div className="ml-dash-menu-wrapper">
      <button
        type="button"
        className="ml-hamburger-btn"
        aria-label={open ? 'Close dashboard menu' : 'Open dashboard menu'}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? '✕' : '☰'}
      </button>

      {open && (
        <div className="ml-dash-drawer" role="dialog" aria-label="Dashboard Navigation">
          <div className="ml-dash-drawer-header">
            <span className="ml-dash-drawer-title">Study Space &amp; Revision</span>
            <button
              type="button"
              className="ml-mobile-close-btn"
              aria-label="Close dashboard menu"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="ml-dash-section">
            <div className="ml-dash-section-label">STUDY SPACE</div>
            <div className="ml-dash-link-group">
              {studyTabs.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    className={`ml-dash-link-btn ${isActive ? 'is-active' : ''}`}
                    onClick={() => handleTabClick(tab)}
                  >
                    <span>{tab}</span>
                    <span>→</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="ml-dash-section">
            <div className="ml-dash-section-label">REVISION TESTS</div>
            <div className="ml-dash-link-group">
              {revisionSubjects.map((subject) => {
                const isActive = activeSubject === subject;
                return (
                  <button
                    key={subject}
                    type="button"
                    className={`ml-dash-link-btn ${isActive ? 'is-active' : ''}`}
                    onClick={() => handleSubjectClick(subject)}
                  >
                    <span>{subject}</span>
                    <span>→</span>
                  </button>
                );
              })}
            </div>
          </div>

          {typeof onSignOut === 'function' && (
            <button
              type="button"
              className="ml-dash-signout-btn"
              onClick={() => {
                setOpen(false);
                onSignOut();
              }}
            >
              Sign out
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default DashboardMobileMenu;

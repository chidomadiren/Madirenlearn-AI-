const getCommunityFeed = (req, res) => {
  res.json({
    posts: [
      {
        id: 'quadratic-equations',
        title: 'Discussing Quadratic Equations',
        excerpt: 'Students are sharing ways to solve quadratic equations.',
        replies: 3,
        questions: [
          { label: 'Q1: (Shona Q)...', correct: true, score: '1/1' },
          { label: 'Q2: (Shona Q)...', correct: false, score: '0/1' },
        ],
      },
    ],
  });
};

module.exports = { getCommunityFeed };

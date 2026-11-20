export const learningNotes = {
  Mathematics: [
    { topic: 'Number and operations', syllabus: 'Integers, fractions, decimals, percentages, ratio and proportion.', note: 'Use place value to compare decimals. Convert a percentage to a fraction over 100 or a decimal before calculating. For a ratio, make sure quantities are in the same units before simplifying.' },
    { topic: 'Algebra', syllabus: 'Expressions, linear equations, formulae, sequences and factorisation.', note: 'Collect like terms, apply the same operation to both sides of an equation, and check a solution by substitution. In sequences, identify the rule linking one term to the next.' },
    { topic: 'Geometry and measurement', syllabus: 'Angles, polygons, perimeter, area, volume, constructions and scale.', note: 'Write the correct unit with every measurement. Angles on a straight line total 180°, around a point total 360°, and angles in a triangle total 180°.' },
    { topic: 'Statistics and probability', syllabus: 'Data collection, averages, charts, spread and chance.', note: 'Mean = total ÷ number of values; median is the middle after ordering; mode is the most frequent. Probability ranges from 0 (impossible) to 1 (certain).' },
  ],
  English: [
    { topic: 'Comprehension and summary', syllabus: 'Reading for main ideas, inference, vocabulary in context and concise summaries.', note: 'Read the question first, find evidence in the passage, and answer in your own words. A summary keeps only the main points and removes repetition and examples.' },
    { topic: 'Grammar and language', syllabus: 'Parts of speech, sentence structure, tense, agreement, punctuation and direct speech.', note: 'Check that every sentence has a subject and a verb. Match singular subjects with singular verbs, keep tense consistent, and use punctuation to make meaning clear.' },
    { topic: 'Composition', syllabus: 'Narrative, descriptive, argumentative and transactional writing.', note: 'Plan an opening, ordered paragraphs and a clear ending. Use specific details, connectives and varied sentence lengths; proofread spelling, punctuation and paragraphing.' },
    { topic: 'Literature', syllabus: 'Character, setting, theme, plot, imagery, tone and evidence from a text.', note: 'Support each interpretation with a short quotation or precise detail. Explain how the writer’s word choice creates an effect rather than merely naming a device.' },
  ],
  Shona: [
    { topic: 'Nzwisiso', syllabus: 'Kuverenga ndima, kutsvaga pfungwa huru, dudziro yemashoko uye humbowo.', note: 'Verenga mubvunzo zvakanaka, wotsvaga mhinduro mundima. Nyora nemashoko ako uye shandisa humbowo hwuri mundima kutsigira mhinduro.' },
    { topic: 'Girama nemapoka emashoko', syllabus: 'Mazita, zviito, zvirevo, zvipauro, zvirevamwene uye kuumbwa kwemitsara.', note: 'Zita rinodoma munhu, nzvimbo kana chinhu; chiito chinoratidza zvinoitwa. Ongorora kubvumirana kwemazita nezviito uye kurongeka kwemashoko mumutsara.' },
    { topic: 'Tsumo nezvirahwe', syllabus: 'Kududzira tsumo, zvirahwe, madimikira uye zvidzidzo zvazvo.', note: 'Tsumo inopa uchenjeri kana chidzidzo. Dudzira zvinorehwa nemashoko acho uye tsanangura kuti anoshandiswa sei mumamiriro ezvinhu.' },
    { topic: 'Kunyora', syllabus: 'Tsamba, rondedzero, hurukuro, pfupiso uye kuronga ndima.', note: 'Sarudza chimiro chinoenderana nerudzi rwekunyora. Ronga pfungwa dzako, shandisa ndima dzakatevedzana, uye ongorora zviperengo nezviratidzo zvekunyora.' },
  ],
  'Combined Science': [
    { topic: 'Biology: cells and life processes', syllabus: 'Cell structure, nutrition, photosynthesis, respiration, transport and ecology.', note: 'Cells are the basic units of life. Photosynthesis uses light energy, carbon dioxide and water to make glucose and oxygen. Link structure to function when describing organs and systems.' },
    { topic: 'Chemistry: matter and reactions', syllabus: 'Particles, elements, compounds, mixtures, acids, bases and chemical change.', note: 'Elements contain one type of atom; compounds contain chemically joined elements. In a chemical reaction atoms are rearranged, so total mass is conserved in a closed system.' },
    { topic: 'Physics: energy and forces', syllabus: 'Motion, forces, work, energy transfer, electricity, waves and measurement.', note: 'A force can change speed, direction or shape. Energy is transferred between stores; it is not created or destroyed. Include units and show working in calculations.' },
    { topic: 'Scientific investigation', syllabus: 'Variables, fair tests, observations, tables, graphs, conclusions and safety.', note: 'Change one independent variable, measure the dependent variable, and keep control variables constant. Repeat measurements when possible and base conclusions on recorded evidence.' },
  ],
  Commerce: [
    { topic: 'Business and entrepreneurship', syllabus: 'Business aims, stakeholders, ownership, entrepreneurship and business environments.', note: 'Businesses combine resources to provide goods or services. Compare ownership types by control, liability, continuity and how capital is raised.' },
    { topic: 'Bookkeeping and documents', syllabus: 'Source documents, cash books, ledgers, trial balances and financial statements.', note: 'Keep source documents as evidence of transactions. Record each transaction consistently and use totals to check arithmetic before preparing statements.' },
    { topic: 'Marketing and trade', syllabus: 'Market research, product, price, place, promotion, consumers and trade.', note: 'Marketing identifies customer needs and communicates how a product meets them. Consider the target market, competition and the four Ps when planning a strategy.' },
    { topic: 'Finance and production', syllabus: 'Costs, revenue, profit, sources of finance, production and productivity.', note: 'Revenue is sales income; profit is revenue minus total costs. Separate fixed costs from variable costs and compare finance sources by cost, risk and repayment terms.' },
  ],
  Geography: [
    { topic: 'Map skills and fieldwork', syllabus: 'Scale, direction, grid references, symbols, cross-sections and data collection.', note: 'Use the map key and scale before interpreting features. A fieldwork conclusion should answer the enquiry question and be supported by observations or measurements.' },
    { topic: 'Weather and climate', syllabus: 'Weather instruments, climate graphs, rainfall, temperature and climate controls.', note: 'Weather is short-term atmospheric condition; climate is the long-term average. Read graph axes and units carefully and compare seasonal patterns using data.' },
    { topic: 'Physical processes', syllabus: 'Rocks, weathering, erosion, rivers, coasts, soils and natural hazards.', note: 'Weathering breaks material down in place, while erosion transports it. Explain landforms through the processes that create them and the conditions that influence those processes.' },
    { topic: 'Human and economic geography', syllabus: 'Population, settlement, migration, urbanisation, resources and development.', note: 'Explain patterns using push and pull factors, access to services, jobs and resources. Evaluate impacts on people, the economy and the environment.' },
  ],
};

export const extraCourses = [
  { title: 'Coding foundations', level: 'Beginner', description: 'Learn variables, conditions, loops and functions by building small interactive projects.', modules: [
    { title: 'How programs work', lesson: 'A program is a set of instructions a computer follows. Programmers break a task into small steps, describe inputs and expected outputs, then test the result and fix errors.', assignment: 'Write clear steps for a simple task such as calculating the total cost of three items.' },
    { title: 'Variables and data', lesson: 'Variables give names to values a program uses. Values can be numbers, text or true/false data. Choose names that describe what they contain and update them when the program changes.', assignment: 'Plan three variables for a school club registration program and state the type of information each stores.' },
    { title: 'Decisions and loops', lesson: 'Conditions let programs choose actions based on information. Loops repeat steps, for example until a list is processed or a condition becomes false. Check loop conditions to avoid endless repetition.', assignment: 'Write pseudocode for a program that asks for a mark and reports whether it meets a pass mark.' },
    { title: 'Functions and mini-project', lesson: 'Functions group reusable steps under a name. They can accept inputs and return a result. Splitting a project into small functions makes it easier to understand, test and improve.', assignment: 'Design a small quiz program with a question function, answer check and score counter.' },
  ] },
  { title: 'Web design with HTML & CSS', level: 'Beginner', description: 'Create a simple web page and style it for phones and computers.', modules: [
    { title: 'HTML page structure', lesson: 'HTML elements describe page content and its structure. Use headings in a logical order, paragraphs for text and semantic sections for related content.', assignment: 'Outline the HTML sections for a one-page profile about a school club.' },
    { title: 'Text, links and images', lesson: 'Links help people move between useful pages; images need meaningful alternative text when they convey information. Write link text that describes its destination.', assignment: 'Draft a short page with a heading, paragraph, two descriptive links and an image description.' },
    { title: 'CSS colours and layout', lesson: 'CSS controls visual presentation such as colour, spacing, typography and layout. Consistent spacing and readable contrast make a page easier to use.', assignment: 'Choose a colour palette and spacing plan for your club page and explain why the text remains readable.' },
    { title: 'Responsive page project', lesson: 'Responsive design allows content to adapt to different screen widths. Flexible layouts and media queries can make navigation and text comfortable on phones and larger screens.', assignment: 'Sketch the same page layout at phone and desktop sizes and note two layout changes.' },
  ] },
  { title: 'Python problem solving', level: 'Beginner', description: 'Practice logical thinking and write small Python programs.', modules: [
    { title: 'Print and input', lesson: 'A Python program can display information with print() and collect typed text with input(). Input is text by default, so convert it to a number before doing arithmetic.', assignment: 'Plan a program that asks for a learner’s name and greets them.' },
    { title: 'Numbers and strings', lesson: 'Numbers support calculations; strings hold text. Keep track of data types and convert values when needed. Use descriptive variable names and test examples.', assignment: 'Write pseudocode to ask for two prices and display their sum.' },
    { title: 'If statements', lesson: 'An if statement checks a condition and runs code only when that condition is true. Add else or elif branches for other outcomes and test boundary values.', assignment: 'Design a mark checker that reports “pass” when a mark is at least 50 and “practice more” otherwise.' },
    { title: 'Loops and lists', lesson: 'Lists hold ordered collections of values. Loops can visit each item in a list or repeat while a condition remains true. Use a clear stopping condition.', assignment: 'Plan a program that stores five quiz marks in a list and calculates their total.' },
  ] },
];

export const courseQuizBank = {
  'Coding foundations': [
    { question: 'What is a variable used for in a program?', options: ['To store a value', 'To turn off the computer', 'To draw every image', 'To connect a keyboard'], answer: 'To store a value', explanation: 'A variable is a named place to store data that a program can use.' },
    { question: 'Which structure lets a program choose between different actions?', options: ['A condition', 'A comment', 'A file name', 'A font'], answer: 'A condition', explanation: 'A condition checks whether something is true and chooses an action.' },
    { question: 'What does a loop help a program do?', options: ['Repeat instructions', 'Erase its source code', 'Change the screen size', 'Rename the computer'], answer: 'Repeat instructions', explanation: 'A loop repeats a block of instructions while a rule or condition allows it.' },
    { question: 'What is a function?', options: ['A reusable block of instructions', 'A type of monitor', 'A folder icon', 'A computer cable'], answer: 'A reusable block of instructions', explanation: 'Functions package instructions so they can be called and reused.' },
  ],
  'Web design with HTML & CSS': [
    { question: 'What is HTML mainly used to describe?', options: ['The structure and content of a web page', 'The computer battery', 'A network password', 'A video camera'], answer: 'The structure and content of a web page', explanation: 'HTML uses elements to structure page content such as headings, paragraphs and links.' },
    { question: 'What is CSS used for?', options: ['Styling a web page', 'Storing a website password', 'Sending email', 'Editing audio'], answer: 'Styling a web page', explanation: 'CSS controls visual presentation such as colours, spacing and layout.' },
    { question: 'Which HTML element creates a link?', options: ['<a>', '<p>', '<h1>', '<img>'], answer: '<a>', explanation: 'The anchor element <a> creates a link, commonly using an href attribute.' },
    { question: 'What does responsive design help a page do?', options: ['Adapt to different screen sizes', 'Play sound louder', 'Store more files', 'Load without HTML'], answer: 'Adapt to different screen sizes', explanation: 'Responsive layouts adjust to different devices and viewport dimensions.' },
  ],
  'Python problem solving': [
    { question: 'Which Python function displays text in the console?', options: ['print()', 'showText()', 'writeScreen()', 'echoText()'], answer: 'print()', explanation: 'print() writes text or values to the console.' },
    { question: 'Which keyword begins a conditional branch in Python?', options: ['if', 'repeat', 'choose', 'when'], answer: 'if', explanation: 'Python uses if followed by a condition to choose whether code runs.' },
    { question: 'Which data structure stores an ordered collection that can be changed?', options: ['List', 'Integer', 'Boolean', 'Comment'], answer: 'List', explanation: 'A Python list stores ordered items and can be modified.' },
    { question: 'What does input() do in a simple Python program?', options: ['Reads text entered by the user', 'Prints a picture', 'Deletes a variable', 'Repeats a loop automatically'], answer: 'Reads text entered by the user', explanation: 'input() pauses for the user to type and returns the entered text.' },
  ],
};

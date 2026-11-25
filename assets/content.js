/* All words on the site live here. Rules: no results, no sample sizes. Unpublished work shows the question and the method only, in broad terms. */
window.PF = (function () {
  var WF = 'https://sukrit-bhatnagar.webflow.io';
  var RESUME = 'https://drive.google.com/file/d/15u1lStKXl4i5dh7VtCrX8WYE9dYWXqDZ/view?usp=sharing';
  // Fill these in after the apps are deployed. While null, each tool says "live app coming soon".
  var APPS = { sempathy: null, cleome: null, distill: null };
  var SOURCE = { github: null };

  var factors = [
    { name: 'Design', key: 'design', lav: 'design', col: '#FF8A4C',
      desc: 'Visual identities, pitch decks and a game, from brief to finished piece.',
      ind: [
        { id: 'helloHR', n: ['HelloHR', 'pitch deck'], title: 'HelloHR pitch deck', status: 'Client work',
          role: 'I built the deck and shaped the ideas for winning this client over.',
          plain: 'A pitch deck for a hiring-technology company. I started with the story, then built the slides around it, in a green-blue and brown-sugar palette that reads professional and warm.',
          nerd: 'Narrative arc, slide system and palette for a recruitment-technology pitch.', tag: 'pitch deck', url: WF + '/work/hello-hr', urlLabel: 'See the project' },
        { id: 'jivisha', n: ['Jivisha', 'Foundation'], title: 'Jivisha Foundation', status: '2022 to 2026',
          role: 'Creative design specialist.',
          plain: 'A student mental-health NGO has to look like a safe place before anyone reads a word. I used soft pastels and organic shapes for the campaigns and teaching material, which have reached more than 10,000 students through partner schools and colleges.',
          nerd: 'Identity system, campaigns and educational material.', tag: 'identity', url: WF + '/work/jivisha-foundation', urlLabel: 'See the project' },
        { id: 'lovebytes', n: ['LoveBytes', 'game'], title: 'LoveBytes', status: 'Team project',
          role: 'I worked on the research behind it and on building it.',
          plain: 'A video game that tries to prevent dating violence among teenagers. It is grounded in peer-reviewed research from India and culturally validated measures, and it links players to support services.',
          nerd: 'A preventive intervention built on published adolescent research from India.', tag: 'game', url: WF + '/work/lovebytes', urlLabel: 'See the project' }
      ],
      more: [
        { title: 'CampusArmy', desc: 'A bold visual identity for a platform that connects businesses with college students. Blue for trust, grey for polish, orange for energy, plus animated assets.', url: WF + '/work/campus-army' },
        { title: 'Pankh', desc: 'A visual story for a food-delivery startup that employs specially-abled delivery partners, in bright and uplifting colours.', url: WF + '/work/pankh' }
      ] },

    { name: 'Original research', key: 'research', lav: 'research', col: '#7B8DFF',
      desc: 'Questions about help-seeking, parenting, emotion regulation and substance use, asked in Indian samples.',
      ind: [
        { id: 'thesis', n: ['Thesis', 'help-seeking'], title: 'Help-seeking thesis', status: 'Honours thesis, 2026', clip: 'thesis',
          role: 'My capstone thesis at Ashoka University.',
          plain: 'Why do some young people reach out for mental health help and others do not, even when they want to? My thesis was an attempt to test the integrated behavioural model of mental health help-seeking (IBM-HS; Hammer et al., 2024), which separates what people believe about seeking help, what they intend, and what they do. At the end of the survey, participants could choose to see their distress score or get contact details for free support, so the last step was real.',
          nerd: 'Web survey with a planned-missingness design. Implicit stigma from a single-category IAT scored with a racing diffusion model. SEM with WLSMV for ordinal items, and latent moderation for the intention-to-behaviour link.', tag: 'IBM-HS', url: 'https://dx.doi.org/10.1037/cou0000754', urlLabel: 'The model paper (Hammer et al., 2024)' },
        { id: 'substanceNet', n: ['Substance', 'use network'], title: 'Substance use network', status: 'In progress',
          role: 'I led the analysis, helped collect the data and drafted most of the paper.',
          plain: 'Substance use rarely travels alone. I map how drug-use problems, low mood and anxiety connect, symptom by symptom, and which symptoms bridge them. The questionnaires are in Hindi, and the adults come from community and treatment-seeking settings.',
          nerd: 'Regularized partial-correlation networks, bridge centrality, bootstrapped stability, and a directed-graph layer on top.', tag: 'undirected networks', url: null },
        { id: 'negParenting', n: ['Negative', 'parenting'], title: 'Parenting and emotion regulation', status: 'In progress',
          role: 'I run the analysis.',
          plain: 'How do emotions and parenting fit together in how teenagers are doing? I am analysing an adolescent sample to find out.',
          nerd: 'Structural equation modelling with latent variables, including latent moderation.', tag: 'lavaan', url: null },
        { id: 'dersNet', n: ['DERS', 'network'], title: 'DERS network', status: 'Manuscript in preparation',
          role: 'I ran most of the analysis and wrote a good part of the paper. This is the project that made me build Cleome.',
          plain: 'Anxiety and low mood both come with trouble managing emotions. Which of those difficulties link to which symptoms? I map it in two symptom networks, using a tool I built.',
          nerd: 'Undirected and directed symptom networks pairing DERS items with GAD and with PHQ items, estimated and bootstrapped in Cleome.', tag: 'directed networks', url: null },
        { id: 'parentalKnowledge', n: ['Parental', 'knowledge'], title: 'Parental knowledge and risk-taking', status: 'In progress',
          plain: 'How does what parents know about their teenager\'s life relate to the teenager\'s own risk-taking? I am testing it in an adolescent sample.',
          nerd: 'Latent moderated mediation in SEM (modsem). It is heavy to compute, which is why I built a parallel runner into SEMpathy.', tag: 'modsem', url: null }
      ] },

    { name: 'Tools', key: 'tools', lav: 'tools', col: '#FFE14A',
      desc: 'Apps that put rigorous methods in other people\'s hands.',
      ind: [
        { id: 'sempathy', n: ['SEMpathy', 'SEM app'], title: 'SEMpathy', status: 'Built and used', app: 'sempathy',
          role: 'Built for teaching, then used in real projects. Students tested it. Accepted by the Journal of Open Source Software.',
          plain: 'Most psychology data is a 5-point scale or a yes/no, but friendly point-and-click programs fit it as if it were continuous. I built SEMpathy so students can run CFA the right way for ordinal data, then move on to mediation, moderation and invariance. When latent moderation across groups got too slow to run one model at a time, I added a way to run them side by side.',
          nerd: 'R Shiny. lavaan with WLSMV by default for ordinal and binary items. Latent moderation through modsem, run in parallel across groups and paths. APA Word report and replication script.', tag: 'lavaan', url: null },
        { id: 'cleome', n: ['Cleome', 'network app'], title: 'Cleome', status: 'Four versions', app: 'cleome',
          role: 'Grew out of the DERS network project. Undergraduates tested it.',
          plain: 'I kept re-running the same network analysis with small changes: a pilot, a mid-study check, dropping an item that behaved badly in Indian samples, fixing labels that spilled out of their nodes. Cleome holds the whole pipeline and writes the reason for every step next to it.',
          nerd: 'R Shiny, organised with the golem framework, four versions so far. EBICglasso, Ising, mgm and more. Centrality, bridge, case-dropping stability, communities, DAGs, moderated networks and network comparison. A Decision Log records each consequential choice, and every step writes its own methods paragraph and an R replication script.', tag: 'EBICglasso', url: null },
        { id: 'distill', n: ['Distill', 'short forms'], title: 'Distill', status: 'Tested internally', app: 'distill',
          role: 'Grew out of the risk-taking scale work. I am still learning IRT, and building this was part of how.',
          plain: 'Shortening a questionnaire is a puzzle: drop items, but keep what the scale could tell you. A lab project needed a short form, my first crude attempt did badly, and then I did it properly with item response theory. Distill turns that script into a tool.',
          nerd: 'R Shiny on mirt. Multidimensional IRT and bifactor indices. Short-form search with ant colony, genetic, simulated annealing and greedy methods, with locked and excluded items. Pareto view of length against information. Split-half validation, bootstrap intervals, CAT simulation.', tag: 'mirt', url: null }
      ] },

    { name: 'Scale development', key: 'scales', lav: 'scales', col: '#FF7AB6',
      desc: 'Adapting, translating and shortening questionnaires so they work for the people who answer them.',
      ind: [
        { id: 'fscq', n: ['FSCQ', 'adaptation'], title: 'FSCQ adaptation', status: 'In progress',
          role: 'I did most of the analysis and a little of the writing.',
          plain: 'How close do you feel to the person you will be later in life? The Future Self-Continuity Questionnaire asks in three ways: how vividly you picture that person, how similar you are, and how good it feels. I adapted it, and I check that it measures the same thing, the same way, for university students and for a broader community sample.',
          nerd: 'Three-factor CFA with WLSMV for ordinal items. Reliability, discriminant and concurrent validity. Measurement invariance across the two samples.', tag: 'CFA, WLSMV', url: null },
        { id: 'dastHindi', n: ['DAST-10', 'translation'], title: 'Hindi DAST-10', status: 'In progress',
          role: 'I collected the general-community sample, wrote, and did most of the analysis.',
          plain: 'A screening questionnaire for drug use only helps if people understand it the way it was meant. I translated the DAST-10 into Hindi and am validating it with treatment-seeking and community adults, checking which factor structure actually holds.',
          nerd: 'Translation and back-translation, then CFA with competing published factor structures compared by chi-square difference. The items are yes/no, so the estimator is chosen for categorical data.', tag: 'translation', url: null },
        { id: 'riskScale', n: ['Risk-taking', 'short form'], title: 'Risk-taking scale', status: 'In progress',
          role: 'I ran the data analysis.',
          plain: 'Risk-taking is not one thing. Racing a bike, drinking and skipping sleep may not share a cause. I am building a scale that tells five kinds of risk apart, plus a short form for researchers with no time to spare.',
          nerd: 'Item pool screened with parallel analysis. Five a priori domains. Multidimensional graded response model in mirt, bifactor indices, short form chosen by ant colony search with a domain floor.', tag: 'mirt', url: null }
      ] },

    { name: 'Teaching', key: 'teaching', lav: 'teaching', col: '#3FD6A6',
      desc: 'Two courses as a teaching assistant, plus datasets and demos built for students to practise on.',
      ind: [
        { id: 'srm', n: ['SRM-I', 'live class'], title: 'Statistics and Research Methods I', status: 'Teaching assistant',
          role: 'I built the class activity and ran it.',
          plain: 'An interactive class activity. Students fill in a short survey during class. A simple script downloads their answers, codes them and imports everything into jamovi, where we then explore descriptive statistics, frequency tables, t-tests and Pearson\'s correlations on the room\'s own data.',
          nerd: 'Run live in jamovi. A short script downloads and codes the survey responses and imports them. Descriptive statistics, frequency tables, t-tests and Pearson correlations on one dataset.', tag: 'jamovi', url: null },
        { id: 'adapt', n: ['ADAPT', 'TA + lecture'], title: 'Adolescent Development and Psychopathology', status: 'Teaching assistant',
          role: 'Teaching assistant, and a guest lecture in 2026.',
          plain: 'I taught the fundamentals of mediation, moderation and structural equation modelling to undergraduates. In 2026 I gave a guest lecture and practical on the medmod module in jamovi: running a mediation or moderation analysis, reading the output and reporting it.',
          nerd: 'Mediation, moderation and SEM fundamentals. Guest lecture and practical on the jamovi medmod module, 2026.', tag: 'medmod', url: null },
        { id: 'modDemo', n: ['Simulated', 'data'], title: 'Simulated moderation dataset', status: 'Teaching material',
          role: 'Built so that students can check their answer.',
          plain: 'A dataset where I already know the answer. It looks like real survey data, with 5-point items plus gender and self-reliance, but every row is invented. I planted two moderation effects on purpose, and students try to find them.',
          nerd: 'Simulated in Python. Items drawn through a Gaussian copula, then cut into 1 to 5 responses. Latent effects set in advance, with a fixed seed.', tag: 'simulated', url: 'downloads/simulated-moderation-data.xlsx', urlLabel: 'Download the dataset' },
        { id: 'helpDemo', n: ['Messy-data', 'screening'], title: 'Screening a messy dataset', status: 'Teaching material',
          role: 'I merged the files and wrote the screening report.',
          plain: 'Real survey data comes with problems nobody labelled. I merged two exports from one survey platform and wrote the screening report students never normally see: blank rows, repeat attempts, probable double submissions, scale totals wrongly set to zero, and two items scored in opposite directions in the two files. Every missing value gets a reason, so students learn to ask why a value is missing, not only how many.',
          nerd: 'Python merge with row-level flags. Nothing deleted or imputed beyond blank rows. Missingness coded by reason, with planned missing data from a two-form design treated differently from dropout.', tag: 'screening', url: null }
      ] }
  ];


  // One sentence per project, for the list view.
  var lines = {
    helloHR: 'A pitch deck for a hiring-technology company, built around its story.',
    jivisha: 'Campaigns and teaching material for a student mental-health NGO, 2022 to 2026.',
    lovebytes: 'A video game that tries to prevent dating violence among teenagers.',
    thesis: 'Why some young people seek mental health help and others do not, even when they want to.',
    substanceNet: 'How drug-use problems, low mood and anxiety connect, symptom by symptom.',
    negParenting: 'How emotions and parenting fit together in how teenagers are doing.',
    dersNet: 'Which emotion-regulation difficulties link to which anxiety and low-mood symptoms.',
    parentalKnowledge: 'How what parents know about their teenager\'s life relates to the teenager\'s risk-taking.',
    sempathy: 'Run CFA the right way for ordinal data, then mediation, moderation and invariance.',
    cleome: 'The whole network-analysis pipeline, with the reason for every step written beside it.',
    distill: 'Shorten a questionnaire while keeping what it could tell you.',
    fscq: 'Adapting the Future Self-Continuity Questionnaire and checking that it measures the same thing in two samples.',
    dastHindi: 'Translating the DAST-10 drug-use screener into Hindi and validating it.',
    riskScale: 'A scale that tells five kinds of risk-taking apart, plus a short form.',
    srm: 'An interactive class activity where the students\' own answers become the dataset.',
    adapt: 'Teaching mediation, moderation and SEM, and a 2026 guest lecture on the jamovi medmod module.',
    modDemo: 'An invented dataset with moderation effects planted, so students can check their answer.',
    helpDemo: 'A screening report for a messy merged dataset, with a reason for every missing value.'
  };
  factors.forEach(function (f) { f.ind.forEach(function (d) { d.line = lines[d.id]; }); });
  factors[0].more[0].line = 'A visual identity for a platform that connects businesses with college students.';
  factors[0].more[1].line = 'A visual story for a food-delivery startup that employs specially-abled delivery partners.';

  var causes = [
    { key: 'edu', n: ['Ashoka', 'Psychology BSc'], title: 'Ashoka University', desc: 'BSc (Hons) Psychology with research, 2022 to 2026. Graduated summa cum laude. Dean\'s List for three semesters.', url: RESUME, urlLabel: 'See resume' },
    { key: 'train', n: ['Training', 'certs + courses'], title: 'Certifications and courses', desc: 'Design Thinking (BCcampus Open-Ed), Graphic Design (ALISON), a Diploma in Psychology (XSIQ, Australia), short courses in clinical psychology, and a summer clinical-psychology internship.', url: RESUME, urlLabel: 'See resume' },
    { key: 'exp', n: ['Experience', 'design since 2020'], title: 'Design roles since 2020', desc: 'Jivisha Foundation (2022 to 2026), HelloHR, CampusArmy and Pankh. Branding, campaigns, pitch decks and teaching material.', url: RESUME, urlLabel: 'See resume' }
  ];

  // [indicator id, the other factor it also loads on, label]
  var cross = [
    ['lovebytes', 'research', 'built on research'],
    ['sempathy', 'research', 'built for latent moderation'],
    ['cleome', 'research', 'born from the DERS study'],
    ['distill', 'scales', 'grew from the risk-taking scale'],
    ['dastHindi', 'research', 'same data as the substance use network'],
    ['helpDemo', 'research', 'built from my thesis survey']
  ];

  // Opened only by adding #research to the address. There is no button for it.
  var fit = [
    ['R and coding', 'Three Shiny tools I built, with Cleome in four versions and a test suite. Two have been tried by students and used in real projects; the third is still being tested.'],
    ['SEM and networks', 'Latent moderated mediation, symptom networks with stability checks and directed layers, and measurement invariance across groups.'],
    ['Students and mental health', 'A help-seeking study of young adults with two recruitment routes, and emotion-regulation networks in anxiety and low mood.'],
    ['Consent and safeguarding', 'My thesis used electronic consent and offered every participant a distress score and a list of mental health support resources.'],
    ['Data quality', 'Merged messy exports, flagged duplicates, and coded why each value was missing: planned, skipped, or dropped out.'],
    ['An honest gap', 'I have not run an EMA study yet. The closest I have done is planned-missingness data, and the empty-cell toy shows how I reason about it.']
  ];

  // Each toy belongs to one project in the model (the first id in `from`). The others are related projects.
  var toys = [
    { id: 'stable', file: 'toys/edge-stability.html', title: 'How sure are you about this edge?', from: ['substanceNet', 'cleome', 'dersNet'],
      q: 'This edge looks strong in your sample. Would it survive a different one?',
      learn: 'Resample invented data where the true network is known. See how wide each edge range is, and how often the most central node turns out not to be.',
      why: 'Before I read anything into an edge in the substance use network, I check how stable it is. Cleome runs the same check inside the app.' },
    { id: 'figure', file: 'toys/replicate-figure.html', title: 'Replicate this figure', from: ['cleome', 'dersNet', 'substanceNet'],
      q: 'Could a reader redraw your network from your methods section alone?',
      learn: 'The settings that change a network picture are the ones most often left out: how it was regularised, the seed behind the layout, how edges were thresholded. Tick what you report and watch what a reader would rebuild.',
      why: 'Cleome keeps a decision log and writes a methods paragraph for every step, because the same network got re-run again and again with small changes.' },
    { id: 'ordinal', file: 'toys/ordinal.html', title: 'Treat it as continuous?', from: ['sempathy', 'fscq'],
      q: 'What happens to a correlation when 5-point answers are treated as continuous?',
      learn: 'Two estimators read the same invented rating-scale answers, across 40 studies. Compare each with the true value, then change how many response options there are.',
      why: 'Most psychology data are rating scales or yes/no items. SEMpathy fits them with estimators made for ordinal data, which is the reason I built it.' },
    { id: 'short', file: 'toys/short-form.html', title: 'Shorten the scale', from: ['distill', 'riskScale'],
      q: 'You need a shorter scale. Which items do you cut, and what is it for?',
      learn: 'A short form is short for something. Pick a purpose, cut by rank and by a search tuned to it, and see what each form gives up.',
      why: 'Distill searches for short forms with a floor for every domain. It is the same idea I used for the risk-taking scale.' },
    { id: 'dif', file: 'toys/same-score.html', title: 'Same score, different meaning', from: ['dastHindi', 'fscq'],
      q: 'Two groups sit at the same trait level. Why do their total scores differ?',
      learn: 'Make a few items harder for one group and watch a gap open in the totals with nothing real behind it. Then run the check that catches it: compare people with the same score on the fair items.',
      why: 'A translated screening tool should be checked item by item before anyone compares total scores across groups. That is the question behind the Hindi DAST-10, and behind checking the FSCQ across two samples.' },
    { id: 'cell', file: 'toys/empty-cell.html', title: 'Why is this cell empty?', from: ['helpDemo', 'thesis'],
      q: 'A value is missing. Is that a problem, a design choice, or information?',
      learn: 'Read a survey map and what you know about each person, then give every empty cell its reason. Then see what a reason does to an estimate when you delete the incomplete cases and when you do not.',
      why: 'When I screened a merged dataset for class, every missing value got a reason. My thesis used planned missing data, which is not the same thing as dropout.' }
  ];

  /* short silent clips, played by assets/clip.js. Each one needs an mp4 and a poster still. */
  var CLIPS = {
    thesis: { mp4: 'assets/media/thesis-talk.mp4', webm: 'assets/media/thesis-talk.webm', poster: 'assets/media/thesis-talk-poster.webp', posterJpg: 'assets/media/thesis-talk-poster.jpg',
      cap: 'Presenting the thesis', alt: 'Sukrit presenting the honours thesis in a seminar room, speaking and gesturing.' }
  };

  var ABOUT = {
    photo: { webp: 'assets/media/portrait-full.webp', jpg: 'assets/media/portrait-full.jpg', alt: 'Sukrit smiling and looking to the right, in front of a glowing circle of warm light.' },
    heading: 'Sukrit Bhatnagar',
    paras: [
      'I studied psychology at Ashoka University, where I graduated summa cum laude, with an honours thesis on why young people do or do not seek mental health help. I work on measuring what cannot be seen directly, such as distress, emotion regulation and help-seeking, and on checking that a scale means the same thing for the people who answer it.',
      'I build the R tools I wished I had as a student, and I have taught the methods as a teaching assistant. I am looking for research-assistant and methods teaching roles.'
    ],
    /* [label, key in PF.links, style]. The note sits under the row. */
    links: [['Resume', 'resume', ''], ['Contact', 'contact', 'alt'], ['Design portfolio', 'webflow', 'alt'], ['LinkedIn', 'linkedin', 'alt'], ['Instagram', 'instagram', 'alt']],
    note: 'Fair warning: the design portfolio is extremely out of date. Think of it as an archaeological site.'
  };

  return { factors: factors, causes: causes, cross: cross, fit: fit, toys: toys, apps: APPS, source: SOURCE, clips: CLIPS, about: ABOUT,
    tagline: 'Measuring the parts of mental health you cannot see directly.',
    links: { webflow: WF, resume: RESUME, linkedin: 'https://linkedin.com/sukritbhatnagar', instagram: 'https://instagram.com/sukritbhatnagar', contact: WF + '/contact' } };
})();

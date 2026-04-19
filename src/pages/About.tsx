import styles from './About.module.css';
import { SOCIAL_LINKS } from '../data/constants';

const skills = {
  'Languages': ['C++', 'C#', 'TypeScript', 'JavaScript'],
  'Game Development': ['Unreal Engine', 'Gameplay Ability System (GAS)', 'Unity', 'AI & State Machines', 'Physics (PhysX)', 'FMOD'],
  'System Development': ['React', 'HTML & CSS', '.NET'],
  'Tools': ['Git', 'Visual Studio', 'JetBrains Rider', 'Claude', 'GitHub Copilot'],
};

function About() {
  return (
    <div className={styles.page}>

      {/* ── Intro ── */}
      <section className={styles.intro}>
        <div className={styles.introText}>
          <h1>About Me</h1>
          <p>
            I switched careers about seven years ago to pursue what I genuinely love — writing code.
            Game development was the obvious starting point, and I worked my way from Malmö University
            through The Game Assembly and into an eight-month industry internship at Playwood Project
            in Copenhagen, where I worked on <em>Successor</em>, a top-down strategic RPG built in
            Unreal Engine. I've shipped real games, built systems from scratch in C++, and grown a
            lot as a programmer along the way.
          </p>
          <p>
            My background is in gameplay programming — controllers, state machines, AI, and systems —
            but what I really enjoy is the thinking behind how things fit together. I care about writing
            code that makes sense: systems that are easy to use, well-structured, and don't create
            problems further down the line.
          </p>
          <p>
            I'm now expanding into system development, studying full-stack at Lexicon while applying
            the same engineering mindset to web and backend work. I'm looking for roles where I can
            bring technical depth and a genuine interest in building things well — regardless of the domain.
          </p>
          <div className={styles.socialLinks}>
            {SOCIAL_LINKS.map(({ href, label, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer">
                <Icon /> {label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Skills ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Skills</h2>
        <div className={styles.skillsGrid}>
          {Object.entries(skills).map(([category, items]) => (
            <div key={category} className={styles.skillGroup}>
              <h3>{category}</h3>
              <ul>
                {items.map(skill => <li key={skill}>{skill}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Background ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Background</h2>
        <div className={styles.timeline}>
          <div className={styles.timelineItem}>
            <span className={styles.timelineYear}>2026 - present</span>
            <div>
              <h3>System Development - Lexicon</h3>
              <p>Full-stack web development program covering the complete pipeline - from frontend with React, TypeScript, and 
                Tailwind to backend with C# and ASP.NET Core, along with databases, security, software architecture, and Agile 
                workflows.</p>
            </div>
          </div>
          <div className={styles.timelineItem}>
            <span className={styles.timelineYear}>2022 - 2025</span>
            <div>
              <h3>Game Programming - The Game Assembly</h3>
              <p>One of the world's leading game programming programs - intensive and highly demanding. Two years of study 
                followed by an eight-month internship in the industry. Focused on gameplay programming, engine development, 
                and shipping games as part of a team. Built 8 games across custom engines, Unity, and Unreal Engine.</p>
            </div>
          </div>
          <div className={styles.timelineItem}>
            <span className={styles.timelineYear}>2019 - 2022</span>
            <div>
              <h3>Game Development - Malmö University</h3>
              <p>Broad game development education spanning everything from C++ and Unity to 3D modeling in Maya. Gave me a 
                solid foundation and confirmed that programming was where I wanted to go deeper.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default About;

import styles from './About.module.css';
import { SOCIAL_LINKS } from '../data/constants';

const skills = {
  'Languages': ['C++', 'C#', 'TypeScript' /* TODO: lägg till mer */],
  'Game Development': ['Unreal Engine', 'Gameplay Ability System (GAS)', 'Unity', 'AI & State Machines', 'Physics (PhysX)', 'FMOD'],
  'System Development': ['React', 'HTML & CSS' /* TODO: lägg till mer */],
  'Tools': ['Git', 'Visual Studio', 'JetBrains Rider' /* TODO: lägg till mer */],
};

function About() {
  return (
    <div className={styles.page}>

      {/* ── Intro ── */}
      <section className={styles.intro}>
        <div className={styles.introText}>
          <h1>About Me</h1>
          <p>
            {/* TODO: Skriv din intro här – vem du är, vad du brinner för */}
            I'm a game programmer who has taken the step into system development.
            My background is in building gameplay systems, AI, and player controllers —
            but I'm drawn to any problem that requires careful thinking about how things fit together.
          </p>
          <p>
            {/* TODO: Något om din väg, skolan, vad du söker */}
            I studied game programming at The Game Assembly and am currently expanding my skills
            in system development. I'm looking for roles where I can combine technical depth
            with a passion for crafting good experiences.
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
            <span className={styles.timelineYear}>2024 – present</span>
            <div>
              <h3>System Development{/* TODO: lägg till skola/program */}</h3>
              <p>Currently studying system development, broadening from game programming into backend, web, and software architecture.</p>
            </div>
          </div>
          <div className={styles.timelineItem}>
            <span className={styles.timelineYear}>2021 – 2024</span>
            <div>
              <h3>Game Programming – The Game Assembly</h3>
              <p>Three-year program focused on gameplay programming, engine development, and shipping games as part of a team. Built 8 games across custom engines, Unity, and Unreal Engine.</p>
            </div>
          </div>
          <div className={styles.timelineItem}>
            <span className={styles.timelineYear}>2018 – 2021</span>
            <div>
              <h3>Game Development – Malmö University</h3>
              <p>{/* TODO: Beskriv vad du läste */}</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default About;

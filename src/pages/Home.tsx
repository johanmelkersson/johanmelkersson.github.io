import { Link } from 'react-router-dom';
import styles from './Home.module.css';

function Home() {
  return (
    <div className={styles.hero}>
      <div className={styles.heroContent}>
        <p className={styles.greeting}>Hi, I'm</p>
        <h1 className={styles.name}>Johan Melkersson</h1>
        <h2 className={styles.title}>Game Programmer & System Developer</h2>
        <p className={styles.bio}>
          I'm a game programmer with a background in gameplay systems, AI, and custom engines —
          now expanding into full-stack development. I care about writing code that's
          well-structured and makes sense to work with.
        </p>
        <div className={styles.ctas}>
          <Link to="/projects" className={styles.ctaPrimary}>View Projects</Link>
          <Link to="/about" className={styles.ctaSecondary}>About Me</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;

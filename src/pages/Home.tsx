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
          I build games and the systems behind them. Trained as a game programmer
          and currently expanding into system development — always looking for
          interesting problems to solve.
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

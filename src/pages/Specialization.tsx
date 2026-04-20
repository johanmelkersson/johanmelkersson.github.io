import styles from './Specialization.module.css';
import { STATS_DATA } from '../data/specialization';

const SectionImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
  <img src={src} alt={alt} className={`${styles.sectionImage} ${className ?? ''}`} />
);

function Specialization() {
  return (
    <div className={styles.page}>

      {/* ── Intro ── */}
      <section className={styles.hero}>
        <p className={styles.label}>TGA Specialization</p>
        <h1>AI & Behavior</h1>
        <p className={styles.intro}>
          For my specialization at The Game Assembly, I chose to focus on AI and behavior.
          I developed an AI that makes decisions and performs actions using a set of personal
          stats that determine how well it performs each action, represented as classic gaming
          stats such as endurance, awareness, charisma, and so on, each affecting actions tied
          to that specific stat.
        </p>
        <p className={styles.intro}>
          The system supports an arbitrary number of AI actors with randomized or manually
          tweaked stats, producing very different performance levels. I also had an initial
          plan to explore fuzzy logic, something I had no prior experience with, but ultimately
          scrapped it mid-project due to time constraints and the fact that the desired results
          were achievable without it.
        </p>
        <div className={styles.tags}>
          <span>C++</span>
          <span>Sad Dad Motors</span>
          <span>State Machine</span>
          <span>Behavior Tree</span>
          <span>Navmesh</span>
        </div>
      </section>

      {/* ── Getting Started ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Getting Started</h2>
        <div className={styles.sectionContent}>
          <div className={styles.text}>
            <p>
              I chose to do my specialization in <em>Sad Dad Motors</em>, a game engine my friend
              and I had developed during our time at TGA. I naively made this decision solely
              based on the fact that I wanted to, even though I was fully aware this would mean
              significant additional work to get the engine ready.
            </p>
            <p>
              This meant spending a significant amount of time implementing things necessary for
              the AI actor, most notably the ability to create and navigate a navmesh.
              With the engine prep done, I began structuring the AI. I wanted to use a state machine
              and add a behavior tree to each state, since I had substantial experience with state
              machines and new ideas to try. Combining these two methods was something I had never done before.
            </p>
          </div>
          <SectionImage src="/images/specialization/getting-started.jpeg" alt="Getting started -navmesh setup" />
        </div>
      </section>

      {/* ── The Game ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>The "Game"</h2>
        <p>
          The setting I built was a simple sneak/flee game. The player can move around the scene
          and emits sound at different volumes depending on movement speed. AI actors patrol the
          scene, looking and listening for the player. If noticed, the actor moves in to investigate
          and begins its detection phase. If detected, the actor chases the player until it loses
          track, then searches the last known position before resuming patrol.
        </p>
        <p>
          I wanted the environment to play a role, so I added walls and bushes. Walls block
          sight completely but only partly muffle sound. Bushes partly obscure sight but have
          no effect on sound. These obstacles also gave additional levers for the actor's stats
          to influence detection.
        </p>
        <div className={styles.imageRow}>
          <SectionImage src="/images/specialization/game-1.gif" alt="Game overview" />
          <SectionImage src="/images/specialization/game-2.gif" alt="Detection in action" />
        </div>
      </section>

      {/* ── Stats ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>AI Actor Stats & State</h2>
        <p>
          I needed stats connected to detection and movement. I deviated slightly from classic
          game stats by implementing separate vision and hearing stats, which let me explore how
          a nearly blind or deaf actor changes gameplay. Each stat can be freely tweaked by the
          user to alter the actor's overall performance. Additionally, some internal variables
          represent the actor's physical and mental state during the game, and are modified by
          the code at runtime.
        </p>
        <div className={styles.imageRow}>
          <SectionImage src="/images/specialization/stats-1.png" alt="Stats overview" />
          <SectionImage src="/images/specialization/stats-2.gif" alt="Stats in editor" />
          <SectionImage src="/images/specialization/stats-3.gif" alt="Stats in action" />
        </div>
        <div className={styles.statsGrid}>
          {STATS_DATA.map((stat) => (
            <div key={stat.name} className={styles.statCard}>
              <div className={styles.statHeader}>
                <img src={stat.icon} alt={stat.name} className={styles.statIcon} />
                <div>
                  <h3>{stat.name}</h3>
                  <span className={styles.statType}>{stat.type}</span>
                </div>
              </div>
              <p>{stat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── State Machine ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>State Machine</h2>
        <div className={styles.sectionContent}>
          <div className={styles.text}>
            <p>
              After some iterations, I landed on a structure where each state machine can hold
              an arbitrary number of actors. This was important to me for two reasons: I hadn't
              done it this way before, and I wanted the state machine to own the world
              parameters for its connected actors: max movement speed, acceleration, sight range,
              hearing range, and so on.
            </p>
            <p>
              Some variables were set as constants, others were state-specific. All variables
              were exposed to allow multiple state machines with different world parameters,
              meaning actors connected to a different machine play by different rules, such as
              elite actors. This also made runtime tweaking easy for testing.
              Each state was then built using a behavior tree for updates and a blackboard to
              hold all necessary information. I used Pär Arvidsson's <em>Braintree</em> library,
              which I had used once before and had more than enough of the functionality I needed.
            </p>
          </div>
          <SectionImage src="/images/specialization/state-machine.png" alt="State machine diagram" />
        </div>
      </section>

      {/* ── State Structure ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>State Structure</h2>
        <p>
          The main challenge was updating each actor individually without affecting others,
          while keeping the actor class lean. I solved this by giving each state an unordered
          map with the actor ID as the key and a pair containing a behavior tree and a blackboard
          pointer as the value.
        </p>
        <p>
          When an actor is added, the blackboard is created first, then each state is initialized
          with that blackboard and emplaced into the map. This lets the state machine update
          kinematic data per actor, while the actor itself only knows its own stats and a state
          enum. Since the blackboard is created outside and passed as a pointer, data can also
          persist between states for each individual actor.
        </p>
        <div className={styles.imageRow}>
          <SectionImage src="/images/specialization/state-structure-1.png" alt="State structure diagram" />
          <SectionImage src="/images/specialization/state-structure-2.gif" alt="State structure code overview" />
        </div>
      </section>

      {/* ── Actor Class ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>The AI Actor Class</h2>
        <div className={styles.sectionContent}>
          <div className={styles.text}>
            <p>
              The actor itself does very little. It holds a struct with all actor stats,
              with corresponding getters and setters used by the state machine, an enum
              representing the current state, and a struct with kinematic data that is
              updated by the state machine each update loop.
            </p>
            <p>
              In its own update loop, the actor uses the kinematic data to update its transform.
              This clean separation keeps the actor class minimal while giving the state machine
              full control over behavior.
            </p>
          </div>
          <SectionImage src="/images/specialization/actor-class.png" alt="AI actor class overview" />
        </div>
      </section>

    </div>
  );
}

export default Specialization;

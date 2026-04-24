export type ProjectStatus = 'in-development' | 'released' | 'finished' | 'archived';

export interface GameProject {
    id: number;
    title: string;
    tagline?: string;      // Det där citatet under titeln
    description: string;
    roleDescription: string; // Texten om vad DU gjorde
    technologies: string[];
    genre: string;
    engine: string;
    mainContribution: string;
    status: ProjectStatus;
    releaseDate?: string;
    releaseDateLabel?: string;
    youtubeId?: string;
    imageUrl: string;      // Key art bilden
    platformLinks?: {      // För knappar som Itch/Google Play
        type: 'itch' | 'googleplay' | 'steam';
        url: string;
    }[];
    awards?: {
        name: string;
        imageUrl: string; // Sökväg till loggan
    }[];
}

export interface FeaturedProject {
    id: number;
    title: string;
    tagline?: string;
    description: string;
    roleDescription: string;
    technologies: string[];
    genre: string;
    engine: string;
    mainContribution: string;
    status: ProjectStatus;
    startDate: string;
    teamSize: string;
    technicalSystems: {
        name: string;
        description: string;
    }[];
    motivation?: string;
}

export const FEATURED_PROJECT: FeaturedProject = {
    id: 0,
    title: "The Höör Reclamation Project",
    tagline: "Send them out. Bring something back.",
    description:
        "A third-person squad game set in a post-apocalyptic Sweden. You belong to a faction and send squads into the ruined landscape " +
        "to gather resources for your community. On a procedural hex-grid world map you navigate to encounters — some procedural, " +
        "others permanent locations that can be revisited. Inside encounters, squad members move freely on a navmesh and face NPCs " +
        "from rival factions in situations ranging from social interactions to stealth and combat. The world reveals itself gradually " +
        "as you push further out.",
    roleDescription:
        "Responsible for the encounter layer: player characters, AI systems, GAS integration, weapon and ammunition systems, " +
        "cover system, faction system, and UI. The technical depth of this project — particularly the multi-layer AI perception " +
        "pipeline and GAS architecture — has been the most demanding and rewarding work I've done.",
    technologies: ["C++", "Unreal Engine 5.7", "GAS", "StateTree", "DetourCrowd", "Enhanced Input", "EQS"],
    genre: "Squad Tactical / RPG",
    engine: "Unreal Engine 5.7",
    mainContribution: "Encounters, AI, GAS, Weapons, Animation, Save/Load, UI",
    status: 'in-development',
    startDate: "2024 →",
    teamSize: "2 developers",
    motivation:
        "This game has grown from every decision we made along the way, some decisions were made because it's what we'd " +
        "want to play ourselves, some out of nostalgia, and some just because I wanted to deep dive into a specific system. " +
        "It's a patchwork of all those choices. There's no single answer to why, and it's hard to say exactly where it'll end up.",
    technicalSystems: [
        {
            name: "AI Perception Pipeline",
            description:
                "Layered awareness system (Neutral → Curious → Alarmed → Alert → Sweep → Combat) driven by sight, hearing, and " +
                "damage response. States run on StateTree with custom C++ tasks and evaluators. Squad coordination with dynamic " +
                "clusters, shared last-known-location data, and faction relationships.",
        },
        {
            name: "Hex Grid & Procedural World Map",
            description:
                "Voronoi-based terrain generation in chunks with A* pathfinding and cache. Material/render-target tile visualization. " +
                "Full world serialization (vertices, normals, UVs) for save/load reconstruction.",
        },
        {
            name: "GAS Integration",
            description:
                "Custom attribute set with primary, secondary, and vital stats. MMC classes for derived stats, execution calculations " +
                "for damage with resistance mapping and debuff chance. Full ability pipeline: ranged, melee, grenade, missile, projectile.",
        },
        {
            name: "Cover System",
            description:
                "Trace-based cover detection with crouch support, montage sets per stance, and replicated cover variables.",
        },
        {
            name: "TIP + Aim Offset",
            description:
                "Shared Turn-In-Place and aim offset base for both player and AI, driven by a View Intent system on the controller.",
        },
        {
            name: "Save / Load",
            description:
                "Binary serialization of all SaveGame-marked UPROPERTYs, per-map actor state, and full procedural landscape data.",
        },
        {
            name: "Animation Blueprints (ABP)",
            description:
                "Full ABP setup for player characters and AI — state machines, blend spaces, and animation montage integration " +
                "for locomotion, combat stances, cover transitions, and hit reactions.",
        },
    ],
};

export const PROJECTS_DATA: GameProject[] = [
    {
        id: 1,
        title: "Successor",
        description: "A rogue-lite adventure in which you lead a lord and heroes to conquer fractured kingdoms in real-time with "
        + "pause tactical combat, reinvented. Create campaigns to unravel secrets, earn rewards, and expand your miniature universe.",
        roleDescription: "Successor is a game developed by Playwood project, a small company located in central Copenhagen. "
        + "Since it's a very small team I assisted wherever I was needed. Among other things I created alot of abilities for the units, "
        + "systems that calculates damage and defence profiles in order to then display all relevant combat information to the player, "
        + "and I also implemented the system that handles saving of key bindings. This project was alot of fun and there was alot of "
        + "heart going in to this game.",
        technologies: ['C++', 'Unreal Engine', 'Meta Quest'],
        genre: 'Strategic RPG',
        engine: 'Unreal Engine',
        mainContribution: 'Gameplay and UI',
        status: 'released',
        releaseDate: 'Oct 2025',
        youtubeId: 'L3CSAbv5Pak',
        imageUrl: '/images/projects/successor.jpeg',
        platformLinks: [{ type: 'steam', url: 'https://store.steampowered.com/app/1284730/Successor/' }]
    },
    {
        id: 2,
        title: "Ascend",
        tagline: "Tumbing from the sky your body shatters as it hits the ground! Ascend the broken remains and uncover pieces of you past "
        + "on a journey to make peace with the life you led",
        description: "A third-person story-game where the player takes on the role of a raven who travels through a landscape filled with "
        + "grassy hills and deep forests.",
        roleDescription: "The eighth and final project at TGA and the fourth one using Crowsnest (our group's game engine). An extremely "
        + "challenging project where the group knowingly took on some very big tasks. The game features a unique art style and atmospheric "
        + "soundtrack that immerses players in a world of beauty and melancholy. My main contribution in this project was the player "
        + "controller and movement. A task that was pretty much present and tweaked throughout the entire project as the environment changed.",
        technologies: ['C++', 'Crowsnest', 'FMOD', 'PhysX'],
        genre: 'Third-person adventure',
        engine: 'Crowsnest',
        mainContribution: 'Player controller and physics',
        status: 'released',
        releaseDate: 'Spring 2024',
        youtubeId: '4c_cBM9azbA',
        imageUrl: '/images/projects/ascend.png',
        platformLinks: [{ type: 'itch', url: 'https://korp-corp.itch.io/ascend' }]
    },
    {
        id: 3,
        title: "Cruisin' 4A Bruisin'",
        tagline: "Pirate Space-Penguins have commandeered a lavish Space Cruise ship and stolen your Raven. Grab your Space Guns and "
        + "exact extreme Space Vengeance while avoiding incoming Space Fire!",
        description: "A third-person bullet hell where you play as a parodic, over-the-top action hero who has to clear the ship of "
        + "the evil penguins in order to save his beloved raven.",
        roleDescription: "The seventh project at TGA and the third one using Crowsnest (our group's game engine). An extremely fun "
        + "project to be working on. The parodic, over-the-top hero and setting inspired by ”Dog the Bounty Hunter” and ”The Fifth "
        + "Element” really speak to me. Aside from being a part of the PhysX integration in this project, I have done a lot of small "
        + "tasks everywhere. Some of them connected to PhysX, like explosions, ground checks, raycasts for shooting, bullets, and "
        + "missiles. I have also implemented the checkpoint system, kill triggers, and a small scripted event that lets you change "
        + "music, and so on. In addition to this, I'm also responsible for the main menu, pause menu, and HUD.",
        technologies: ['C++', 'Crowsnest', 'FMOD', 'PhysX'],
        genre: 'Third-person action/bullet hell',
        engine: 'Crowsnest',
        mainContribution: 'PhysX integration and UI',
        status: 'finished',
        releaseDate: 'Spring 2024',
        youtubeId: 'QR_Mp2-HQ8g',
        imageUrl: '/images/projects/cruisin-4a-bruisin.png',        
    },
    {
        id: 4,
        title: "Spite - Ragnareld",
        tagline: "As Fireborn, you are immune to the frost curse that has taken hold of the northern mountain. Slash, dash and burn "
        + "your way through the corrupted masses to find and defeat the evil from the ancient past of giants.",
        description: "A top-down, point-and-click action RPG where the goal is to rid the land of the lurking evil by killing zombies, "
        + "mages, and finally reaching and defeating the source of it all.",
        roleDescription: "The sixth project at TGA and my second one using Crowsnest (our group's game engine). In this project, I "
        + "developed the enemy AI, which consists of one lighter melee zombie enemy and one heavier ranged frost mage. Both enemies "
        + "also have one basic and one elite version with different stats and somewhat different behavior. I enjoyed this project mainly "
        + "because I got to work with something I really like, which is state machines and AI. This game, and some of the structural flaws "
        + "in our system, is probably the reason I chose to specialize in the subject.",
        technologies: ['C++', 'Crowsnest', 'FMOD'],
        genre: 'Action RPG',
        engine: 'Crowsnest',
        mainContribution: 'Enemy AI',
        status: 'finished',
        releaseDate: 'Spring 2024',
        imageUrl: '/images/projects/spite.png',        
    },
    {
        id: 5,
        title: "USSnoíR",
        tagline: "Good job, you've infiltrated the enemy lab! Now scour the place for clues by inspecting the equipment -decode the "
        + "hidden message and deliver it before they catch up!",
        description: "A first-person point-and-click escape room puzzle game where your goal is to investigate and find objects in the "
        + "room in order to finally send a message to your allies.",
        roleDescription: "The fifth project at TGA and my first in Crowsnest, an engine created and developed by the students in our "
        + "group. In this project, my main contribution was creating the player controller and movement for our hero. It was a pretty "
        + "straightforward implementation where the player can look around the room and choose new positions or focus on objects by "
        +"clicking on them. The camera then animates to the new position. The most challenging part during the development was getting "
        + "all the rotations to work, mainly due to the fact that the engine at this stage was in a pretty basic state. Also, lerping "
        + "and matching up the camera rotation before entering the animation phase of the movement took some tweaking to get right.",
        technologies: ['C++', 'Crowsnest', 'FMOD'],
        genre: 'Puzzle',
        engine: 'Crowsnest',
        mainContribution: 'Player controller and movement',
        status: 'finished',
        releaseDate: 'Spring 2024',
        youtubeId: 'QqHZUtIGR4Y',
        imageUrl: '/images/projects/ussnoir.png',        
    },
    {
        id: 6,
        title: "Huntress",
        tagline: "Don your monster slaying gear and brandish the silvered blades of your ancestors as you root out and destroy the "
        + "horrors spreading their evil from an ancient castle",
        description: "A top-down, boss-fighting action-adventure game where your goal is to destroy the evil monsters who have poisoned "
        + "the land. With their trusted recallable weapon, our hero sets out to find and destroy each of the two bosses.",
        roleDescription: "The fourth project at TGA and my second one using TGE (The Game Engine). In this project, my main contribution "
        + "was the weapon controller, which plays a big part in this game. In addition to being able to be thrown and recalled, it also "
        + "had to be upgraded to bounce off walls and catch fire. Getting the bounce to work took some tweaking, but the hardest part of "
        + "the process of creating the weapon was by far that it had to follow the environment, specifically being able to traverse stairs "
        + "up and down. The result I managed to achieve looks extremely good, and I'm very proud of this accomplishment.",
        technologies: ['C++', 'TGE'],
        genre: 'Action/Adventure',
        engine: 'The Game Engine (TGE)',
        mainContribution: 'Weapon controller',
        status: 'finished',
        releaseDate: 'Fall 2023',
        youtubeId: 'ZbRc4CS2pBA',
        imageUrl: '/images/projects/huntress.png',        
    },
    {
        id: 7,
        title: "Novaturient",
        tagline: "Sent from her dying home to find a new one, biologist Nova find herself lost on a forign planet. Jump glide, break rocks "
        + "and learn the story of this strange place",
        description: "A calm 2D platformer where your goal is to navigate sometimes dangerous flora and fauna by jumping on shape-changing "
        + " mushrooms and using updraft vents to float through the air.",
        roleDescription: "The third project at TGA, but the first one not using Unity. Instead, we used TGE, the quite basic engine "
        + "developed for the students at TGA. This came with its own set of challenges, one being the fact that there was no editor, "
        + "which meant we had to build the level elsewhere (in our case, Unreal) and import it to TGE. I can't really say I enjoyed "
        + "writing the level importer, but it got the job done in the end. However, I quite enjoyed the other parts of the process, "
        + "creating among other things the shape-changing mushroom colliders, checkpoints, and updraft triggers.",
        technologies: ['C++', 'TGE'],
        genre: '2D Platformer',
        engine: 'The Game Engine (TGE)',
        mainContribution: 'Moving environment, collision/trigger management and level importer',
        status: 'finished',
        releaseDate: 'Fall 2023',
        youtubeId: 'LXEEHbRcwWg',
        imageUrl: '/images/projects/novaturient.png',        
    },
    {
        id: 8,
        title: "SadDadMotors",
        tagline: "A custom C++ game engine built from the ground up.",
        description: "SadDadMotors is a hobby game engine developed together with Filip Orrling. The project started as an exploration "
        + "of low-level engine architecture and grew into a fairly capable system with navmesh, a custom scene graph, and core engine "
        + "systems. The engine was eventually archived as both developers shifted focus to other projects.",
        roleDescription: "Co-developer alongside Filip Orrling. My contributions spanned the full engine: C++ architecture, navmesh "
        + "integration, component systems, and general engine infrastructure. Building this gave me a much deeper understanding of what "
        + "happens under the hood of engines.",
        technologies: ['C++'],
        genre: 'Game Engine',
        engine: 'C++',
        mainContribution: 'Co-developer',
        status: 'archived',
        releaseDate: '2024',
        imageUrl: '/images/projects/saddadmotors.png',
    },
    {
        id: 9,
        title: "Impfiltration",
        tagline: "Guide the undercover imp, manipulate the environmet, burn stuff with their candle and collect artifacts to save their "
        + "rabbit",
        description: "A mobile puzzle game where you guide a small imp through 6 levels, avoiding guards while finding the right levers "
        + "to pull and candles to light in the correct order to reach the top and save their rabbit.",
        roleDescription: "My second project at TGA but my first-ever mobile game. I am extremely happy about the fact that I got to deal "
        + "with player input in this game. It gave me the opportunity to really learn one of the key elements in the mobile game design "
        + "process. Apart from input, I worked on moving some of the objects with player input, but also on the glowing orbs that appear "
        + "and disappear to highlight if an object can be moved or not.",
        technologies: ['C#', 'Unity', 'Android'],
        genre: 'Puzzle',
        engine: 'Unity',
        mainContribution: 'Player input and control',
        status: 'finished',
        releaseDate: 'Spring 2023',
        youtubeId: 'OduINB1GzMQ',
        imageUrl: '/images/projects/impfiltration.png',
        awards: [
            { name: 'Nominee: Best Mobile Game 2023', imageUrl: '/assets/badges/sga-award.png' }
        ],
    },
    {
        id: 10,
        title: "Sootling Saga",
        tagline: "Be the flame that lights the way towards the celebration. But don't let the flame go out",
        description: "An 'infinite' run sidescroller where you play as a sootling tasked to be the spark that lights the big bonfire on "
        + "the mountain. Run, jump, dash, and float through three levels of challenging terrain.",
        roleDescription: "This was my first project at TGA, a project where I took on quite a lot due to my previous experience with "
        + "Unity. I'm very proud of this project, and the player controller I developed works extremely well. It is very satisfying to "
        + "jump, float, and dash through these three levels. Apart from the player controller, I also implemented and tweaked the "
        + "parallax background, which I think adds a lot to the overall experience.",
        technologies: ['C#', 'Unity'],
        genre: 'Endless Runner',
        engine: 'Unity',
        mainContribution: 'Player controller and movement',
        status: 'finished',
        releaseDate: 'Fall 2022',
        youtubeId: 'whfLbvExxHE',
        imageUrl: '/images/projects/sootling-saga.png',     
    },
    {
        id: 11,
        title: "Office demons",
        tagline: "Middle management is hell. Luckily, so are you.",
        description: "A couch co-op limited-time turn-based mayhem of a game where you play as middle management demons who have to "
        + "leave their desks and travel to Earth to collect souls.",
        roleDescription: "Developed in Unity during my time at Malmö University, my main contribution to the game was the player "
        + "controller and weapon system. I really enjoyed this project, and the result is surprisingly fun to play.",
        technologies: ['C#', 'Unity'],
        genre: 'Couch co-op semi-tactical bullet hell',
        engine: 'Unity',
        mainContribution: 'Player controller and weapon system',
        status: 'finished',
        releaseDate: 'Spring 2022',
        youtubeId: 'bWgBfRIO5WY',
        imageUrl: '/images/projects/office-demons.png', 
          
    },
    {
        id: 12,
         title: "Fl!p",
        tagline: "The right way through might be the wrong way up.",
        description: "A small platformer where the player can use power-ups to flip the gravity, which is necessary in order to "
        + "traverse the level.",
        roleDescription: "Developed in Unity during my time at Malmö University, my main contribution to the game was the parallax "
        + "background and the companion AI. The companion can, in addition to following the player around, be ordered to specific "
        + "locations to help the player solve puzzles.",
        technologies: ['C#', 'Unity'],
        genre: 'Platformer',
        engine: 'Unity',
        mainContribution: 'AI companion and parallax background',
        status: 'finished',
        releaseDate: 'Spring 2021',
        imageUrl: '/images/projects/flip.png',       
    },
        {
        id: 13,
        title: "Orbital Warden",
        tagline: "Out here, gravity doesn't pull you down. It pulls you everywhere.",
        description: "This is a personal project I worked on during my spare time a couple of years ago. Developed in Unity, it's far "
        + "from being a complete game, but it holds sentimental value to me as I've crafted everything myself, including the models and "
        + "animations.",
        roleDescription: "The goal was to create a comedic game where you play as a ”park ranger” tasked with taking care of an asteroid "
        + "field. In its current state, the player can move around and jump from asteroid to asteroid. I'm quite proud of the gravity "
        + "system I developed during the project, where the player is affected by multiple gravitational pulls from all the asteroids in "
        + "the vicinity, taking mass and distance into account.",
        technologies: ['C#', 'Unity'],
        genre: 'Space exploration',
        engine: 'Unity',
        mainContribution: 'Everything',
        status: 'archived',
        releaseDate: '2022',
        imageUrl: '/images/projects/space-game.gif',
    },
    

];

export interface SystemProject {
    id: number;
    title: string;
    description: string;
    roleDescription: string;
    technologies: string[];
    type: string;
    mainContribution: string;
    status: ProjectStatus;
    releaseDate?: string;
    imageUrl: string;
    features: string[];
    demoUrl?: string;
    githubUrl?: string;
}

export const SYSTEM_PROJECTS_DATA: SystemProject[] = [
    {
        id: 1,
        title: "Weather Dashboard",
        description: "A responsive weather application that provides real-time weather data and forecasts for cities around the world.",
        roleDescription: "Built as a personal project to explore working with external APIs and responsive web design. The app fetches live data from OpenWeatherMap API and presents it in a clean, user-friendly interface. Features both a dark and a light mode, and is fully responsive across devices.",
        technologies: ['TypeScript', 'JavaScript', 'HTML', 'CSS', 'OpenWeatherMap API'],
        type: 'Web Application',
        mainContribution: 'Everything',
        status: 'finished',
        releaseDate: 'Spring 2026',
        imageUrl: '/images/projects/weather-dashboard.png',
        features: [
            'Live weather data via OpenWeatherMap API',
            'City search',
            'Current temperature with feels-like, wind and humidity',
            '5-day forecast',
            'Dark/Light mode toggle',
        ],
        demoUrl: 'https://johanmelkersson.github.io/WeatherDashboard/',
        githubUrl: 'https://github.com/johanmelkersson/WeatherDashboard',
    },
];

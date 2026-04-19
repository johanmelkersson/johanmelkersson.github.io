export type StatType = 'Actor Stat' | 'Physical State' | 'Mental State';

export interface Stat {
  icon: string;
  name: string;
  type: StatType;
  description: string;
}

export const STATS_DATA: Stat[] = [
  {
    icon: '/images/specialization/icon-vision.png',
    name: 'Vision',
    type: 'Actor Stat',
    description: 'Affects how far the actor can see unobscured, and has a small effect on how far it can see through bushes.',
  },
  {
    icon: '/images/specialization/icon-hearing.png',
    name: 'Hearing',
    type: 'Actor Stat',
    description: 'Affects from what distance an actor can detect sound unobscured, and has a small effect on how much walls hinder sound.',
  },
  {
    icon: '/images/specialization/icon-awareness.png',
    name: 'Awareness',
    type: 'Actor Stat',
    description: 'Affects how much walls hinder sound and how much bushes obscure vision, as well as the width of the vision cone.',
  },
  {
    icon: '/images/specialization/icon-reaction.png',
    name: 'Reaction',
    type: 'Actor Stat',
    description: 'Affects how fast the actor rotates and has some effect on how quickly it detects the player when seen.',
  },
  {
    icon: '/images/specialization/icon-speed.png',
    name: 'Speed',
    type: 'Actor Stat',
    description: 'Affects the speed at which the actor moves.',
  },
  {
    icon: '/images/specialization/icon-endurance.png',
    name: 'Endurance',
    type: 'Actor Stat',
    description: 'Affects the rate at which fatigue is added when moving and subtracted while standing still.',
  },
  {
    icon: '/images/specialization/icon-fatigue.png',
    name: 'Fatigue',
    type: 'Physical State',
    description: 'Affects the speed of the actor.',
  },
  {
    icon: '/images/specialization/icon-vigilance.png',
    name: 'Vigilance',
    type: 'Mental State',
    description: 'Affects how far the actor can see through bushes and hear through walls, as well as how quickly it detects the player.',
  },
  {
    icon: '/images/specialization/icon-detection.png',
    name: 'Player Detection',
    type: 'Physical State',
    description: 'Increases when the actor sees the player. When maxed, the player is detected. Decreases when the player is lost, eventually triggering the actor to resume patrolling.',
  },
  {
    icon: '/images/specialization/icon-charisma.png',
    name: 'Charisma',
    type: 'Actor Stat',
    description: 'Dump stat.',
  },
];

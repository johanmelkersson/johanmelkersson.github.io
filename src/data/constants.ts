import type { ReactElement } from 'react';
import { GitHubIcon, LinkedInIcon } from '../components/Icons';

export type SocialLink = {
  href: string;
  label: string;
  Icon: () => ReactElement;
};

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: 'https://github.com/johanmelkersson',
    label: 'GitHub',
    Icon: GitHubIcon,
  },
  {
    href: 'https://linkedin.com/in/johan-melkersson-51b74922b',
    label: 'LinkedIn',
    Icon: LinkedInIcon,
  },
];

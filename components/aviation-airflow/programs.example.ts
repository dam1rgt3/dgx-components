import type { AviationProgram } from './index';

/** Replace image.src and href placeholders with the website's existing assets and routes. */
export const aviationPrograms: AviationProgram[] = [
  {
    id: 'elementary-middle', name: 'Elementary & middle schools', category: 'Discover',
    audience: 'Ages 5–12 · About 90 minutes', headline: 'A first look.\nA world of possibility.',
    description: 'An age-tailored airport tour with desktop flight simulators, bringing the world of aviation within reach for younger students.',
    image: { src: '', alt: 'Students gathered beside a yellow airplane at the airport' },
    photoLabel: 'DISCOVERY STARTS HERE', href: '/EXISTING-ELEMENTARY-PROGRAM-ROUTE',
  },
  {
    id: 'high-school', name: 'High school', category: 'Experience',
    audience: 'High school · Half-day experience', headline: 'Beyond the classroom.\nInto the flight deck.',
    description: 'Guided airport tours, full-motion simulator sessions, and familiarization flights for qualifying juniors and seniors.',
    image: { src: '', alt: 'Airport terminal building beneath a clear blue sky' },
    photoLabel: 'A NEW PERSPECTIVE', href: '/EXISTING-HIGH-SCHOOL-PROGRAM-ROUTE',
  },
  {
    id: 'safety-training', name: 'Safety training', category: 'Train',
    audience: 'Pilots & qualified students', headline: 'Build your skills.\nDeepen your confidence.',
    description: 'Flight simulator training, Angle of Attack instruction, and aviation safety seminars for the pilot community.',
    image: { src: '', alt: 'Red and white flight simulator training equipment' },
    photoLabel: 'CONFIDENCE THROUGH PRACTICE', href: '/EXISTING-SAFETY-PROGRAM-ROUTE',
  },
];

import { useEffect, useId, useState } from 'react';
import type { CSSProperties } from 'react';
import { AirflowBackground } from './AirflowBackground';
import './airflow.css';

export interface AviationProgram {
  /** Unique, stable key, e.g. elementary-middle. */
  id: string;
  name: string;
  category: string;
  audience: string;
  /** Newlines create intentional line breaks. */
  headline: string;
  description: string;
  image: { src: string; alt: string; position?: string };
  photoLabel?: string;
  /** Existing program route or URL. */
  href: string;
  ctaLabel?: string;
}

export interface AirflowProgramsProps {
  programs: readonly AviationProgram[];
  id?: string;
  className?: string;
  style?: CSSProperties;
  initialProgramId?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  navigationNote?: string;
  schoolsLink?: { label: string; href: string };
  footerText?: string;
  theme?: 'light' | 'dark';
  /** Opacity multiplier from 0 to 1. */
  intensity?: number;
  /** Motion multiplier from 0 (static) to 3. */
  speed?: number;
  onProgramChange?: (program: AviationProgram) => void;
}

function ProgramPhoto({ image }: { image: AviationProgram['image'] }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  if (failedSrc === image.src || !image.src) {
    return <span className="af-photo-fallback" role="img" aria-label={image.alt}>Aviation programs</span>;
  }
  return <img src={image.src} alt={image.alt} width={640} height={400}
    loading="lazy" decoding="async" style={{ objectPosition: image.position || 'center' }}
    onError={() => setFailedSrc(image.src)} />;
}

export function AirflowPrograms({
  programs, id, className = '', style, initialProgramId,
  eyebrow = 'STEM AVIATION / PROGRAMS', title = 'Choose your flight path.',
  subtitle = 'Discover what’s possible. Find the program for you.',
  navigationNote = 'Three ways to explore aviation.\nOne shared sense of possibility.',
  schoolsLink, footerText, theme = 'light', intensity = 0.65, speed = 1, onProgramChange,
}: AirflowProgramsProps) {
  const instanceId = useId().replace(/:/g, '');
  const [selectedId, setSelectedId] = useState(initialProgramId ?? programs[0]?.id);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  // Fallback also handles a selected program being removed by the parent.
  const selectedIndex = Math.max(0, programs.findIndex(program => program.id === selectedId));
  const selected = programs[selectedIndex];
  if (!selected) return null;

  return <section id={id} className={`af-explorer ${className}`} style={style}
    data-theme={theme} aria-labelledby={`${instanceId}-heading`}>
    <AirflowBackground paused={paused} intensity={intensity} speed={speed} theme={theme} />
    <div className="af-content">
      <header className="af-header">
        <p className="af-eyebrow">{eyebrow}</p>
        <h2 id={`${instanceId}-heading`}>{title}</h2>
        <p className="af-subtitle">{subtitle}</p>
      </header>
      <div className="af-layout">
        <div className="af-selection">
          <div className="af-choices" role="group" aria-label="Choose an aviation program">
            {programs.map((program, index) => <button key={program.id} type="button"
              className="af-choice" aria-pressed={index === selectedIndex}
              aria-controls={`${instanceId}-program-${index}`}
              onClick={() => {
                setSelectedId(program.id);
                if (program.id !== selected.id) onProgramChange?.(program);
              }}>
              <span className="af-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <span><span className="af-category">{program.category}</span><strong>{program.name}</strong></span>
              <span className="af-choice-arrow" aria-hidden="true">↗</span>
            </button>)}
          </div>
          {navigationNote && <p className="af-navigation-note">{navigationNote}</p>}
        </div>
        {/* All panels occupy one grid cell. Hidden panels retain intrinsic sizing,
            so even long descriptions reserve space before they are selected. */}
        <div className="af-details">
          {programs.map((program, index) => {
            const active = index === selectedIndex;
            return <article key={program.id} id={`${instanceId}-program-${index}`}
              className={`af-program${active ? ' af-program-active' : ''}`}
              aria-hidden={!active} aria-label={program.name}>
              <figure className="af-photo">
                <ProgramPhoto image={program.image} />
                {program.photoLabel && <figcaption>{program.photoLabel}</figcaption>}
              </figure>
              <p className="af-audience">{program.audience}</p>
              <h3>{program.headline}</h3>
              <p className="af-description">{program.description}</p>
              <a className="af-cta" href={program.href} tabIndex={active ? 0 : -1}
                aria-label={`${program.ctaLabel || 'View program'}: ${program.name}`}>
                {program.ctaLabel || 'View program'}<span aria-hidden="true">↗</span>
              </a>
            </article>;
          })}
        </div>
      </div>
      <footer className="af-footer">
        {schoolsLink ? <a className="af-schools" href={schoolsLink.href}>{schoolsLink.label}<span aria-hidden="true"> →</span></a>
          : <span>{footerText}</span>}
        <button type="button" className="af-motion" aria-pressed={paused || reduced || speed === 0}
          disabled={reduced || speed === 0} onClick={() => setPaused(value => !value)}>
          {reduced ? 'Reduced motion enabled' : speed === 0 ? 'Static background' : paused ? 'Resume animation' : 'Pause animation'}
        </button>
      </footer>
      <span className="af-sr-only" aria-live="polite" aria-atomic="true">{selected.name} selected</span>
    </div>
  </section>;
}

export default AirflowPrograms;

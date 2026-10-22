import React, { useState } from 'react';
import ModelViewport from '../ModelViewport';

const SILHOUETTE_CONCEPTS = [
  {
    id: 'Sneaker',
    label: 'Footwear Volume Study',
    note: 'Procedural multi-sole silhouette study for camera blocking.',
  },
  {
    id: 'Watch',
    label: 'Horological Case Study',
    note: 'Procedural bezel, lug, and dial primitive blocking.',
  },
  {
    id: 'Eyewear',
    label: 'Optical Frame Study',
    note: 'Procedural double-bridge eyewear proportions.',
  },
  {
    id: 'Rings',
    label: 'Sculptural Ring Study',
    note: 'Procedural nested torus metallic shader test.',
  },
  {
    id: 'Gear',
    label: 'Structured Carry Study',
    note: 'Procedural architectural volume for lighting calibration.',
  },
];

export const ExperimentalConceptLab: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeConcept, setActiveConcept] = useState(SILHOUETTE_CONCEPTS[0]);

  return (
    <section
      className="mv-experimental-lab"
      aria-label="Experimental 3D Silhouette Lab (Non-Commercial)"
    >
      <div className="mv-experimental-lab__inner">
        <div className="mv-experimental-lab__bar">
          <div>
            <span className="mv-mono-kicker">
              TOOLKIT R&amp;D SANDBOX · NON-COMMERCIAL PROCEDURAL GEOMETRY
            </span>
            <h3>Experimental 3D Silhouette Lab</h3>
            <p>
              All primary MAISON VÉRA commercial sections above use verified photographic plates and
              licensed Khronos PBR <code>.glb</code> models. Procedural toolkit silhouettes are
              isolated in this opt-in R&amp;D sandbox for shader and camera blocking tests.
            </p>
          </div>
          <button
            type="button"
            className="studio-button studio-button--ghost"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
          >
            {isOpen ? 'Close Silhouette Sandbox' : 'Open R&D Silhouette Sandbox'}
          </button>
        </div>

        {isOpen && (
          <div className="mv-experimental-lab__Body">
            <div className="mv-experimental-lab__controls">
              {SILHOUETTE_CONCEPTS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={activeConcept.id === item.id ? 'is-active' : ''}
                  onClick={() => setActiveConcept(item)}
                >
                  <strong>{item.label}</strong>
                  <span>{item.note}</span>
                </button>
              ))}
            </div>
            <div className="mv-experimental-lab__stage">
              <ModelViewport
                modelPath={null}
                concept={activeConcept.id}
                accentColor="#c9a46b"
                secondaryColor="#d8cfc2"
                allowProceduralConcept={true}
                title={activeConcept.label}
                subtitle={activeConcept.note}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ExperimentalConceptLab;

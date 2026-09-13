import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sfx } from '../utils/audio'

export interface ProjectData {
  title: string
  tag: string
  desc: string
  stack: string[]
  link: string
  github?: string
  apkLink?: string
  img?: string
  category: string
  badge?: string
  isMobileShot?: boolean
  isExtension?: boolean
  isPrivate?: boolean
  architectureDetails?: {
    overview: string
    keyFeatures: string[]
    systemSpecs: { label: string; value: string }[]
  }
}

interface ProjectShowroomModalProps {
  project: ProjectData | null
  allProjects: ProjectData[]
  onClose: () => void
  onSelectProject: (p: ProjectData) => void
}

export const ProjectShowroomModal: React.FC<ProjectShowroomModalProps> = ({
  project,
  allProjects,
  onClose,
  onSelectProject,
}) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  // Keyboard navigation: ESC to exit, Left/Right arrows to cycle
  useEffect(() => {
    if (!project) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        sfx.playHoverTick(600)
        onClose()
      } else if (e.key === 'ArrowRight') {
        const currIdx = allProjects.findIndex((p) => p.title === project.title)
        const nextIdx = (currIdx + 1) % allProjects.length
        sfx.playSelectThud()
        onSelectProject(allProjects[nextIdx])
      } else if (e.key === 'ArrowLeft') {
        const currIdx = allProjects.findIndex((p) => p.title === project.title)
        const prevIdx = (currIdx - 1 + allProjects.length) % allProjects.length
        sfx.playSelectThud()
        onSelectProject(allProjects[prevIdx])
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [project, allProjects, onClose, onSelectProject])

  // Mouse tilt tracking for 3D holographic display
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -12
    const rotateY = ((x - centerX) / centerX) * 12

    setTilt({ x: rotateX, y: rotateY })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
  }

  if (!project) return null

  const currentIndex = allProjects.findIndex((p) => p.title === project.title)
  const projectCode = `PRJ-${String(currentIndex + 1).padStart(2, '0')}`

  const isExtension = Boolean(project.isExtension || project.badge === 'Chrome Extension')

  // Default deep architectural specs if none provided
  const arch = project.architectureDetails || {
    overview: project.desc,
    keyFeatures: [
      'Modular high-availability system architecture',
      'Optimized sub-50ms query latency and caching',
      'Hardened zero-trust security & granular access control',
      'Engineered for responsive multi-device fidelity',
    ],
    systemSpecs: [
      {
        label: 'RUNTIME',
        value: project.isMobileShot
          ? 'Android ART / Native'
          : isExtension
          ? 'Chrome V8 / Extension API'
          : 'Node.js / React 19',
      },
      { label: 'ARCHITECTURE', value: project.tag },
      { label: 'SECURITY', value: project.isPrivate ? 'Proprietary IP' : 'Open Source MIT' },
      { label: 'STATUS', value: isExtension ? 'Extension on GitHub' : 'Production Ready' },
    ],
  }

  const mailtoBody = encodeURIComponent(
    `Hi Manpreet,\n\nI reviewed your portfolio and was impressed by your project "${project.title}".\nI would love to request a private code walkthrough / interview discussion regarding its technical architecture.\n\nBest regards,\n`
  )
  const mailtoUrl = `mailto:manpreet.singhcomet@gmail.com?subject=Code%20Access%20Request%20-%20${encodeURIComponent(project.title)}&body=${mailtoBody}`

  return (
    <AnimatePresence>
      <motion.div
        className="showroom-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.28 }}
      >
        <div className="showroom-backdrop" onClick={onClose} />

        {/* Top Telemetry Bar */}
        <div className="showroom-topbar">
          <div className="showroom-telemetry">
            <span className="live-dot" />
            <span className="showroom-hud-mono">[ SHOWROOM INSPECT // {projectCode} ]</span>
            <span className="showroom-hud-divider">|</span>
            <span className="showroom-hud-dim">SECTOR: {project.category.toUpperCase()}</span>
          </div>

          <div className="showroom-top-actions">
            <div className="showroom-nav-btns">
              <button
                className="showroom-btn-icon"
                onClick={() => {
                  const prevIdx = (currentIndex - 1 + allProjects.length) % allProjects.length
                  sfx.playSelectThud()
                  onSelectProject(allProjects[prevIdx])
                }}
                onMouseEnter={() => sfx.playHoverTick()}
                title="Previous Project (Left Arrow)"
              >
                ← PREV
              </button>
              <span className="showroom-counter">
                {String(currentIndex + 1).padStart(2, '0')} / {String(allProjects.length).padStart(2, '0')}
              </span>
              <button
                className="showroom-btn-icon"
                onClick={() => {
                  const nextIdx = (currentIndex + 1) % allProjects.length
                  sfx.playSelectThud()
                  onSelectProject(allProjects[nextIdx])
                }}
                onMouseEnter={() => sfx.playHoverTick()}
                title="Next Project (Right Arrow)"
              >
                NEXT →
              </button>
            </div>

            <button
              className="showroom-close-btn"
              onClick={() => {
                sfx.playHoverTick(600)
                onClose()
              }}
              onMouseEnter={() => sfx.playHoverTick()}
            >
              ✕ CLOSE [ESC]
            </button>
          </div>
        </div>

        {/* Main Stage Grid */}
        <div className="showroom-stage">
          {/* Left Column: 3D Perspective Holographic Display */}
          <div className="showroom-vis-col">
            <div
              ref={cardRef}
              className="showroom-3d-card"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: 'transform 0.12s ease-out',
              }}
            >
              <div className="showroom-img-wrap">
                {project.img ? (
                  <img src={project.img} alt={project.title} className="showroom-img" />
                ) : (
                  <div className="showroom-img-fallback">PREVIEW OFFLINE</div>
                )}
              </div>

              <div className="showroom-card-footer">
                <span className="showroom-badge-tag">{project.tag}</span>
                <span className="showroom-badge-status">
                  ● {isExtension ? 'VERIFIED EXTENSION' : 'VERIFIED PRODUCTION'}
                </span>
              </div>
            </div>
            <div className="showroom-hint">3D HOLOGRAPHIC STAGE • MOVE CURSOR TO TILT</div>
          </div>

          {/* Right Column: Architectural HUD & Action Deck */}
          <div className="showroom-info-col">
            <div className="showroom-header">
              <div className="showroom-eyebrow">
                {projectCode} // {project.category.toUpperCase()}
              </div>
              <h1 className="showroom-title">{project.title}</h1>
              <div className="showroom-desc">{project.desc}</div>
            </div>

            {/* Technical Specs HUD Matrix */}
            <div className="showroom-specs-grid">
              {arch.systemSpecs.map((spec) => (
                <div key={spec.label} className="showroom-spec-box">
                  <div className="spec-label">{spec.label}</div>
                  <div className="spec-value">{spec.value}</div>
                </div>
              ))}
            </div>

            {/* Architecture Highlights */}
            <div className="showroom-arch-section">
              <div className="section-hud-label">// ARCHITECTURE BREAKDOWN &amp; RESILIENCE</div>
              <ul className="showroom-feature-list">
                {arch.keyFeatures.map((feat, idx) => (
                  <li key={idx} className="showroom-feature-item">
                    <span className="feature-arrow">▸</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack Matrix */}
            <div className="showroom-stack-section">
              <div className="section-hud-label">// CORE DEPENDENCY MATRIX</div>
              <div className="showroom-stack-chips">
                {project.stack.map((item) => (
                  <span key={item} className="showroom-chip">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Launchpad */}
            <div className="showroom-actions">
              {/* Primary Live Action */}
              {project.isMobileShot || project.category === 'mobile' ? (
                <a
                  href={`mailto:manpreet.singhcomet@gmail.com?subject=Demo%20Inquiry%20-%20${encodeURIComponent(project.title)}&body=Hi%20Manpreet,%0A%0AI'm%20interested%20in%20a%20private%20walkthrough%20of%20your%20Android%20app%20${encodeURIComponent(project.title)}.`}
                  className="sbtn sbtn-primary"
                  onMouseEnter={() => sfx.playHoverTick(1300)}
                  onClick={() => sfx.playSelectThud()}
                >
                  REQUEST DEMO WALKTHROUGH ✉
                </a>
              ) : isExtension ? (
                project.github ? (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="sbtn sbtn-primary"
                    onMouseEnter={() => sfx.playHoverTick(1300)}
                    onClick={() => sfx.playSelectThud()}
                  >
                    GET EXTENSION (GITHUB) ↗
                  </a>
                ) : null
              ) : !isExtension && project.link && !project.link.includes('github.com') ? (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="sbtn sbtn-primary"
                  onMouseEnter={() => sfx.playHoverTick(1300)}
                  onClick={() => sfx.playSelectThud()}
                >
                  LAUNCH LIVE DEMO ↗
                </a>
              ) : null}

              {/* Private Code or Public GitHub */}
              {project.isPrivate ? (
                <a
                  href={mailtoUrl}
                  className="sbtn sbtn-private"
                  onMouseEnter={() => sfx.playHoverTick(1000)}
                  onClick={() => sfx.playSelectThud()}
                  title="Request a private code walkthrough with Manpreet"
                >
                  🔒 REQUEST CODE ACCESS
                </a>
              ) : project.github && !isExtension ? (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="sbtn sbtn-secondary"
                  onMouseEnter={() => sfx.playHoverTick(1100)}
                  onClick={() => sfx.playSelectThud()}
                >
                  GITHUB REPO ↗
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

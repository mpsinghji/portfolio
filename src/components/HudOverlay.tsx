import React, { useState, useEffect } from 'react'
import { sfx } from '../utils/audio'

interface HudOverlayProps {
  currentSector: string
}

export const HudOverlay: React.FC<HudOverlayProps> = ({ currentSector }) => {
  const [sfxActive, setSfxActive] = useState<boolean>(true)
  const [timeStr, setTimeStr] = useState<string>('')

  useEffect(() => {
    setSfxActive(sfx.isEnabled())

    const updateClock = () => {
      const now = new Date()
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      setTimeStr(`${hours}:${minutes}:${seconds}`)
    }

    updateClock()
    const timer = setInterval(updateClock, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleToggleSfx = () => {
    const newState = sfx.toggle()
    setSfxActive(newState)
  }

  return (
    <div className="hud-telemetry-bar">
      {/* Audio Visualizer & Toggle */}
      <button
        className={`hud-audio-btn ${sfxActive ? 'active' : 'muted'}`}
        onClick={handleToggleSfx}
        onMouseEnter={() => sfx.playHoverTick(1200)}
        title={sfxActive ? 'Mute Sound Effects' : 'Enable Futuristic Sound Effects'}
      >
        <div className="hud-equalizer">
          <span className="eq-bar bar-1" />
          <span className="eq-bar bar-2" />
          <span className="eq-bar bar-3" />
          <span className="eq-bar bar-4" />
        </div>
        <span className="hud-audio-label">{sfxActive ? 'SFX ON' : 'SFX OFF'}</span>
      </button>

      {/* Real-Time Telemetry HUD */}
      <div className="hud-stats-group">
        <span className="hud-stat-item">
          <span className="hud-label">LOC:</span>
          <span className="hud-val">{currentSector.toUpperCase()}</span>
        </span>
        <span className="hud-stat-divider">/</span>
        <span className="hud-stat-item hud-hide-mobile">
          <span className="hud-label">SYS:</span>
          <span className="hud-val green">60 FPS</span>
        </span>
        <span className="hud-stat-divider hud-hide-mobile">/</span>
        <span className="hud-stat-item">
          <span className="hud-label">TIME:</span>
          <span className="hud-val">{timeStr}</span>
        </span>
      </div>
    </div>
  )
}

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CinematicTransitionProps {
  isTransitioning: boolean
  targetSection: string
}

export const CinematicTransition: React.FC<CinematicTransitionProps> = ({
  isTransitioning,
  targetSection,
}) => {
  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          className="cinematic-portal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          {/* Top & Bottom Shutter Blades (Lamborghini / GTA Style) */}
          <motion.div
            className="shutter-blade shutter-top"
            initial={{ y: '-100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.32, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.div
            className="shutter-blade shutter-bottom"
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.32, ease: [0.76, 0, 0.24, 1] }}
          />

          {/* Central Warp Telemetry & Scanline Grid */}
          <div className="portal-center-hud">
            <motion.div
              className="portal-badge"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.15, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="portal-scanline" />
              <div className="portal-status">
                <span className="pdot" /> HYPER-DRIVE ENGAGED
              </div>
              <div className="portal-target">
                SECTOR // {targetSection.toUpperCase()}
              </div>
              <div className="portal-sub">
                SYS.LATENCY: 0.18ms &nbsp;•&nbsp; 60 FPS &nbsp;•&nbsp; AUTH_VERIFIED
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

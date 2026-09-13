import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'
import * as THREE from 'three'
import emailjs from '@emailjs/browser'

import { sfx } from './utils/audio'
import { ProjectShowroomModal, type ProjectData } from './components/ProjectShowroomModal'

import callHelperMockup from './assets/callhelper_real_mockup.jpg'
import dynamicEdgeMockup from './assets/dynamicedge_real_mockup.jpg'
import blogVerseImg from './assets/BlogVerse.png'
import campusSyncImg from './assets/CampusSync.png'
import jobHuntImg from './assets/JobPortal.png'
import fileForgeImg from './assets/FileForge.png'
import speedControlImg from './assets/SpeedControl.png'

gsap.registerPlugin(ScrollTrigger, TextPlugin)

export type Project = ProjectData & {
  badge: string
  category: 'all' | 'web' | 'mobile' | 'tools'
}

const cubicEase: [number, number, number, number] = [0.22, 1, 0.36, 1]

const stageVariants: Variants = {
  initial: (dir: string) => {
    switch (dir) {
      case 'right': return { x: '100%', opacity: 0 }
      case 'left': return { x: '-100%', opacity: 0 }
      case 'up': return { y: '100%', opacity: 0 }
      case 'down': return { y: '-100%', opacity: 0 }
      case 'center': return { scale: 0.9, opacity: 0 }
      default: return { opacity: 0 }
    }
  },
  animate: {
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
    transition: { duration: 0.45, ease: cubicEase },
  },
  exit: (dir: string) => {
    switch (dir) {
      case 'right': return { x: '-35%', opacity: 0, transition: { duration: 0.3, ease: cubicEase } }
      case 'left': return { x: '35%', opacity: 0, transition: { duration: 0.3, ease: cubicEase } }
      case 'up': return { y: '-35%', opacity: 0, transition: { duration: 0.3, ease: cubicEase } }
      case 'down': return { y: '35%', opacity: 0, transition: { duration: 0.3, ease: cubicEase } }
      case 'center': return { scale: 1.05, opacity: 0, transition: { duration: 0.3 } }
      default: return { opacity: 0, transition: { duration: 0.3 } }
    }
  },
}

function HeroCode3D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const wrapRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    let raf = 0
    let renderer: THREE.WebGLRenderer | null = null

    const W = () => wrap.offsetWidth || 560
    const H = () => wrap.offsetHeight || 560

    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(W(), H())

      const S = new THREE.Scene()
      const C = new THREE.PerspectiveCamera(55, W() / H(), 0.1, 100)
      C.position.set(0, 0, 7)

      const grp = new THREE.Group()
      S.add(grp)

      const winW = 4
      const winH = 2.8
      const winGeo = new THREE.BoxGeometry(winW, winH, 0.06)
      const winMat = new THREE.MeshPhongMaterial({
        color: 0x040f0a,
        emissive: 0x010804,
        shininess: 80,
        transparent: true,
        opacity: 0.95,
      })
      const win = new THREE.Mesh(winGeo, winMat)
      grp.add(win)

      const edgeGeo = new THREE.EdgesGeometry(winGeo)
      const edgeMat = new THREE.LineBasicMaterial({ color: 0x00ff6a, transparent: true, opacity: 0.35 })
      grp.add(new THREE.LineSegments(edgeGeo, edgeMat))

      const tbGeo = new THREE.BoxGeometry(winW, 0.28, 0.07)
      const tbMat = new THREE.MeshPhongMaterial({ color: 0x061410, emissive: 0x021008, shininess: 20 })
      const tb = new THREE.Mesh(tbGeo, tbMat)
      tb.position.y = winH / 2 - 0.14
      grp.add(tb)

      const dots = [0xff5f56, 0xffbd2e, 0x27c93f]
      dots.forEach((c, i) => {
        const dg = new THREE.SphereGeometry(0.055, 12, 12)
        const dm = new THREE.MeshPhongMaterial({ color: c, emissive: c, emissiveIntensity: 0.4 })
        const d = new THREE.Mesh(dg, dm)
        d.position.set(-winW / 2 + 0.25 + i * 0.2, winH / 2 - 0.14, 0.05)
        grp.add(d)
      })

      const linesData = [
        { w: 2.8, c: 0x00ff6a, e: 0.4, y: 0.9 },
        { w: 1.8, c: 0x00ffe0, e: 0.3, y: 0.7 },
        { w: 2.4, c: 0xffffff, e: 0.1, y: 0.5 },
        { w: 1.2, c: 0x9d4edd, e: 0.4, y: 0.3 },
        { w: 2.6, c: 0x00ff6a, e: 0.35, y: 0.1 },
        { w: 2.0, c: 0xffbe0b, e: 0.3, y: -0.1 },
        { w: 1.5, c: 0x00ffe0, e: 0.3, y: -0.3 },
        { w: 2.3, c: 0xffffff, e: 0.1, y: -0.5 },
        { w: 1.9, c: 0x00ff6a, e: 0.3, y: -0.7 },
        { w: 2.5, c: 0x9d4edd, e: 0.3, y: -0.9 },
        { w: 1.4, c: 0x00ffe0, e: 0.4, y: -1.1 },
      ]
      const codeLines: Array<{ mesh: THREE.Mesh }> = []
      linesData.forEach((l) => {
        const lg = new THREE.BoxGeometry(l.w, 0.06, 0.08)
        const lm = new THREE.MeshPhongMaterial({
          color: l.c,
          emissive: l.c,
          emissiveIntensity: l.e,
          transparent: true,
          opacity: 0.85,
        })
        const m = new THREE.Mesh(lg, lm)
        m.position.set(-winW / 2 + 0.35 + l.w / 2, l.y, 0.04)
        grp.add(m)
        codeLines.push({ mesh: m })
      })

      const lnGeo = new THREE.BoxGeometry(0.18, winH - 0.3, 0.07)
      const lnMat = new THREE.MeshPhongMaterial({
        color: 0x020804,
        emissive: 0x010502,
        transparent: true,
        opacity: 0.9,
      })
      const ln = new THREE.Mesh(lnGeo, lnMat)
      ln.position.set(-winW / 2 + 0.14, -0.14, 0.04)
      grp.add(ln)

      const curGeo = new THREE.BoxGeometry(0.03, 0.18, 0.1)
      const curMat = new THREE.MeshPhongMaterial({ color: 0x00ff6a, emissive: 0x00ff6a, emissiveIntensity: 1 })
      const curMesh = new THREE.Mesh(curGeo, curMat)
      curMesh.position.set(-winW / 2 + 0.35 + 1.4 + 0.08, -1.1, 0.05)
      grp.add(curMesh)

      const floaters: Array<{ mesh: THREE.Mesh; lines: THREE.LineSegments; baseY: number; speed: number; phase: number }> = []
      const fData = [
        { w: 0.9, h: 0.55, x: 2.4, y: 1.2, z: 0.8, c: 0x00ff6a },
        { w: 0.8, h: 0.5, x: -2.3, y: -0.9, z: 0.6, c: 0x00ffe0 },
        { w: 0.7, h: 0.45, x: 2.2, y: -1.1, z: 0.5, c: 0x9d4edd },
      ]
      fData.forEach((f, i) => {
        const fg = new THREE.BoxGeometry(f.w, f.h, 0.05)
        const fm = new THREE.MeshPhongMaterial({ color: 0x040f0a, emissive: 0x010804, transparent: true, opacity: 0.85 })
        const fmesh = new THREE.Mesh(fg, fm)
        fmesh.position.set(f.x, f.y, f.z)
        const fe = new THREE.EdgesGeometry(fg)
        const fem = new THREE.LineBasicMaterial({ color: f.c, transparent: true, opacity: 0.4 })
        const flines = new THREE.LineSegments(fe, fem)
        flines.position.copy(fmesh.position)
        grp.add(fmesh)
        grp.add(flines)
        floaters.push({ mesh: fmesh, lines: flines, baseY: f.y, speed: 0.8 + i * 0.3, phase: i * 1.5 })
      })

      const tokens: Array<{ mesh: THREE.Mesh; angle: number; r: number; speed: number; y: number }> = []
      const tokenCols = [0x00ff6a, 0x00ffe0, 0x9d4edd, 0xffbe0b]
      for (let i = 0; i < 14; i++) {
        const tg = new THREE.BoxGeometry(0.2 + Math.random() * 0.3, 0.06, 0.06)
        const tc = tokenCols[i % tokenCols.length]
        const tm = new THREE.MeshPhongMaterial({ color: tc, emissive: tc, emissiveIntensity: 0.5, transparent: true, opacity: 0.7 })
        const tmesh = new THREE.Mesh(tg, tm)
        grp.add(tmesh)
        tokens.push({ mesh: tmesh, angle: (i / 14) * Math.PI * 2, r: 2.6 + Math.random() * 0.8, speed: 0.4 + Math.random() * 0.4, y: (Math.random() - 0.5) * 2.5 })
      }

      const light1 = new THREE.PointLight(0x00ff6a, 3, 15)
      light1.position.set(3, 3, 4)
      S.add(light1)
      const light2 = new THREE.PointLight(0x00ffe0, 2, 12)
      light2.position.set(-3, -2, 3)
      S.add(light2)
      const light3 = new THREE.PointLight(0x9d4edd, 1.5, 10)
      light3.position.set(0, -3, 2)
      S.add(light3)
      S.add(new THREE.AmbientLight(0x020c08, 0.8))

      let tX = 0
      let tY = 0
      let cX = 0
      let cY = 0
      const onMouseMove = (e: MouseEvent) => {
        const rect = wrap.getBoundingClientRect()
        tX = ((e.clientX - rect.left) / (rect.width || 1) - 0.5) * 2
        tY = ((e.clientY - rect.top) / (rect.height || 1) - 0.5) * 2
      }
      const onMouseLeave = () => {
        tX = 0
        tY = 0
      }
      wrap.addEventListener('mousemove', onMouseMove)
      wrap.addEventListener('mouseleave', onMouseLeave)

      const onResize = () => {
        if (!renderer || !canvas) return
        const w = wrap.offsetWidth || 560
        const h = wrap.offsetHeight || 560
        renderer.setSize(w, h)
        C.aspect = w / h
        C.updateProjectionMatrix()
      }
      window.addEventListener('resize', onResize)
      const ro = new ResizeObserver(onResize)
      ro.observe(wrap)

      let clT = 0
      const a = (t: number) => {
        raf = requestAnimationFrame(a)
        const sec = t * 0.001
        cX += (tX - cX) * 0.05
        cY += (tY - cY) * 0.05

        grp.rotation.y = cX * 0.35 + Math.sin(sec * 0.5) * 0.06
        grp.rotation.x = -cY * 0.25 + Math.cos(sec * 0.4) * 0.04
        grp.position.y = Math.sin(sec * 0.8) * 0.08

        curMesh.visible = Math.floor(sec * 2) % 2 === 0

        clT += 0.016
        if (clT > 0.08) {
          clT = 0
          const randLine = codeLines[Math.floor(Math.random() * codeLines.length)]
          if (randLine) {
            const mat = randLine.mesh.material as THREE.MeshPhongMaterial
            mat.emissiveIntensity = 0.8
            setTimeout(() => {
              mat.emissiveIntensity = 0.3
            }, 150)
          }
        }

        floaters.forEach((fl) => {
          fl.mesh.position.y = fl.baseY + Math.sin(sec * fl.speed + fl.phase) * 0.12
          fl.lines.position.y = fl.mesh.position.y
          fl.mesh.rotation.y = Math.sin(sec * 0.6 + fl.phase) * 0.08
          fl.lines.rotation.y = fl.mesh.rotation.y
        })

        tokens.forEach((tk) => {
          tk.angle += tk.speed * 0.01
          tk.mesh.position.x = Math.cos(tk.angle) * tk.r
          tk.mesh.position.y = tk.y + Math.sin(sec + tk.angle) * 0.15
          tk.mesh.position.z = Math.sin(tk.angle) * tk.r * 0.4 - 1
          tk.mesh.rotation.z = tk.angle * 0.3
        })

        renderer?.render(S, C)
      }
      a(0)

      return () => {
        cancelAnimationFrame(raf)
        ro.disconnect()
        wrap.removeEventListener('mousemove', onMouseMove)
        wrap.removeEventListener('mouseleave', onMouseLeave)
        window.removeEventListener('resize', onResize)
        renderer?.dispose()
      }
    } catch {
      // Graceful fallback
    }
  }, [])

  return (
    <div ref={wrapRef} className="hero-right">
      <canvas ref={canvasRef} id="hero-code-canvas" />
    </div>
  )
}

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const loaderRef = useRef<HTMLDivElement | null>(null)
  const [activeCategory, setActiveCategory] = useState<'all' | 'web' | 'mobile' | 'tools'>('all')

  // Multi-Stage Interactive App States
  const [currentView, setCurrentView] = useState<'home' | 'work' | 'about' | 'skills' | 'contact'>('home')
  const [direction, setDirection] = useState<'left' | 'right' | 'up' | 'down' | 'center'>('center')
  const [selectedShowroomProject, setSelectedShowroomProject] = useState<ProjectData | null>(null)
  const [timelineFilter, setTimelineFilter] = useState<'all' | 'experience' | 'education'>('all')

  const milestones = useMemo(
    () => [
      {
        id: 'm1',
        category: 'experience' as const,
        period: '2024 — Present',
        role: 'Full-Stack & Systems Developer',
        org: 'Freelance & Open Source · Remote',
        statusBadge: '● ACTIVE PRODUCTION',
        desc: 'Architected and shipped production SaaS platforms (DentalOS, SecureShare) and Android native telephony / AI edge inference systems.',
        tags: ['React 19', 'Node.js', 'PostgreSQL', 'Kotlin', 'Edge AI', 'Tailwind'],
      },
      {
        id: 'm2',
        category: 'experience' as const,
        period: '2023 — 2024',
        role: 'Open-Source Contributor & Tools Developer',
        org: 'Developer Communities & GitHub Ecosystem',
        statusBadge: '● OPEN SOURCE',
        desc: 'Contributed to developer utilities, REST API optimizations, and Chrome productivity extensions including media key controllers.',
        tags: ['JavaScript', 'Chrome Extension API', 'Git/GitHub', 'REST APIs', 'Vite'],
      },
      {
        id: 'm3',
        category: 'education' as const,
        period: '2022 — 2026',
        role: 'B.Tech in Computer Science & Engineering',
        org: 'University Engineering Program',
        statusBadge: '● GRADUATED / COMPLETED',
        desc: 'Completed comprehensive 4-year engineering degree with rigorous specialization in Data Structures & Algorithms, Distributed Systems, Operating Systems, Database Management, and Cryptography.',
        tags: ['Data Structures & Algorithms', 'Distributed Systems', 'Operating Systems', 'DBMS', 'Computer Networks'],
      },
      {
        id: 'm4',
        category: 'education' as const,
        period: 'Completed 2022',
        role: 'Senior Secondary Education (Class XII)',
        org: 'High School / Senior Secondary Board',
        statusBadge: '● COMPLETED (2022)',
        desc: 'Completed Higher Secondary education with core focus on Non-Medical Sciences (Physics, Chemistry, and Advanced Mathematics), developing strong analytical problem-solving foundations.',
        tags: ['Advanced Mathematics', 'Physics', 'Chemistry', 'Analytical Reasoning'],
      },
      {
        id: 'm5',
        category: 'education' as const,
        period: 'Completed 2020',
        role: 'Secondary School Examination (Class X)',
        org: 'High School / Secondary Board',
        statusBadge: '● COMPLETED (2020)',
        desc: 'Completed Secondary School Matriculation with distinction across Mathematics, General Sciences, and Information Technology fundamentals.',
        tags: ['Foundational Mathematics', 'General Science', 'Computer Fundamentals'],
      },
    ],
    [],
  )

  const filteredMilestones = useMemo(
    () => milestones.filter((m) => timelineFilter === 'all' || m.category === timelineFilter),
    [milestones, timelineFilter],
  )

  const projects = useMemo<Project[]>(
    () => [
      {
        title: 'DentalOS',
        link: 'https://github.com/mpsinghji/DentalOS',
        github: 'https://github.com/mpsinghji/DentalOS',
        img: 'https://i.postimg.cc/Y0hJ7qYB/dental-OS.png',
        tag: 'Clinic SaaS / Healthcare',
        badge: 'Full-Stack SaaS',
        category: 'web',
        isPrivate: true,
        desc: 'Cloud clinic management system with digital prescriptions, IP-lockout security, appointment scheduling, and patient records.',
        stack: ['React', 'Node.js', 'Express', 'MongoDB Atlas', 'Cloudinary'],
        architectureDetails: {
          overview: 'High-availability clinic operations portal engineered to centralize patient electronic health records (EHR), multi-doctor schedules, and automated medical billing.',
          keyFeatures: [
            'HIPAA-aligned Patient EHR & Prescription Workflow',
            'Doctor Multi-Calendar Slot Management & Real-time Booking',
            'IP-Lockout Security & Brute-Force Rate Limiting Middleware',
            'PDF Invoice & Prescription Generator with Cloudinary Storage',
          ],
          systemSpecs: [
            { label: 'SECURITY', value: 'IP-Lockout / JWT' },
            { label: 'DATABASE', value: 'MongoDB Atlas' },
            { label: 'LATENCY', value: '< 45ms P95' },
            { label: 'ACCESS', value: 'Private Enterprise' },
          ],
        },
      },
      {
        title: 'SecureShare',
        link: 'https://github.com/mpsinghji/SecureShare',
        github: 'https://github.com/mpsinghji/SecureShare',
        img: 'https://i.postimg.cc/tR3r16R6/secureshare.png',
        tag: 'Document Security / Cloud',
        badge: 'Enterprise SaaS',
        category: 'web',
        isPrivate: true,
        desc: 'High-security document distribution platform with granular access audits, encrypted cloud storage via Supabase S3, and Neon PostgreSQL.',
        stack: ['React', 'Node.js', 'PostgreSQL', 'Supabase', 'JWT'],
        architectureDetails: {
          overview: 'Enterprise-grade end-to-end encrypted document sharing platform with zero-trust role-based access control.',
          keyFeatures: [
            'Client-side AES-256-GCM chunked file encryption & streaming decryption',
            'Supabase S3 secure bucket storage with signed, time-limited token URLs',
            'Neon PostgreSQL relational schema for access logs & forensic audit trails',
            'Expiring one-time view links & tamper-proof download limits',
          ],
          systemSpecs: [
            { label: 'ENCRYPTION', value: 'AES-256-GCM' },
            { label: 'STORAGE', value: 'Supabase S3' },
            { label: 'DATABASE', value: 'Neon Postgres' },
            { label: 'ACCESS', value: 'Private Enterprise' },
          ],
        },
      },
      {
        title: 'CallHelper',
        link: '',
        github: 'https://github.com/mpsinghji/Call-Helper',
        img: callHelperMockup,
        tag: 'Android System Daemon',
        badge: 'Android Native',
        category: 'mobile',
        isPrivate: true,
        isMobileShot: true,
        desc: 'Intelligent incoming-call assistant that announces callers over Bluetooth/speaker, handles voice commands, and integrates Truecaller.',
        stack: ['Kotlin', 'Android SDK', 'Telecom API', 'Bluetooth SCO'],
        architectureDetails: {
          overview: 'Native Android background service utilizing telephony APIs to manage incoming calls completely hands-free via voice commands and Bluetooth.',
          keyFeatures: [
            'Real-time voice recognition loop during incoming ringing state',
            'Bluetooth SCO & A2DP audio routing for wireless earphones & vehicle head units',
            'Truecaller notification interception & speech announcement synthesis',
            'Android Foreground Service architecture with battery-saver optimization',
          ],
          systemSpecs: [
            { label: 'PLATFORM', value: 'Android ART / Kotlin' },
            { label: 'AUDIO', value: 'Bluetooth SCO / TTS' },
            { label: 'PERMISSIONS', value: 'Telecom / Notification' },
            { label: 'ACCESS', value: 'Private Native Build' },
          ],
        },
      },
      {
        title: 'Dynamic Edge AI',
        link: '',
        github: 'https://github.com/mpsinghji/DynamicEdgeAI',
        img: dynamicEdgeMockup,
        tag: 'Adaptive Edge AI',
        badge: 'Android AI Research',
        category: 'mobile',
        isPrivate: true,
        isMobileShot: true,
        desc: 'Adaptive edge-cloud AI system dynamically routing inference between on-device LLaMA C++ and Cloud Gemini based on RAM & thermals.',
        stack: ['Kotlin', 'Android SDK', 'LLaMA C++', 'Gemini API'],
        architectureDetails: {
          overview: 'Hybrid edge-cloud AI research system continuously balancing local on-device LLaMA C++ inference against cloud Gemini 1.5 Flash.',
          keyFeatures: [
            'Real-time device telemetry: monitors free RAM, CPU thermal load, and bandwidth',
            'Adaptive model switcher: auto-routes to on-device LLaMA when offline or low RAM',
            'Native C++ JNI bridge bindings for quantized GGUF weights',
            'Zero-data-leakage local fallback for privacy-sensitive prompts',
          ],
          systemSpecs: [
            { label: 'LOCAL ENGINE', value: 'LLaMA C++ (GGUF)' },
            { label: 'CLOUD ENGINE', value: 'Gemini 1.5 Flash' },
            { label: 'TELEMETRY', value: 'Live RAM & Thermals' },
            { label: 'ACCESS', value: 'Research Prototype' },
          ],
        },
      },
      {
        title: 'BlogVerse',
        link: 'https://mpji-blogverse.vercel.app',
        github: 'https://github.com/mpsinghji/BlogVerse',
        img: blogVerseImg,
        tag: 'Publishing Platform',
        badge: 'MERN Web App',
        category: 'web',
        desc: 'Full-featured blogging platform with authentication, rich text editor, comments system, interactions, and user profiles.',
        stack: ['React', 'Node.js', 'MongoDB', 'JWT'],
        architectureDetails: {
          overview: 'Content publishing web application designed for high editorial flexibility with real-time markdown parsing.',
          keyFeatures: [
            'Custom markdown & rich-text editor with instant live preview',
            'JWT authenticated session management with HTTP-only cookies',
            'Nested comment hierarchies and social reaction tracking',
            'RESTful API with Mongoose schema indexing',
          ],
          systemSpecs: [
            { label: 'STACK', value: 'MERN Architecture' },
            { label: 'DATABASE', value: 'MongoDB Atlas' },
            { label: 'AUTH', value: 'JWT / Bcrypt' },
            { label: 'STATUS', value: 'Live on Vercel' },
          ],
        },
      },
      {
        title: 'CampusSync',
        link: 'https://mpji-campus-sync.vercel.app/',
        github: 'https://github.com/mpsinghji/Campus-Sync',
        img: campusSyncImg,
        tag: 'Edu Management',
        badge: 'Full Stack',
        category: 'web',
        desc: 'College administration portal managing attendance, grade tracking, departmental circulars, and student-faculty records.',
        stack: ['React', 'Express', 'MongoDB', 'Tailwind'],
      },
      {
        title: 'JobHunt',
        link: 'https://mpji-jobhunt.vercel.app/',
        github: 'https://github.com/mpsinghji/JobHunt',
        img: jobHuntImg,
        tag: 'Recruitment Portal',
        badge: 'Full Stack',
        category: 'web',
        desc: 'Recruitment platform connecting employers and candidates with real-time application updates, job listings, and alerts.',
        stack: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
      },
      {
        title: 'FileForge',
        link: 'https://mpji-fileforge.vercel.app/',
        github: 'https://github.com/mpsinghji/FileForge',
        img: fileForgeImg,
        tag: 'Utility Suite',
        badge: 'Vite & TypeScript',
        category: 'tools',
        desc: 'Client-side file utility toolkit engineered for fast document transformations, format conversions, and workflow processing.',
        stack: ['React', 'TypeScript', 'Vite', 'Tailwind'],
      },
      {
        title: 'YT Speed Controller',
        link: '',
        github: 'https://github.com/mpsinghji/mediakey-controller',
        img: speedControlImg,
        tag: 'Browser Utility',
        badge: 'Chrome Extension',
        category: 'tools',
        isExtension: true,
        desc: 'Lightweight Chrome extension giving YouTube users granular playback speed adjustments, quick hotkeys, and sleek overlay.',
        stack: ['JavaScript', 'Chrome API', 'UI', 'Web'],
        architectureDetails: {
          overview: 'High-performance browser extension providing seamless YouTube video element hook injection and precise speed step modulation.',
          keyFeatures: [
            'Direct HTML5 Video Media Element API binding & event listeners',
            'Floating non-intrusive HUD with custom playback speed stepped presets',
            'Hotkeys mapping engine responding to keyboard accelerators',
            'Manifest V3 compliant with zero background telemetry overhead',
          ],
          systemSpecs: [
            { label: 'RUNTIME', value: 'Chrome Extension V3' },
            { label: 'TARGET', value: 'YouTube HTML5 Player' },
            { label: 'PERMISSIONS', value: 'ActiveTab / Storage' },
            { label: 'STATUS', value: 'Published on GitHub' },
          ],
        },
      },
    ],
    [],
  )

  const navigateTo = (view: 'home' | 'work' | 'about' | 'skills' | 'contact') => {
    if (view === currentView) return
    sfx.playSelectThud()
    if (view === 'work') setDirection('right')
    else if (view === 'about') setDirection('left')
    else if (view === 'skills') setDirection('center')
    else if (view === 'contact') setDirection('up')
    else setDirection('down')
    setCurrentView(view)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  useEffect(() => {
    // Cursor
    const cur = document.getElementById('cur')
    const ring = document.getElementById('cur-ring')
    const trail = document.getElementById('cur-trail')
    if (!cur || !ring || !trail) return

    let mx = 0
    let my = 0
    let rx = 0
    let ry = 0
    let tx2 = 0
    let ty2 = 0

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      cur.style.left = `${mx}px`
      cur.style.top = `${my}px`
    }
    document.addEventListener('mousemove', onMove)

    let rafId = 0
    const rf = () => {
      rx += (mx - rx) * 0.13
      ry += (my - ry) * 0.13
      ring.style.left = `${rx}px`
      ring.style.top = `${ry}px`
      tx2 += (mx - tx2) * 0.05
      ty2 += (my - ty2) * 0.05
      trail.style.left = `${tx2}px`
      trail.style.top = `${ty2}px`
      rafId = requestAnimationFrame(rf)
    }
    rafId = requestAnimationFrame(rf)

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  useEffect(() => {
    // Nav scroll background
    const nav = document.getElementById('nav')
    if (!nav) return
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    // Loader + hero reveal
    const lines = ['ll1', 'll2', 'll3', 'll4', 'll5']
    const lbar = document.getElementById('lbar')
    const lpct = document.getElementById('lpct')
    if (!lbar || !lpct) {
      setIsLoading(false)
      return
    }

    lines.forEach((id, i) => {
      window.setTimeout(() => gsap.to(`#${id}`, { opacity: 1, duration: 0.4 }), (i + 1) * 300)
    })

    let p = 0
    const lt = window.setInterval(() => {
      p += Math.random() * 5 + 2
      if (p >= 100) {
        p = 100
        window.clearInterval(lt)
        window.setTimeout(() => {
          const loader = loaderRef.current
          if (!loader) {
            setIsLoading(false)
            return
          }
          gsap.to(loader, {
            yPercent: -100,
            duration: 1,
            ease: 'power3.inOut',
            onComplete: () => {
              setIsLoading(false)
              revealHero()
            },
          })
        }, 600)
      }
      lbar.style.width = `${p}%`
      lpct.textContent = `${Math.floor(p)}%`
    }, 80)

    const revealHero = () => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.to('#he', { clipPath: 'inset(0 0% 0 0)', duration: 1, delay: 0.1 })
        .to('#hn', { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'expo.out' }, '-=.6')
        .to('#hr', { y: '0%', duration: 0.9, ease: 'expo.out' }, '-=.7')
        .to('#hd', { opacity: 1, y: 0, duration: 0.8 }, '-=.5')
        .to('#hb', { opacity: 1, y: 0, duration: 0.7 }, '-=.5')
        .to('#hbdg', { opacity: 1, duration: 0.6 }, '-=.4')
        .to('#shint', { opacity: 1, duration: 0.6 }, '-=.3')
      gsap.from('.hbadge', { opacity: 0, y: 12, stagger: 0.07, duration: 0.5, delay: 1.8 })
    }

    return () => window.clearInterval(lt)
  }, [])

  useEffect(() => {
    // Refresh ScrollTrigger and scroll position smoothly to top on view transition
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 150)
    return () => clearTimeout(timer)
  }, [currentView])

  useEffect(() => {
    const timer = setTimeout(() => {
      const cards = Array.from(document.querySelectorAll<HTMLElement>('.pcard'))
      const onMoveByCard = new Map<HTMLElement, (e: MouseEvent) => void>()
      const onLeaveByCard = new Map<HTMLElement, () => void>()

      cards.forEach((card) => {
        const onMove = (e: MouseEvent) => {
          const r = card.getBoundingClientRect()
          const x = e.clientX / r.width - r.left / r.width - 0.5
          const y = e.clientY / r.height - r.top / r.height - 0.5
          gsap.to(card, { rotateY: x * 8, rotateX: -y * 8, duration: 0.4, ease: 'power2.out', transformPerspective: 800 })
        }
        const onLeave = () => gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power3.out' })
        onMoveByCard.set(card, onMove)
        onLeaveByCard.set(card, onLeave)
        card.addEventListener('mousemove', onMove)
        card.addEventListener('mouseleave', onLeave)
      })

      return () => {
        cards.forEach((card) => {
          const om = onMoveByCard.get(card)
          const ol = onLeaveByCard.get(card)
          if (om) card.removeEventListener('mousemove', om)
          if (ol) card.removeEventListener('mouseleave', ol)
        })
      }
    }, 50)

    return () => clearTimeout(timer)
  }, [activeCategory])

  useEffect(() => {
    // Three.js scenes (ported from HTML, minimal cleanup)
    const cleanups: Array<() => void> = []

    const heroBg = () => {
      const canvas = document.getElementById('hero-bg-canvas') as HTMLCanvasElement | null
      if (!canvas) return

      const R = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
      R.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      R.setSize(window.innerWidth, window.innerHeight)

      const S = new THREE.Scene()
      const C = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100)
      C.position.z = 5

      const N = 2500
      const pos = new Float32Array(N * 3)
      const col = new Float32Array(N * 3)
      const vel = new Float32Array(N)
      for (let i = 0; i < N; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 20
        pos[i * 3 + 1] = Math.random() * 16 - 4
        pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2
        vel[i] = 0.02 + Math.random() * 0.06
        const t = Math.random()
        col[i * 3] = 0
        col[i * 3 + 1] = 0.4 + t * 0.6
        col[i * 3 + 2] = t * 0.2
      }
      const g = new THREE.BufferGeometry()
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      g.setAttribute('color', new THREE.BufferAttribute(col, 3))
      const pts = new THREE.Points(g, new THREE.PointsMaterial({ vertexColors: true, size: 0.04, transparent: true, opacity: 0.6 }))
      S.add(pts)

      const onResize = () => {
        C.aspect = window.innerWidth / window.innerHeight
        C.updateProjectionMatrix()
        R.setSize(window.innerWidth, window.innerHeight)
      }
      window.addEventListener('resize', onResize)
      cleanups.push(() => window.removeEventListener('resize', onResize))

      let raf = 0
      const a = () => {
        raf = requestAnimationFrame(a)
        const p = g.attributes.position.array as Float32Array
        for (let i = 0; i < N; i++) {
          p[i * 3 + 1] -= vel[i]
          if (p[i * 3 + 1] < -6) p[i * 3 + 1] = 10
        }
        g.attributes.position.needsUpdate = true
        R.render(S, C)
      }
      a()
      cleanups.push(() => cancelAnimationFrame(raf))
    }

    const contactVortex = () => {
      const canvas = document.getElementById('contact-canvas') as HTMLCanvasElement | null
      const sec = document.getElementById('contact')
      if (!canvas || !sec) return

      const W = () => sec.offsetWidth || window.innerWidth
      const H = () => sec.offsetHeight || window.innerHeight

      const R = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
      R.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      R.setSize(W(), H())

      const S = new THREE.Scene()
      const C = new THREE.PerspectiveCamera(70, W() / H(), 0.1, 100)
      C.position.z = 5

      const N = 2500
      const pos = new Float32Array(N * 3)
      const col = new Float32Array(N * 3)
      for (let i = 0; i < N; i++) {
        const t = i / N
        const a = t * Math.PI * 22
        const r = 0.15 + t * 3.5
        pos[i * 3] = Math.cos(a) * r + (Math.random() - 0.5) * 0.1
        pos[i * 3 + 1] = (Math.random() - 0.5) * 1.5
        pos[i * 3 + 2] = Math.sin(a) * r - t * 11
        col[i * 3] = 0
        col[i * 3 + 1] = 0.4 + t * 0.6
        col[i * 3 + 2] = t * 0.15
      }
      const g = new THREE.BufferGeometry()
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      g.setAttribute('color', new THREE.BufferAttribute(col, 3))
      const vortex = new THREE.Points(
        g,
        new THREE.PointsMaterial({ vertexColors: true, size: 0.03, transparent: true, opacity: 0.75 }),
      )
      // Shift vortex upward so it sits near the left text block.
      vortex.position.y = 1.6
      S.add(vortex)

      let raf = 0
      const a = (t: number) => {
        raf = requestAnimationFrame(a)
        S.rotation.z = t * 0.00025
        C.position.z = 5 + Math.sin(t * 0.0006) * 1.5
        R.render(S, C)
      }
      a(0)
      cleanups.push(() => cancelAnimationFrame(raf))
    }

    const aboutScene = () => {
      const canvas = document.getElementById('about-canvas') as HTMLCanvasElement | null
      if (!canvas) return
      const wrap = canvas.parentElement as HTMLElement | null
      if (!wrap) return

      const W = () => wrap.offsetWidth || 600
      const H = () => wrap.offsetHeight || window.innerHeight
      const R = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
      R.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      R.setSize(W(), H())
      const S = new THREE.Scene()
      const C = new THREE.PerspectiveCamera(55, W() / H(), 0.1, 100)
      C.position.set(0, 0, 6)

      const grp = new THREE.Group()
      S.add(grp)

      const cols = 12
      const rows = 7
      const levels = [0, 0.1, 0.3, 0.5, 0.7, 1.0]
      for (let r = 0; r < rows; r++) {
        for (let cc = 0; cc < cols; cc++) {
          const lv = levels[Math.floor(Math.random() * levels.length)]
          const bg = new THREE.BoxGeometry(0.28, 0.28, 0.05 + lv * 0.3)
          const bm = new THREE.MeshPhongMaterial({
            color: lv === 0 ? 0x061410 : 0x00ff6a,
            emissive: lv === 0 ? 0x000000 : 0x00ff6a,
            emissiveIntensity: lv * 0.8,
            transparent: true,
            opacity: lv === 0 ? 0.3 : 0.7 + lv * 0.3,
          })
          const bx = new THREE.Mesh(bg, bm)
          bx.position.set((cc - (cols / 2 - 0.5)) * 0.36, (r - (rows / 2 - 0.5)) * 0.36, 0)
          grp.add(bx)
        }
      }

      for (let i = 0; i < 8; i++) {
        const ln = new THREE.BoxGeometry(0.015, 4 + Math.random() * 2, 0.02)
        const lm = new THREE.MeshBasicMaterial({ color: 0x00ff6a, transparent: true, opacity: 0.06 + Math.random() * 0.06 })
        const lmesh = new THREE.Mesh(ln, lm)
        lmesh.position.set((Math.random() - 0.5) * 6, 0, -1)
        S.add(lmesh)
      }

      const al1 = new THREE.PointLight(0x00ff6a, 3, 15)
      al1.position.set(0, 0, 4)
      S.add(al1)
      const al2 = new THREE.PointLight(0x00ffe0, 1.5, 10)
      al2.position.set(3, 2, 2)
      S.add(al2)
      S.add(new THREE.AmbientLight(0x020c08, 1))

      const onResize = () => {
        R.setSize(W(), H())
        C.aspect = W() / H()
        C.updateProjectionMatrix()
      }
      window.addEventListener('resize', onResize)
      cleanups.push(() => window.removeEventListener('resize', onResize))

      let raf = 0
      const a = (t: number) => {
        raf = requestAnimationFrame(a)
        grp.rotation.y = Math.sin(t * 0.0004) * 0.25
        grp.rotation.x = Math.sin(t * 0.0003) * 0.1
        grp.children.forEach((b: THREE.Object3D, i: number) => {
          const m = (b as THREE.Mesh).material as THREE.MeshPhongMaterial
          if (m && 'emissiveIntensity' in m && m.emissiveIntensity > 0) {
            m.emissiveIntensity = 0.4 + Math.abs(Math.sin(t * 0.002 + i * 0.3)) * 0.5
          }
        })
        R.render(S, C)
      }
      a(0)
      cleanups.push(() => cancelAnimationFrame(raf))
    }

    const skillsGalaxy = () => {
      const wrap = document.getElementById('skills-orbit') as HTMLElement | null
      const canvas = document.getElementById('skills-canvas') as HTMLCanvasElement | null
      if (!wrap || !canvas) return

      const SIZE = wrap.offsetWidth || 480
      const R = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
      R.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      R.setSize(SIZE, SIZE)

      const S = new THREE.Scene()
      const C = new THREE.PerspectiveCamera(60, 1, 0.1, 100)
      C.position.set(0, 3.5, 6)
      C.lookAt(0, 0, 0)

      const N = 2000
      const pos = new Float32Array(N * 3)
      const col = new Float32Array(N * 3)
      for (let i = 0; i < N; i++) {
        const a = Math.random() * Math.PI * 2
        const r = 0.3 + Math.random() * 4
        const arm = (i % 3) * (Math.PI * 2 / 3)
        const twist = r * 0.6
        const sa = a + arm + twist
        pos[i * 3] = Math.cos(sa) * r + (Math.random() - 0.5) * 0.3
        pos[i * 3 + 1] = (Math.random() - 0.5) * 0.25
        pos[i * 3 + 2] = Math.sin(sa) * r + (Math.random() - 0.5) * 0.3
        const pct = r / 4
        col[i * 3] = pct * 0.2
        col[i * 3 + 1] = 0.3 + pct * 0.7
        col[i * 3 + 2] = pct * 0.3
      }
      const gG = new THREE.BufferGeometry()
      gG.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      gG.setAttribute('color', new THREE.BufferAttribute(col, 3))
      S.add(new THREE.Points(gG, new THREE.PointsMaterial({ vertexColors: true, size: 0.045, transparent: true, opacity: 0.9 })))

      const coreGeo = new THREE.OctahedronGeometry(0.5, 1)
      const coreMat = new THREE.MeshPhongMaterial({
        color: 0x020c08,
        emissive: 0x003322,
        emissiveIntensity: 1,
        wireframe: false,
        shininess: 300,
        specular: new THREE.Color(0x00ff6a),
      })
      S.add(new THREE.Mesh(coreGeo, coreMat))
      S.add(new THREE.Mesh(coreGeo, new THREE.MeshBasicMaterial({ color: 0x00ff6a, wireframe: true, transparent: true, opacity: 0.4 })))

      const skColors = [0x00ff6a, 0x00ffe0, 0xc8ff00, 0x9d4edd, 0xff8800, 0xff3b3b, 0x00ffe0, 0x00ff6a]
      const nodes = skColors.map((c, i) => {
        const ng = new THREE.SphereGeometry(0.14, 12, 12)
        const nm = new THREE.MeshPhongMaterial({ color: c, emissive: c, emissiveIntensity: 0.5, shininess: 200 })
        const mesh = new THREE.Mesh(ng, nm)
        S.add(mesh)
        return { mesh, a: i * (Math.PI * 2 / 8), r: 1.6 + (i % 3) * 0.7, sp: 0.01 + i * 0.001 }
      })

      const sl1 = new THREE.PointLight(0x00ff6a, 3, 12)
      sl1.position.set(0, 2, 3)
      S.add(sl1)
      const sl2 = new THREE.PointLight(0x00ffe0, 2, 10)
      sl2.position.set(-2, -1, 2)
      S.add(sl2)
      S.add(new THREE.AmbientLight(0x020c08, 1))

      let raf = 0
      const a = (t: number) => {
        raf = requestAnimationFrame(a)
        S.rotation.y = t * 0.0002
        nodes.forEach((n) => {
          n.a += n.sp
          n.mesh.position.x = Math.cos(n.a) * n.r
          n.mesh.position.z = Math.sin(n.a) * n.r
          n.mesh.position.y = Math.sin(n.a * 1.5) * 0.25
        })
        R.render(S, C)
      }
      a(0)
      cleanups.push(() => cancelAnimationFrame(raf))
    }

    const projectCanvases = () => {
      ;[
        { id: 'pc1', c1: 0x00ff6a },
        { id: 'pc2', c1: 0x00ffe0 },
        { id: 'pc3', c1: 0xc8ff00 },
        { id: 'pc4', c1: 0x9d4edd },
      ].forEach((d) => {
        const canvas = document.getElementById(d.id) as HTMLCanvasElement | null
        if (!canvas) return
        const R = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
        R.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        R.setSize(canvas.offsetWidth || 400, 200)
        const S = new THREE.Scene()
        const C = new THREE.PerspectiveCamera(60, (canvas.offsetWidth || 400) / 200, 0.1, 50)
        C.position.z = 3.5

        const wg = new THREE.BoxGeometry(3.2, 2, 0.06)
        const wm = new THREE.MeshPhongMaterial({ color: 0x020c08, emissive: 0x010804, shininess: 50, transparent: true, opacity: 0.9 })
        const win = new THREE.Mesh(wg, wm)
        S.add(win)
        const edges = new THREE.LineSegments(new THREE.EdgesGeometry(wg), new THREE.LineBasicMaterial({ color: d.c1, transparent: true, opacity: 0.4 }))
        S.add(edges)

          ;[
            [0.9, -0.55],
            [1.5, -0.75],
            [0.6, -0.95],
            [1.9, -1.15],
            [1.1, -1.35],
          ].forEach(([w, y]) => {
            const lg = new THREE.BoxGeometry(w, 0.055, 0.08)
            const lm = new THREE.MeshPhongMaterial({ color: d.c1, emissive: d.c1, emissiveIntensity: 0.35, transparent: true, opacity: 0.8 })
            const lmesh = new THREE.Mesh(lg, lm)
            lmesh.position.set(-(1.6 - w) / 2, y, 0.05)
            S.add(lmesh)
          })

        const tbg = new THREE.BoxGeometry(3.2, 0.22, 0.07)
        const tb = new THREE.Mesh(tbg, new THREE.MeshPhongMaterial({ color: 0x040f0a, emissive: 0x020806 }))
        tb.position.set(0, 0.89, 0.04)
        S.add(tb)
          ;[0xff5f57, 0xfebc2e, 0x00ff6a].forEach((c, i) => {
            const dm = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), new THREE.MeshPhongMaterial({ color: c, emissive: c, emissiveIntensity: 0.5 }))
            dm.position.set(-1.45 + i * 0.14, 0.89, 0.08)
            S.add(dm)
          })

        const pN = 200
        const pP = new Float32Array(pN * 3)
        for (let i = 0; i < pN * 3; i++) pP[i] = (Math.random() - 0.5) * 7
        const pg = new THREE.BufferGeometry()
        pg.setAttribute('position', new THREE.BufferAttribute(pP, 3))
        S.add(new THREE.Points(pg, new THREE.PointsMaterial({ color: d.c1, size: 0.022, transparent: true, opacity: 0.35 })))

        const pl1 = new THREE.PointLight(d.c1, 3, 8)
        pl1.position.set(1, 1, 2)
        S.add(pl1)
        const pl2 = new THREE.PointLight(0x00ffe0, 1, 8)
        pl2.position.set(-1, -1, 1)
        S.add(pl2)
        S.add(new THREE.AmbientLight(0x020c08, 0.5))

        let raf = 0
        const a = (t: number) => {
          raf = requestAnimationFrame(a)
          win.rotation.y = Math.sin(t * 0.0006) * 0.25
          win.rotation.x = Math.sin(t * 0.0004) * 0.1
          edges.rotation.copy(win.rotation)
          R.render(S, C)
        }
        a(0)
        cleanups.push(() => cancelAnimationFrame(raf))
      })
    }

    heroBg()
    aboutScene()
    skillsGalaxy()
    projectCanvases()
    contactVortex()

    return () => {
      cleanups.forEach((c) => c())
    }
  }, [])

  const onSendMessage = async () => {
    const name = (document.getElementById('cf-name') as HTMLInputElement | null)?.value.trim() || ''
    const email = (document.getElementById('cf-email') as HTMLInputElement | null)?.value.trim() || ''
    const msg = (document.getElementById('cf-msg') as HTMLTextAreaElement | null)?.value.trim() || ''
    const fb = document.getElementById('cf-fb')
    const sendBtn = document.getElementById('cf-send') as HTMLButtonElement | null
    if (!fb) return

    if (!name || !email || !msg) {
      fb.className = 'cf-fb err'
      fb.textContent = 'Please fill all fields.'
      return
    }

    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      fb.className = 'cf-fb err'
      fb.textContent = 'Email service is not configured.'
      return
    }

    try {
      if (sendBtn) sendBtn.disabled = true
      fb.className = 'cf-fb'
      fb.textContent = 'Sending...'

      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: name,
          from_email: email,
          reply_to: email,
          message: msg,
          to_name: 'Manpreet Singh',
        },
        PUBLIC_KEY,
      )

      fb.className = 'cf-fb ok'
      fb.textContent = '✓ Message sent successfully.'

      const nm = document.getElementById('cf-name') as HTMLInputElement | null
      const em = document.getElementById('cf-email') as HTMLInputElement | null
      const ta = document.getElementById('cf-msg') as HTMLTextAreaElement | null
      if (nm) nm.value = ''
      if (em) em.value = ''
      if (ta) ta.value = ''
    } catch {
      fb.className = 'cf-fb err'
      fb.textContent = 'Failed to send message. Please try again.'
    } finally {
      if (sendBtn) sendBtn.disabled = false
    }
  }

  return (
    <>
      <div id="cur" />
      <div id="cur-ring" />
      <div id="cur-trail" />

      {isLoading && (
        <div id="loader" ref={loaderRef}>
          <div className="ld-terminal">
            <div className="ld-titlebar">
              <div className="ld-dot ld-dot-r" />
              <div className="ld-dot ld-dot-y" />
              <div className="ld-dot ld-dot-g" />
              <span className="ld-titlebar-name">manpreet@portfolio ~ zsh</span>
            </div>
            <div className="ld-body" id="ld-body">
              <div className="ld-line" id="ll1">
                <span className="prompt">❯ </span>
                <span className="path">~/portfolio</span>
                <span className="cmd"> npm run dev</span>
              </div>
              <div className="ld-line" id="ll2">
                <span className="ok">✓</span>
                <span className="cmd"> Loading modules...</span>
              </div>
              <div className="ld-line" id="ll3">
                <span className="ok">✓</span>
                <span className="cmd"> Compiling Three.js scenes</span>
              </div>
              <div className="ld-line" id="ll4">
                <span className="warn">⚡</span>
                <span className="cmd"> Warming up animations</span>
              </div>
              <div className="ld-line" id="ll5">
                <span className="ok">✓</span>
                <span className="cmd"> Portfolio ready on localhost:3000</span>
              </div>
            </div>
            <div className="ld-bar-row">
              <div className="ld-bar-wrap">
                <div className="ld-bar" id="lbar" />
              </div>
              <div className="ld-pct" id="lpct">
                0%
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Background Ambient Canvas */}
      <canvas
        id="hero-bg-canvas"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          opacity: 0.65,
        }}
      />

      <nav id="nav">
        <button
          type="button"
          className="nav-logo"
          onClick={() => navigateTo('home')}
          onMouseEnter={() => sfx.playHoverTick(1100)}
        >
          <span className="nav-logo-bracket">[</span>MP<span className="nav-logo-bracket">]</span>
        </button>

        <div className="nav-links">
          <button
            type="button"
            className={`nav-link-btn ${currentView === 'work' ? 'active' : ''}`}
            onClick={() => navigateTo('work')}
            onMouseEnter={() => sfx.playHoverTick(1100)}
          >
            work
          </button>
          <button
            type="button"
            className={`nav-link-btn ${currentView === 'about' ? 'active' : ''}`}
            onClick={() => navigateTo('about')}
            onMouseEnter={() => sfx.playHoverTick(1100)}
          >
            about
          </button>
          <button
            type="button"
            className={`nav-link-btn ${currentView === 'skills' ? 'active' : ''}`}
            onClick={() => navigateTo('skills')}
            onMouseEnter={() => sfx.playHoverTick(1100)}
          >
            skills
          </button>
          <button
            type="button"
            className={`nav-link-btn ${currentView === 'contact' ? 'active' : ''}`}
            onClick={() => navigateTo('contact')}
            onMouseEnter={() => sfx.playHoverTick(1100)}
          >
            contact
          </button>
        </div>

        <a
          href="/Resume.pdf"
          download="Resume.pdf"
          className="nav-cta"
          onMouseEnter={() => sfx.playHoverTick(1300)}
          onClick={() => sfx.playSelectThud()}
        >
          resume ↗
        </a>
      </nav>

      <main className="app-stage-container">
        <AnimatePresence mode="wait" custom={direction}>
          {/* =========================================================================
              STAGE 1: HOME (Focused, Punchy, Interactive Portals)
              ========================================================================= */}
          {currentView === 'home' && (
            <motion.div
              key="home"
              custom={direction}
              variants={stageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="stage-wrapper"
            >
              <section id="hero" style={{ minHeight: 'calc(100vh - 5rem)', borderBottom: 'none' }}>
                <div className="hero-left">
                  <div className="hero-eyebrow" id="he">
                    Full-Stack Developer &amp; Systems Architect
                  </div>
                  <div className="hero-name" id="hn">
                    MANPREET
                    <br />
                    <span className="line-g">SINGH</span>
                  </div>
                  <div className="hero-role-wrap">
                    <div className="hero-role" id="hr">
                      Building production web architectures &amp; native systems.
                    </div>
                  </div>
                  <p className="hero-desc" id="hd">
                    Crafting scalable cloud platforms, MERN applications, and adaptive edge AI systems.
                    <br />
                    B.Tech CSE · Open Source Contributor · Available for high-impact roles.
                  </p>
                  <div className="hero-btns" id="hb">
                    <button
                      type="button"
                      className="hbtn fill"
                      onClick={() => navigateTo('work')}
                      onMouseEnter={() => sfx.playHoverTick(1200)}
                    >
                      Explore Projects [09] <span>→</span>
                    </button>
                    <button
                      type="button"
                      className="hbtn ghost"
                      onClick={() => navigateTo('contact')}
                      onMouseEnter={() => sfx.playHoverTick(1200)}
                    >
                      Initiate Contact
                    </button>
                  </div>
                  <div className="hero-badges" id="hbdg">
                    {['React 19', 'Node.js', 'Kotlin', 'MongoDB Atlas', 'PostgreSQL', 'Three.js', 'LLaMA C++'].map((b) => (
                      <span key={b} className="hbadge">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
                <HeroCode3D />
              </section>

              {/* Interactive Sector Portals (Clickable Stages) */}
              <div className="home-portals-container">
                <div className="eyebrow" style={{ marginBottom: '0.5rem' }}>Interactive Disciplines</div>
                <h2 style={{ fontFamily: 'var(--display)', fontSize: '2.5rem', margin: '0 0 1.5rem', color: '#fff' }}>
                  EXPLORE THE PORTFOLIO
                </h2>
                <div className="home-portals-grid">
                  <div
                    className="portal-card"
                    onClick={() => navigateTo('work')}
                    onMouseEnter={() => sfx.playHoverTick(1100)}
                  >
                    <div>
                      <div className="portal-card-num">[ 01 // SELECTED WORK ]</div>
                      <div className="portal-card-title">Production Projects</div>
                      <div className="portal-card-desc">
                        Explore DentalOS, SecureShare, CallHelper, Dynamic Edge AI and 5 more verified applications.
                      </div>
                    </div>
                    <div className="portal-card-action">
                      OPEN WORKSPACE <span>→</span>
                    </div>
                  </div>

                  <div
                    className="portal-card"
                    onClick={() => navigateTo('about')}
                    onMouseEnter={() => sfx.playHoverTick(1100)}
                  >
                    <div>
                      <div className="portal-card-num">[ 02 // DEVELOPER JOURNEY ]</div>
                      <div className="portal-card-title">Engineering Story</div>
                      <div className="portal-card-desc">
                        Career milestones, computer science foundation, and development principles.
                      </div>
                    </div>
                    <div className="portal-card-action">
                      READ PROFILE <span>→</span>
                    </div>
                  </div>

                  <div
                    className="portal-card"
                    onClick={() => navigateTo('skills')}
                    onMouseEnter={() => sfx.playHoverTick(1100)}
                  >
                    <div>
                      <div className="portal-card-num">[ 03 // SYSTEMS MATRIX ]</div>
                      <div className="portal-card-title">Skills &amp; Capabilities</div>
                      <div className="portal-card-desc">
                        Deep dive into full-stack frontend, backend APIs, cloud databases, and on-device AI.
                      </div>
                    </div>
                    <div className="portal-card-action">
                      VIEW CAPABILITIES <span>→</span>
                    </div>
                  </div>

                  <div
                    className="portal-card"
                    onClick={() => navigateTo('contact')}
                    onMouseEnter={() => sfx.playHoverTick(1100)}
                  >
                    <div>
                      <div className="portal-card-num">[ 04 // DIRECT CONTACT ]</div>
                      <div className="portal-card-title">Get in Touch</div>
                      <div className="portal-card-desc">
                        Direct channels via Email, LinkedIn, GitHub, or terminal message dispatch.
                      </div>
                    </div>
                    <div className="portal-card-action">
                      REACH OUT <span>→</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* =========================================================================
              STAGE 2: WORK (Interactive Projects Gallery)
              ========================================================================= */}
          {currentView === 'work' && (
            <motion.div
              key="work"
              custom={direction}
              variants={stageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="stage-wrapper"
              style={{ paddingBottom: '5rem' }}
            >
              <div className="proj-hdr" style={{ paddingTop: '2.5rem' }}>
                <div>
                  <div className="eyebrow">Portfolio Showcase</div>
                  <div className="proj-ht">
                    FEATURED <span className="line-g">PROJECTS</span>
                  </div>
                </div>
                <div className="proj-meta">{String(projects.length).padStart(2, '0')} VERIFIED BUILDS</div>
              </div>

              <div className="proj-filters">
                {[
                  { id: 'all', label: `All Projects (${projects.length})` },
                  { id: 'web', label: 'Full-Stack & SaaS' },
                  { id: 'mobile', label: 'Android Apps' },
                  { id: 'tools', label: 'Tools & Extensions' },
                ].map((f) => (
                  <button
                    key={f.id}
                    className={`proj-filter-btn ${activeCategory === f.id ? 'active' : ''}`}
                    onClick={() => {
                      sfx.playSelectThud()
                      setActiveCategory(f.id as any)
                    }}
                    onMouseEnter={() => sfx.playHoverTick(1100)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="proj-grid">
                {projects
                  .filter((p) => activeCategory === 'all' || p.category === activeCategory)
                  .map((project, index) => {
                    const cardNumber = String(index + 1).padStart(2, '0')
                    const mailtoBody = encodeURIComponent(
                      `Hi Manpreet,\n\nI would love to request a private code walkthrough for "${project.title}".\n\nBest regards,\n`
                    )
                    const mailtoUrl = `mailto:manpreet.singhcomet@gmail.com?subject=Code%20Access%20Request%20-%20${encodeURIComponent(project.title)}&body=${mailtoBody}`

                    return (
                      <motion.div
                        className="pcard"
                        id={`pfc${index + 1}`}
                        key={project.title}
                        layout
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: index * 0.05 }}
                        onMouseEnter={() => sfx.playHoverTick(900)}
                      >
                        <div
                          className="pcard-vis"
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            sfx.playSelectThud()
                            setSelectedShowroomProject(project as any)
                          }}
                          title="Click to enter 3D Inspect Mode"
                        >
                          {project.img ? (
                            <img className="pcard-img" src={project.img} alt={project.title} loading="lazy" />
                          ) : (
                            <div className="pcard-img pcard-img-fallback">COMING SOON</div>
                          )}
                          {project.badge && <span className="pcard-badge">{project.badge}</span>}
                          <div className="pcard-num">{cardNumber}</div>
                        </div>
                        <div className="pcard-body">
                          <div className="pcard-tag">{project.tag}</div>
                          <div
                            className="pcard-ttl"
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              sfx.playSelectThud()
                              setSelectedShowroomProject(project as any)
                            }}
                          >
                            {project.title}
                          </div>
                          <div className="pcard-desc">{project.desc}</div>
                          <div className="pcard-stack">
                            {project.stack.map((c) => (
                              <span key={c} className="chip">
                                {c}
                              </span>
                            ))}
                          </div>

                          {/* Inspect Modal Trigger */}
                          <button
                            type="button"
                            className="pcard-inspect-trigger"
                            onClick={() => {
                              sfx.playSelectThud()
                              setSelectedShowroomProject(project as any)
                            }}
                            onMouseEnter={() => sfx.playHoverTick(1200)}
                          >
                            <span>⚡</span> INSPECT SPECS &amp; ARCHITECTURE ↗
                          </button>

                          <div className="pcard-actions">
                            {project.isMobileShot ? (
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '8px' }}>
                                <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '1px', color: 'var(--cyan)' }}>
                                  📱 Android Native
                                </span>
                                {project.isPrivate ? (
                                  <a
                                    href={mailtoUrl}
                                    className="pcard-btn-sec"
                                    style={{ color: '#ffaa00', borderColor: 'rgba(255,170,0,0.35)' }}
                                    onMouseEnter={() => sfx.playHoverTick(1100)}
                                    onClick={() => sfx.playSelectThud()}
                                    title="Request private demo walkthrough"
                                  >
                                    🔒 Code on Request
                                  </a>
                                ) : (
                                  <a
                                    href={project.github || project.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="pcard-btn-sec"
                                    onMouseEnter={() => sfx.playHoverTick(1100)}
                                  >
                                    GitHub Repo ↗
                                  </a>
                                )}
                              </div>
                            ) : (project.isExtension || project.badge === 'Chrome Extension') ? (
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '8px' }}>
                                <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '1px', color: 'var(--lime)' }}>
                                  🧩 Chrome Extension
                                </span>
                                {project.github && (
                                  <a
                                    href={project.github}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="pcard-btn-sec"
                                    onMouseEnter={() => sfx.playHoverTick(1100)}
                                  >
                                    GitHub Repo ↗
                                  </a>
                                )}
                              </div>
                            ) : (
                              <>
                                {!project.isExtension && project.badge !== 'Chrome Extension' && project.link && !project.link.includes('github.com') ? (
                                  <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="pcard-link"
                                    onMouseEnter={() => sfx.playHoverTick(1200)}
                                    onClick={() => sfx.playSelectThud()}
                                  >
                                    Live Demo →
                                  </a>
                                ) : null}
                                {project.isPrivate ? (
                                  <a
                                    href={mailtoUrl}
                                    className="pcard-btn-sec"
                                    style={{ color: '#ffaa00', borderColor: 'rgba(255,170,0,0.35)' }}
                                    onMouseEnter={() => sfx.playHoverTick(1100)}
                                    onClick={() => sfx.playSelectThud()}
                                    title="Request private code review"
                                  >
                                    🔒 Code on Request
                                  </a>
                                ) : project.github ? (
                                  <a
                                    href={project.github}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="pcard-btn-sec"
                                    onMouseEnter={() => sfx.playHoverTick(1100)}
                                  >
                                    Source Code ↗
                                  </a>
                                ) : null}
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
              </div>
            </motion.div>
          )}

          {/* =========================================================================
              STAGE 3: ABOUT (Developer Story & Milestones)
              ========================================================================= */}
          {currentView === 'about' && (
            <motion.div
              key="about"
              custom={direction}
              variants={stageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="stage-wrapper"
              style={{ paddingBottom: '5rem' }}
            >
              <section id="about" style={{ paddingTop: '2.5rem' }}>
                <div className="about-text" id="about-txt">
                  <div className="eyebrow">// OPERATOR PROFILE &amp; PHILOSOPHY</div>
                  <h1 className="about-h">
                    ENGINEERING
                    <br />
                    <span className="line-g">RELIABILITY</span>
                  </h1>
                  <p className="about-p">
                    I'm <strong>Manpreet Singh</strong>, a Full-Stack Developer &amp; Systems Engineer. I have graduated with my <strong>B.Tech in Computer Science &amp; Engineering (2022 — 2026)</strong>, building on strong analytical foundations in senior secondary non-medical science (completed 2022) and matriculation (completed 2020).
                  </p>
                  <p className="about-p">
                    My engineering work bridges end-to-end cloud architectures (React, Node.js, MongoDB Atlas, Neon PostgreSQL) to Android system services and on-device edge AI routing.
                  </p>

                  <div className="about-facts-grid">
                    <div className="hud-fact-card">
                      <div className="hud-fact-hdr">
                        <span className="hud-fact-label">ACADEMIC DEGREE</span>
                        <span className="hud-fact-badge active">GRADUATED</span>
                      </div>
                      <div className="hud-fact-val">B.Tech in CSE</div>
                      <div className="hud-fact-sub">2022 — 2026 · Completed</div>
                    </div>

                    <div className="hud-fact-card">
                      <div className="hud-fact-hdr">
                        <span className="hud-fact-label">AVAILABILITY</span>
                        <span className="hud-fact-badge active">● LIVE</span>
                      </div>
                      <div className="hud-fact-val">Available for Hire</div>
                      <div className="hud-fact-sub">Full-Time &amp; Remote Roles</div>
                    </div>

                    <div className="hud-fact-card">
                      <div className="hud-fact-hdr">
                        <span className="hud-fact-label">LOCATION</span>
                        <span className="hud-fact-badge">GLOBAL</span>
                      </div>
                      <div className="hud-fact-val">India</div>
                      <div className="hud-fact-sub">Open to Remote &amp; Relocation</div>
                    </div>

                    <div className="hud-fact-card">
                      <div className="hud-fact-hdr">
                        <span className="hud-fact-label">ACADEMIC TIMELINE</span>
                        <span className="hud-fact-badge">VERIFIED</span>
                      </div>
                      <div className="hud-fact-val">10th ('20) → 12th ('22) → B.Tech ('26)</div>
                      <div className="hud-fact-sub">Science &amp; Engineering Track</div>
                    </div>
                  </div>

                  <div className="hero-btns" style={{ marginTop: '1.5rem' }}>
                    <button
                      type="button"
                      className="hbtn fill"
                      onClick={() => navigateTo('work')}
                      onMouseEnter={() => sfx.playHoverTick(1100)}
                    >
                      View Projects <span>→</span>
                    </button>
                    <button
                      type="button"
                      className="hbtn ghost"
                      onClick={() => navigateTo('contact')}
                      onMouseEnter={() => sfx.playHoverTick(1100)}
                    >
                      Contact Me
                    </button>
                  </div>
                </div>

                <div className="about-timeline-side">
                  <div className="timeline-header-row">
                    <div>
                      <div className="eyebrow" style={{ marginBottom: '0.4rem' }}>// CHRONOLOGICAL RECORD</div>
                      <div className="exp-h" style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)', marginBottom: '0', lineHeight: 1 }}>
                        CAREER &amp; <span style={{ WebkitTextStroke: '1px rgba(0,255,106,.25)', color: 'transparent' }}>EDUCATION</span>
                      </div>
                    </div>

                    <div className="timeline-filter-tabs">
                      <button
                        type="button"
                        className={`tl-tab ${timelineFilter === 'all' ? 'active' : ''}`}
                        onClick={() => {
                          sfx.playSelectThud()
                          setTimelineFilter('all')
                        }}
                        onMouseEnter={() => sfx.playHoverTick(1100)}
                      >
                        ALL ({milestones.length})
                      </button>
                      <button
                        type="button"
                        className={`tl-tab ${timelineFilter === 'experience' ? 'active' : ''}`}
                        onClick={() => {
                          sfx.playSelectThud()
                          setTimelineFilter('experience')
                        }}
                        onMouseEnter={() => sfx.playHoverTick(1100)}
                      >
                        EXPERIENCE (2)
                      </button>
                      <button
                        type="button"
                        className={`tl-tab ${timelineFilter === 'education' ? 'active' : ''}`}
                        onClick={() => {
                          sfx.playSelectThud()
                          setTimelineFilter('education')
                        }}
                        onMouseEnter={() => sfx.playHoverTick(1100)}
                      >
                        EDUCATION (3)
                      </button>
                    </div>
                  </div>

                  <div className="tl">
                    {filteredMilestones.map((m) => (
                      <div key={m.id} className="tli">
                        <div className={`tli-dot ${m.category === 'education' ? 'dot-cyan' : 'dot-green'}`} />
                        <div className="tli-topline">
                          <span className="tli-p">{m.period}</span>
                          <span className={`tli-type-badge ${m.category === 'education' ? 'badge-cyan' : 'badge-green'}`}>
                            {m.category === 'education' ? '🎓 ACADEMICS' : '💼 EXPERIENCE'}
                          </span>
                          <span className="tli-status-pill">{m.statusBadge}</span>
                        </div>
                        <div className="tli-r">{m.role}</div>
                        <div className="tli-org">{m.org}</div>
                        <div className="tli-d">{m.desc}</div>
                        <div className="tli-tags">
                          {m.tags.map((t) => (
                            <span key={t} className="tli-tag">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {/* =========================================================================
              STAGE 4: SKILLS (Systems & Stack Matrix)
              ========================================================================= */}
          {currentView === 'skills' && (
            <motion.div
              key="skills"
              custom={direction}
              variants={stageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="stage-wrapper"
              style={{ paddingBottom: '5rem' }}
            >
              <section id="skills" style={{ paddingTop: '2.5rem' }}>
                <div className="eyebrow">Technical Competencies</div>
                <div className="skills-h">
                  STACK &amp; <span className="line-g">SYSTEMS</span>
                </div>
                <div className="sk-grid">
                  {[
                    {
                      cat: 'Frontend Architecture',
                      items: 'React 19, TypeScript, Next.js, Vite, Tailwind CSS, Three.js, GSAP, HTML5/CSS3',
                      pct: 92,
                      bg: 'linear-gradient(90deg, #00ff6a, #00f0ff)',
                    },
                    {
                      cat: 'Backend & Cloud',
                      items: 'Node.js, Express, MongoDB Atlas, Neon PostgreSQL, Supabase S3, REST APIs, JWT, Cloudinary',
                      pct: 88,
                      bg: 'linear-gradient(90deg, #00ff6a, #2aff88)',
                    },
                    {
                      cat: 'Android & Systems Engineering',
                      items: 'Kotlin, Android SDK, Android Telecom API, Bluetooth SCO, Foreground Services, Background Audio',
                      pct: 84,
                      bg: 'linear-gradient(90deg, #2aff88, #00e5ff)',
                    },
                    {
                      cat: 'Edge AI & Tooling',
                      items: 'LLaMA C++ (GGUF Quantization), Gemini API, Git/GitHub, Linux/Bash, Chrome Extension API',
                      pct: 80,
                      bg: 'linear-gradient(90deg, #00e5ff, #00ff6a)',
                    },
                  ].map((s) => (
                    <div key={s.cat} className="sk-card">
                      <div className="sk-cat">{s.cat}</div>
                      <div className="sk-items">{s.items}</div>
                      <div className="sk-bar-row">
                        <span className="sk-pct">{s.pct}%</span>
                      </div>
                      <div className="sk-track">
                        <div className="sk-fill" style={{ width: `${s.pct}%`, background: s.bg }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="skills-pills">
                  {['REST APIs', 'Auth Systems', 'Realtime Features', 'Responsive UI', 'Deployment', 'Testing', 'Edge AI', 'HIPAA/E2EE Security'].map((pill) => (
                    <span key={pill} className="skills-pill">
                      {pill}
                    </span>
                  ))}
                </div>
              </section>
            </motion.div>
          )}
          {/* =========================================================================
              STAGE 5: CONTACT (Magnetic Inversion Rows & Terminal Dispatch)
              ========================================================================= */}
          {currentView === 'contact' && (
            <motion.div
              key="contact"
              custom={direction}
              variants={stageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="stage-wrapper"
              style={{ paddingBottom: '5rem' }}
            >
              <div className="contact-stage-wrap">
                <div className="eyebrow" style={{ paddingTop: '2.5rem' }}>Direct Dispatch</div>
                <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(3rem, 7vw, 6.5rem)', lineHeight: 0.95, margin: '0.4rem 0 1.2rem', color: '#fff' }}>
                  LET'S START A<br />
                  <span style={{ WebkitTextStroke: '1px var(--g1)', color: 'transparent' }}>CONVERSATION</span>
                </h1>
                <p style={{ color: 'var(--muted2)', fontSize: '15px', maxWidth: '600px', lineHeight: 1.6, margin: '0 0 2rem' }}>
                  Available for Full-Stack Engineering, Android Native, and Edge AI roles. Hover over any channel below to connect directly:
                </p>

                {/* Magnetic Inversion Rows (Utsav-inspired) */}
                <div className="contact-magnetic-list">
                  <a
                    href="mailto:manpreet.singhcomet@gmail.com"
                    className="contact-row"
                    onMouseEnter={() => sfx.playHoverTick(1100)}
                    onClick={() => sfx.playSelectThud()}
                  >
                    <span className="contact-row-channel">Email</span>
                    <span className="contact-row-detail">
                      manpreet.singhcomet@gmail.com <span>↗</span>
                    </span>
                  </a>

                  <a
                    href="https://www.linkedin.com/in/manpreetsingh2004"
                    target="_blank"
                    rel="noreferrer"
                    className="contact-row"
                    onMouseEnter={() => sfx.playHoverTick(1100)}
                    onClick={() => sfx.playSelectThud()}
                  >
                    <span className="contact-row-channel">LinkedIn</span>
                    <span className="contact-row-detail">
                      linkedin.com/in/manpreetsingh2004 <span>↗</span>
                    </span>
                  </a>

                  <a
                    href="https://github.com/mpsinghji"
                    target="_blank"
                    rel="noreferrer"
                    className="contact-row"
                    onMouseEnter={() => sfx.playHoverTick(1100)}
                    onClick={() => sfx.playSelectThud()}
                  >
                    <span className="contact-row-channel">GitHub</span>
                    <span className="contact-row-detail">
                      github.com/mpsinghji <span>↗</span>
                    </span>
                  </a>

                  <a
                    href="/Resume.pdf"
                    download="Resume.pdf"
                    className="contact-row"
                    onMouseEnter={() => sfx.playHoverTick(1100)}
                    onClick={() => sfx.playSelectThud()}
                  >
                    <span className="contact-row-channel">Resume</span>
                    <span className="contact-row-detail">
                      Download PDF <span>⤓</span>
                    </span>
                  </a>
                </div>

                {/* Direct Message Form */}
                <div className="contact-wrap" style={{ padding: 0, marginTop: '2.5rem' }}>
                  <div className="contact-left">
                    <div className="contact-h" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
                      DROP A<br /><span className="g">DIRECT MESSAGE</span>
                    </div>
                    <p style={{ color: 'var(--muted2)', fontSize: '14px', lineHeight: 1.6 }}>
                      Send an encrypted inquiry directly from this terminal. Your message will be dispatched immediately.
                    </p>
                  </div>
                  <div className="contact-right">
                    <div className="cf-ttl">QUICK TERMINAL</div>
                    <div className="cf">
                      <input className="cf-in" id="cf-name" placeholder="Your Name" />
                      <input className="cf-in" id="cf-email" placeholder="Your Email" />
                      <textarea className="cf-in" id="cf-msg" rows={4} placeholder="Your Message" />
                      <button className="cf-btn" id="cf-send" onClick={onSendMessage} type="button">
                        Send Message →
                      </button>
                      <div className="cf-fb" id="cf-fb" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer>
        <div className="ft-logo">[MP.DEV]</div>
        <div className="ft-copy">Designed &amp; built by Manpreet Singh · © 2026</div>
      </footer>

      {/* 3D Full-Screen Project Inspect Showroom */}
      <ProjectShowroomModal
        project={selectedShowroomProject}
        allProjects={projects as any}
        onClose={() => setSelectedShowroomProject(null)}
        onSelectProject={(p) => setSelectedShowroomProject(p)}
      />
    </>
  )
}

export default App

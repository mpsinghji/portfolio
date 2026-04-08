import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'
import * as THREE from 'three'
import emailjs from '@emailjs/browser'

gsap.registerPlugin(ScrollTrigger, TextPlugin)

type Project = {
  title: string
  link: string
  img: string | null
  tag: string
  desc: string
  stack: string[]
  isMobileShot?: boolean
}

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const loaderRef = useRef<HTMLDivElement | null>(null)
  const [showAllProjects, setShowAllProjects] = useState(false)

  const projects = useMemo<Project[]>(
    () => [
      {
        title: 'BlogVerse',
        link: 'https://mpji-blogverse.vercel.app',
        img: 'https://i.postimg.cc/hjP3xQBg/Blog_Verse.png',
        tag: 'Blog App',
        desc: 'Full-featured blogging platform with auth, rich text editor, comments and user profiles.',
        stack: ['React', 'Node.js', 'MongoDB', 'JWT'],
      },
      {
        title: 'CampusSync',
        link: 'https://mpji-campus-sync.vercel.app/',
        img: 'https://i.postimg.cc/zBXPWH14/Campus_Sync.png',
        tag: 'Edu Management',
        desc: 'College management system with attendance, grades, notices, and student-faculty portal.',
        stack: ['React', 'Express', 'MongoDB', 'Tailwind'],
      },
      {
        title: 'JobHunt',
        link: 'https://mpji-jobhunt.vercel.app/',
        img: 'https://i.postimg.cc/Y9qygLHM/Job_Portal.png',
        tag: 'Job Portal',
        desc: 'Job portal where employers post listings and candidates apply with real-time notifications.',
        stack: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
      },
      { title: 'FileForge',
        link: 'https://mpji-fileforge.vercel.app/',
        img: 'https://i.postimg.cc/FRsnckQx/File_Forge.png',
        tag: 'Utility Tool',
        desc: 'File utility toolkit for quick, clean, and efficient file handling workflows.',
        stack: ['React', 'TypeScript', 'Vite', 'UI'],
      },
      {
        title: 'YT speed controller extension',
        link: 'https://mpji-yt-speed-controller.vercel.app/',
        img: 'https://i.postimg.cc/wvf4kx6C/Speed_Control.png',
        tag: 'YT Speed Controller',
        desc: 'Browser utility to control YouTube playback speed with cleaner controls and better UX.',
        stack: ['JavaScript', 'Chrome API', 'UI', 'Web'],
      },
      {
        title: 'Dynamic Edge AI',
        link: 'https://mpji-dynamic-edge-ai.vercel.app/',
        img: 'https://i.postimg.cc/3RJbp0H6/dynamic_Edge_Ai.png',
        tag: 'AI Tool',
        desc: 'AI-powered utility built around a mobile-first interface for fast, focused interactions.',
        stack: ['React', 'AI API', 'Tailwind', 'Mobile UI'],
        isMobileShot: true,
      }
    ],
    [],
  )

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
    // Scroll-triggered animations
    gsap.to('#about-txt', {
      opacity: 1,
      x: 0,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: '#about', start: 'top 65%' },
    })

    document.querySelectorAll<HTMLElement>('.stat-n').forEach((el) => {
      const t = Number(el.dataset.count || 0)
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        onEnter: () => {
          let v = 0
          const iv = window.setInterval(() => {
            v += Math.ceil(t / 28)
            if (v >= t) {
              v = t
              window.clearInterval(iv)
            }
            el.textContent = `${v}+`
          }, 36)
        },
      })
    })

    gsap.utils.toArray<HTMLElement>('.sk-card').forEach((el, i) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.65,
        delay: i * 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: '#skills', start: 'top 60%' },
      })
      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        onEnter: () => {
          const fill = el.querySelector<HTMLElement>('.sk-fill')
          if (!fill) return
          fill.style.width = `${fill.dataset.p}%`
        },
      })
    })

      ;['#ti1', '#ti2', '#ti3'].forEach((s, i) => {
        gsap.to(s, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          delay: i * 0.18,
          ease: 'power3.out',
          scrollTrigger: { trigger: '#experience', start: 'top 68%' },
        })
      })

    gsap.utils.toArray<HTMLElement>('.eyebrow').forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        x: -24,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      })
    })

    gsap.utils.toArray<HTMLElement>('.about-h, .exp-h, .proj-ht, .contact-h, .skills-h').forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      })
    })

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  useEffect(() => {
    if (!showAllProjects) return
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
  }, [showAllProjects])

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

    const heroCode = () => {
      const canvas = document.getElementById('hero-code-canvas') as HTMLCanvasElement | null
      if (!canvas) return
      const wrap = canvas.parentElement as HTMLElement | null
      if (!wrap) return

      const W = () => wrap.offsetWidth || 560
      const H = () => wrap.offsetHeight || 560

      const R = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
      R.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      R.setSize(W(), H())

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

      const dotColors = [0xff5f57, 0xfebc2e, 0x00ff6a]
      dotColors.forEach((c, i) => {
        const dg = new THREE.SphereGeometry(0.055, 12, 12)
        const dm = new THREE.MeshPhongMaterial({ color: c, emissive: c, emissiveIntensity: 0.4 })
        const d = new THREE.Mesh(dg, dm)
        d.position.set(-winW / 2 + 0.22 + i * 0.22, winH / 2 - 0.14, 0.05)
        grp.add(d)
      })

      const lineColors = [
        { c: 0x00ff6a, w: 1.1, x: -1.1 },
        { c: 0x00ffe0, w: 2.2, x: -0.05 },
        { c: 0x4d8c65, w: 0.8, x: -1.35 },
        { c: 0x00ff6a, w: 0.6, x: -1.55 },
        { c: 0x9d4edd, w: 1.5, x: -0.75 },
        { c: 0x00ffe0, w: 1.9, x: -0.25 },
        { c: 0x4d8c65, w: 2.6, x: 0.1 },
        { c: 0x00ff6a, w: 0.9, x: -1.25 },
        { c: 0xc8ff00, w: 1.3, x: -0.95 },
        { c: 0x00ffe0, w: 2.0, x: -0.2 },
      ]

      const codeLines: Array<{ mesh: THREE.Mesh }> = []
      lineColors.forEach((l, i) => {
        const lg = new THREE.BoxGeometry(l.w, 0.06, 0.08)
        const lm = new THREE.MeshPhongMaterial({
          color: l.c,
          emissive: l.c,
          emissiveIntensity: 0.3,
          transparent: true,
          opacity: 0.85,
        })
        const m = new THREE.Mesh(lg, lm)
        m.position.set(l.x, winH / 2 - 0.5 - i * 0.21, 0.05)
        grp.add(m)
        codeLines.push({ mesh: m })
      })

      const lnGeo = new THREE.BoxGeometry(0.18, winH - 0.3, 0.07)
      const lnMat = new THREE.MeshPhongMaterial({
        color: 0x061410,
        emissive: 0x030c08,
        shininess: 10,
        transparent: true,
        opacity: 0.8,
      })
      const ln = new THREE.Mesh(lnGeo, lnMat)
      ln.position.set(-winW / 2 + 0.09, -0.1, 0.04)
      grp.add(ln)

      const curGeo = new THREE.BoxGeometry(0.03, 0.18, 0.1)
      const curMat = new THREE.MeshPhongMaterial({ color: 0x00ff6a, emissive: 0x00ff6a, emissiveIntensity: 1 })
      const curMesh = new THREE.Mesh(curGeo, curMat)
      curMesh.position.set(0.4, winH / 2 - 0.5 - 4 * 0.21, 0.1)
      grp.add(curMesh)

      const floaters: Array<{ mesh: THREE.Mesh; lines: THREE.LineSegments; baseY: number; speed: number; phase: number }> = []
        ;[
          { x: 2.6, y: 1.0, z: -0.5, w: 1.4, h: 0.9, c: 0x9d4edd },
          { x: -2.8, y: -0.4, z: -0.3, w: 1.2, h: 0.75, c: 0x00ffe0 },
          { x: 2.4, y: -1.3, z: -0.6, w: 1.6, h: 0.7, c: 0xc8ff00 },
        ].forEach((f) => {
          const fg = new THREE.BoxGeometry(f.w, f.h, 0.05)
          const fm = new THREE.MeshPhongMaterial({ color: 0x040f0a, emissive: 0x010804, transparent: true, opacity: 0.85 })
          const fmesh = new THREE.Mesh(fg, fm)
          fmesh.position.set(f.x, f.y, f.z)
          const fe = new THREE.EdgesGeometry(fg)
          const fem = new THREE.LineBasicMaterial({ color: f.c, transparent: true, opacity: 0.4 })
          const flines = new THREE.LineSegments(fe, fem)
          flines.position.copy(fmesh.position)
          S.add(fmesh)
          S.add(flines)
          floaters.push({
            mesh: fmesh,
            lines: flines,
            baseY: f.y,
            speed: 0.3 + Math.random() * 0.4,
            phase: Math.random() * Math.PI * 2,
          })
        })

      const tokens: Array<{ mesh: THREE.Mesh; angle: number; r: number; speed: number; y: number }> = []
      const tkColors = [0x00ff6a, 0x00ffe0, 0xc8ff00, 0x9d4edd, 0xff8800]
      for (let i = 0; i < 12; i++) {
        const tg = new THREE.BoxGeometry(0.2 + Math.random() * 0.3, 0.06, 0.06)
        const tc = tkColors[i % tkColors.length]
        const tm = new THREE.MeshPhongMaterial({ color: tc, emissive: tc, emissiveIntensity: 0.5, transparent: true, opacity: 0.7 })
        const tmesh = new THREE.Mesh(tg, tm)
        tokens.push({ mesh: tmesh, angle: i * (Math.PI * 2 / 12), r: 3.2 + Math.random() * 0.6, speed: 0.006 + Math.random() * 0.004, y: (Math.random() - 0.5) * 2.5 })
        S.add(tmesh)
      }

      const light1 = new THREE.PointLight(0x00ff6a, 3, 15)
      light1.position.set(2, 2, 4)
      S.add(light1)
      const light2 = new THREE.PointLight(0x00ffe0, 2, 12)
      light2.position.set(-3, -1, 3)
      S.add(light2)
      const light3 = new THREE.PointLight(0x9d4edd, 1.5, 10)
      light3.position.set(0, -3, 2)
      S.add(light3)
      S.add(new THREE.AmbientLight(0x020c08, 0.8))

      let hmx = 0
      let hmy = 0
      let grpRX = 0
      let grpRY = 0
      const onMove = (e: MouseEvent) => {
        hmx = (e.clientX / window.innerWidth - 0.5) * 1.2
        hmy = (e.clientY / window.innerHeight - 0.5) * 0.8
      }
      document.addEventListener('mousemove', onMove)
      cleanups.push(() => document.removeEventListener('mousemove', onMove))

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
        grpRY += (hmx - grpRY) * 0.035
        grpRX += (hmy - grpRX) * 0.035
        grp.rotation.y = grpRY
        grp.rotation.x = -grpRX * 0.3
        grp.position.y = Math.sin(t * 0.0007) * 0.12

        curMesh.material.opacity = Math.sin(t * 0.004) > 0 ? 1 : 0

        if (Math.floor(t * 0.002) % 2 === 0) {
          const li = Math.floor(t * 0.001) % codeLines.length
          codeLines[li].mesh.scale.x = 0.5 + Math.abs(Math.sin(t * 0.003)) * 0.7
        }

        floaters.forEach((f) => {
          f.mesh.position.y = f.baseY + Math.sin(t * 0.001 * f.speed + f.phase) * 0.2
          f.lines.position.y = f.mesh.position.y
        })

        tokens.forEach((tk) => {
          tk.angle += tk.speed
          tk.mesh.position.x = Math.cos(tk.angle) * tk.r
          tk.mesh.position.y = tk.y + Math.sin(tk.angle * 0.7) * 0.3
          tk.mesh.position.z = Math.sin(tk.angle) * tk.r * 0.4 - 1
          tk.mesh.rotation.z = tk.angle * 0.3
        })

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
    heroCode()
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

      <nav id="nav">
        <div className="nav-logo">
          <span className="nav-logo-bracket">[</span>MP<span className="nav-logo-bracket">]</span>
        </div>
        <div className="nav-links">
          <a href="#about">about</a>
          <a href="#skills">skills</a>
          <a href="#projects">projects</a>
          <a href="#experience">experience</a>
          <a href="#contact">contact</a>
        </div>
        <a
          href="https://www.playbook.com/mpji/ZQoLVKNNi16aoWvhwj5pQ2Xx?assetToken=qySgK6SzXEQiH5dvAMMEPY1G"
          target="_blank"
          rel="noreferrer"
          className="nav-cta"
        >
          resume ↗
        </a>
      </nav>

      <section id="hero">
        <canvas id="hero-bg-canvas" />
        <div className="hero-left">
          <div className="hero-eyebrow" id="he">
            Full-Stack Developer
          </div>
          <div className="hero-name" id="hn">
            MANPREET
            <br />
            <span className="line-g">SINGH</span>
          </div>
          <div className="hero-role-wrap">
            <div className="hero-role" id="hr">
              I build things for the <em>web</em>.
            </div>
          </div>
          <p className="hero-desc" id="hd">
            Crafting immersive full-stack experiences with React, Node.js &amp; MongoDB.
            <br />
            B.Tech CSE · Open Source Contributor · Available for hire.
          </p>
          <div className="hero-btns" id="hb">
            <a href="#projects" className="hbtn fill">
              View Projects
            </a>
            <a href="#contact" className="hbtn ghost">
              Let's Talk
            </a>
          </div>
          <div className="hero-badges" id="hbdg">
            {['React', 'Node.js', 'MongoDB', 'Next.js', 'Tailwind', 'Three.js', 'GSAP'].map((b) => (
              <span key={b} className="hbadge">
                {b}
              </span>
            ))}
          </div>
        </div>
        <div className="hero-right">
          <canvas id="hero-code-canvas" />
        </div>
        <div className="scroll-hint" id="shint">
          <span>scroll</span>
          <div className="sh-line" style={{ animation: 'shBob 2s infinite' }} />
        </div>
      </section>

      <div className="mq-wrap">
        <div className="mq-inner">
          <div className="mq-row">
            <div className="mq-track">
              {[
                { t: 'MANPREET SINGH', c: 'bright' },
                { t: 'FULL STACK', c: 'dim' },
                { t: 'const dev = "manpreet"', c: 'code' },
                { t: 'REACT', c: 'bright' },
                { t: 'NODE.JS', c: 'dim' },
                { t: 'npm run build', c: 'code' },
                { t: 'MONGODB', c: 'bright' },
                { t: 'OPEN SOURCE', c: 'dim' },
                { t: 'MANPREET SINGH', c: 'bright' },
                { t: 'FULL STACK', c: 'dim' },
                { t: 'const dev = "manpreet"', c: 'code' },
                { t: 'REACT', c: 'bright' },
                { t: 'NODE.JS', c: 'dim' },
                { t: 'npm run build', c: 'code' },
                { t: 'MONGODB', c: 'bright' },
                { t: 'OPEN SOURCE', c: 'dim' },
              ].map((x, idx) => (
                <span key={idx} className={`mq-item ${x.c}`}>
                  {x.t}
                  <span className="mq-sep" />
                </span>
              ))}
            </div>
          </div>

          <div className="mq-row">
            <div className="mq-track">
              {[
                { t: 'git commit -m "ship it"', c: 'code' },
                { t: 'NEXT.JS', c: 'dim' },
                { t: 'AVAILABLE FOR HIRE', c: 'bright' },
                { t: '() => <Portfolio />', c: 'code' },
                { t: 'TAILWIND CSS', c: 'dim' },
                { t: 'B.TECH CSE', c: 'bright' },
                { t: 'git push origin main', c: 'code' },
                { t: 'THREE.JS', c: 'dim' },
                { t: 'git commit -m "ship it"', c: 'code' },
                { t: 'NEXT.JS', c: 'dim' },
                { t: 'AVAILABLE FOR HIRE', c: 'bright' },
                { t: '() => <Portfolio />', c: 'code' },
                { t: 'TAILWIND CSS', c: 'dim' },
                { t: 'B.TECH CSE', c: 'bright' },
                { t: 'git push origin main', c: 'code' },
                { t: 'THREE.JS', c: 'dim' },
              ].map((x, idx) => (
                <span key={idx} className={`mq-item ${x.c}`}>
                  {x.t}
                  <span className="mq-sep" />
                </span>
              ))}
            </div>
          </div>

          <div className="mq-row">
            <div className="mq-track">
              {[
                { t: '600+ COMMITS', c: 'bright' },
                { t: 'async/await fetchData()', c: 'code' },
                { t: 'MERN STACK', c: 'dim' },
                { t: '4 LIVE PROJECTS', c: 'bright' },
                { t: 'useEffect(() => {}, [])', c: 'code' },
                { t: 'REST APIs', c: 'dim' },
                { t: '600+ COMMITS', c: 'bright' },
                { t: 'async/await fetchData()', c: 'code' },
                { t: 'MERN STACK', c: 'dim' },
                { t: '4 LIVE PROJECTS', c: 'bright' },
                { t: 'useEffect(() => {}, [])', c: 'code' },
                { t: 'REST APIs', c: 'dim' },
              ].map((x, idx) => (
                <span key={idx} className={`mq-item ${x.c}`}>
                  {x.t}
                  <span className="mq-sep" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section id="about">
        <div className="about-code-side">
          <canvas id="about-canvas" />
        </div>
        <div className="about-txt" id="about-txt">
          <div className="eyebrow">About Me</div>
          <div className="about-h">
            CODE.<br />
            CREATE.<br />
            SHIP.
          </div>
          <p className="about-body">
            Hey, I'm <strong>Manpreet Singh</strong> — a full-stack developer who treats every project like a craft.
            <br />
            <br />I specialise in the <code>MERN</code> stack and love pushing the web's creative limits using{' '}
            <code>Three.js</code>, <code>GSAP</code>, and WebGL. Currently pursuing B.Tech CSE with <strong>600+</strong>{' '}
            GitHub commits and <strong>4</strong> live production apps.
            <br />
            <br />
            When I'm not writing code I'm reading about it.
          </p>
          <div className="stats">
            <div>
              <span className="stat-n" data-count="4">
                0
              </span>
              <span className="stat-l">Live Apps</span>
            </div>
            <div>
              <span className="stat-n" data-count="600">
                0
              </span>
              <span className="stat-l">Commits</span>
            </div>
            <div>
              <span className="stat-n" data-count="4">
                0
              </span>
              <span className="stat-l">Yrs Coding</span>
            </div>
          </div>
        </div>
      </section>

      <section id="skills">
        <div className="eyebrow">Technical Arsenal</div>
        <div className="skills-h">
          MY <span className="dim">SKILLS</span>
        </div>
        <div className="skills-intro">
          <div className="skills-intro-main">MERN + MODERN WEB TOOLING</div>
          <div className="skills-intro-sub">building full-stack products with performance, UX, and scale in mind</div>
        </div>
        <div className="skills-grid">
          {[
            { name: 'React / Next.js', pct: 90, bg: 'linear-gradient(90deg,#0066ff,var(--cyan))', icon: '⚛️' },
            { name: 'Node.js / Express', pct: 85, bg: 'linear-gradient(90deg,var(--g3),var(--g1))', icon: '🟢' },
            { name: 'MongoDB', pct: 82, bg: 'linear-gradient(90deg,var(--g2),var(--lime))', icon: '🍃' },
            { name: 'JavaScript / TypeScript', pct: 88, bg: 'linear-gradient(90deg,#f7df1e,var(--lime))', icon: '🟨' },
            { name: 'Tailwind CSS', pct: 92, bg: 'linear-gradient(90deg,var(--cyan),#0066ff)', icon: '🎨' },
            { name: 'Three.js / WebGL', pct: 70, bg: 'linear-gradient(90deg,var(--purple),var(--cyan))', icon: '🧊' },
            { name: 'Git & GitHub', pct: 87, bg: 'linear-gradient(90deg,#f05032,var(--orange))', icon: '🌿' },
            { name: 'Python / DSA', pct: 78, bg: 'linear-gradient(90deg,#3572A5,var(--cyan))', icon: '🐍' },
          ].map((s) => (
            <div className="sk-card" key={s.name}>
              <div className="sk-top">
                <span className="sk-name">
                  <span className="sk-icon">{s.icon}</span> {s.name}
                </span>
                <span className="sk-pct">{s.pct}%</span>
              </div>
              <div className="sk-track">
                <div className="sk-fill" data-p={String(s.pct)} style={{ background: s.bg }} />
              </div>
            </div>
          ))}
        </div>
        <div className="skills-pills">
          {['REST APIs', 'Auth Systems', 'Realtime Features', 'Responsive UI', 'Deployment', 'Testing'].map((pill) => (
            <span key={pill} className="skills-pill">
              {pill}
            </span>
          ))}
        </div>
      </section>

      <section id="projects">
        <div className="proj-hdr">
          <div>
            <div className="eyebrow">Selected Work</div>
            <div className="proj-ht">
              RECENT
              <br />
              <span className="dim">PROJECTS</span>
            </div>
          </div>
          <div className="proj-meta">{String(projects.length).padStart(2, '0')} PROJECTS</div>
        </div>

        <div className="proj-mq">
          <div className="proj-mq-inner">
            <div className="proj-strip">
              <div className="proj-strip-track">
                {[...projects, ...projects, ...projects].map((p, idx) => (
                  <a key={`t1-${idx}`} className="pslide" href={p.link} target="_blank" rel="noreferrer">
                    {p.img ? (
                      <img className={`pslide-img ${p.isMobileShot ? 'pslide-img-mobile' : ''}`} src={p.img} alt={p.title} />
                    ) : (
                      <div
                        className="pslide-img"
                        style={{
                          background: '#061410',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          letterSpacing: '2px',
                          color: '#2d5c40',
                        }}
                      >
                        COMING SOON
                      </div>
                    )}
                    <div className="pslide-foot">
                      <div className="pslide-tag">{p.tag}</div>
                      <div className="pslide-ttl">{p.title}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            <div className="proj-strip">
              <div className="proj-strip-track">
                {[...projects, ...projects, ...projects]
                  .slice()
                  .reverse()
                  .map((p, idx) => (
                    <a key={`t2-${idx}`} className="pslide" href={p.link} target="_blank" rel="noreferrer">
                      {p.img ? (
                        <img className={`pslide-img ${p.isMobileShot ? 'pslide-img-mobile' : ''}`} src={p.img} alt={p.title} />
                      ) : (
                        <div
                          className="pslide-img"
                          style={{
                            background: '#061410',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            letterSpacing: '2px',
                            color: '#2d5c40',
                          }}
                        >
                          COMING SOON
                        </div>
                      )}
                      <div className="pslide-foot">
                        <div className="pslide-tag">{p.tag}</div>
                        <div className="pslide-ttl">{p.title}</div>
                      </div>
                    </a>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {!showAllProjects ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem', marginBottom: '2rem' }}>
            <button className="hbtn fill" onClick={() => setShowAllProjects(true)} style={{ cursor: 'pointer', zIndex: 10 }}>
              View All Projects
            </button>
          </div>
        ) : null}

        <AnimatePresence>
          {showAllProjects && (
            <motion.div
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9990,
                backgroundColor: 'rgba(2, 12, 8, 0.95)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                overflowY: 'auto',
                padding: '4rem 2rem'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div className="proj-ht" style={{ margin: 0, fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
                    ALL <span className="dim">PROJECTS</span>
                  </div>
                  <button className="hbtn ghost" onClick={() => setShowAllProjects(false)} style={{ cursor: 'pointer' }}>
                    Close [X]
                  </button>
                </div>

                <div className="proj-grid" style={{ padding: '0', margin: '0' }}>
                  {projects.map((project, index) => {
                    const cardNumber = String(index + 1).padStart(2, '0')

                    return (
                      <motion.div 
                        className="pcard" 
                        id={`pfc${index + 1}`} 
                        key={project.title}
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.6, delay: index * 0.1, type: 'spring', stiffness: 100 }}
                      >
                        <div className="pcard-vis">
                          {project.img ? (
                            <img className={`pcard-img ${project.isMobileShot ? 'pcard-img-mobile' : ''}`} src={project.img} alt={project.title} />
                          ) : (
                            <div className="pcard-img pcard-img-fallback">COMING SOON</div>
                          )}
                          <div className="pcard-num">{cardNumber}</div>
                        </div>
                        <div className="pcard-body">
                          <div className="pcard-tag">{project.tag}</div>
                          <div className="pcard-ttl">{project.title}</div>
                          <div className="pcard-desc">{project.desc}</div>
                          <div className="pcard-stack">
                            {project.stack.map((c) => (
                              <span key={c} className="chip">
                                {c}
                              </span>
                            ))}
                          </div>
                          <a href={project.link} target="_blank" rel="noreferrer" className="pcard-link">
                            Live Demo →
                          </a>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <section id="experience">
        <div className="eyebrow">Career &amp; Education</div>
        <div className="exp-h">
          EXPERI
          <span style={{ WebkitTextStroke: '1px rgba(0,255,106,.25)', color: 'transparent' }}>ENCE</span>
        </div>
        <div className="tl">
          <div className="tli" id="ti1">
            <div className="tli-dot" />
            <div className="tli-p">2024 — Present</div>
            <div className="tli-r">Full-Stack Developer</div>
            <div className="tli-org">Freelance / Personal Projects · Remote</div>
            <div className="tli-d">
              Built and deployed 4 production MERN apps serving real users. Auth systems, REST APIs, real-time features, Vercel &amp; Render
              deployments.
            </div>
            <div className="tli-tags">
              {['React', 'Node.js', 'MongoDB', 'Vercel'].map((t) => (
                <span key={t} className="tli-tag">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="tli" id="ti2">
            <div className="tli-dot" />
            <div className="tli-p">2023</div>
            <div className="tli-r">Open Source Contributor</div>
            <div className="tli-org">GitHub Community</div>
            <div className="tli-d">
              600+ commits across personal and open-source repos. Active in hackathons and coding challenges on LeetCode and Codeforces.
            </div>
            <div className="tli-tags">
              {['Git', 'JavaScript', 'DSA'].map((t) => (
                <span key={t} className="tli-tag">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="tli" id="ti3">
            <div className="tli-dot" />
            <div className="tli-p">2022 — Present</div>
            <div className="tli-r">B.Tech Computer Science</div>
            <div className="tli-org">University · Full Time</div>
            <div className="tli-d">
              Core CS — algorithms, OS, DBMS, networks. Applying concepts through full-stack projects and research. Active campus tech community
              member.
            </div>
            <div className="tli-tags">
              {['DSA', 'DBMS', 'OS', 'Networks'].map((t) => (
                <span key={t} className="tli-tag">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact">
        <canvas id="contact-canvas" />
        <div className="contact-wrap">
          <div className="contact-left">
            <div className="eyebrow">Get In Touch</div>
            <div className="contact-h">
              LET'S
              <br />
              BUILD.
            </div>
            <p className="contact-sub">Open to internships, freelance, and full-time roles. If you have an idea — let's make it real.</p>
            <a href="mailto:manpreet.singhcomet@gmail.com" className="contact-em">
              manpreet.singhcomet@gmail.com
            </a>
            <br />
            <div className="socials">
              <a href="https://github.com/mpsinghji" target="_blank" rel="noreferrer" className="soc">
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/manpreetsingh2004" target="_blank" rel="noreferrer" className="soc">
                LinkedIn
              </a>
              <a
                href="https://www.playbook.com/mpji/ZQoLVKNNi16aoWvhwj5pQ2Xx?assetToken=qySgK6SzXEQiH5dvAMMEPY1G"
                target="_blank"
                rel="noreferrer"
                className="soc"
              >
                Resume ↗
              </a>
            </div>
          </div>
          <div className="contact-right">
            <div className="cf-ttl">DROP A MESSAGE</div>
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
      </section>

      <footer>
        <div className="ft-logo">[MP.DEV]</div>
        <div className="ft-copy">Designed &amp; built by Manpreet Singh · © 2025</div>
      </footer>
    </>
  )
}

export default App

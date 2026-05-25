import { useState, useRef, useEffect } from 'react'

const categories = [
  { id: 'uvod', label: 'Úvod' },
  { id: 'o-nas', label: 'O nás' },
  { id: 'sluzby', label: 'Služby' },
  { id: 'galerie', label: 'Galerie' },
  { id: 'dotaznik', label: 'Dotazník' },
  { id: 'kontakty', label: 'Kontakty' },
  { id: 'dukaz', label: 'Důkazy' },
]

function App() {
  const [currentPage, setCurrentPage] = useState('uvod')
  const [menuOpen, setMenuOpen] = useState(false)
  const [animState, setAnimState] = useState('idle')
  const [displayedPage, setDisplayedPage] = useState('uvod')

  const navigateTo = (id) => {
    if (id === currentPage || animState !== 'idle') return
    setAnimState('exiting')
    setTimeout(() => {
      setDisplayedPage(id)
      setCurrentPage(id)
      setAnimState('entering')
      setTimeout(() => setAnimState('idle'), 400)
    }, 400)
    setMenuOpen(false)
  }

  const navigateNext = () => {
    const currentIndex = categories.findIndex(c => c.id === currentPage)
    if (currentIndex < categories.length - 1 && animState === 'idle') {
      navigateTo(categories[currentIndex + 1].id)
    }
  }

  const navigatePrev = () => {
    const currentIndex = categories.findIndex(c => c.id === currentPage)
    if (currentIndex > 0 && animState === 'idle') {
      navigateTo(categories[currentIndex - 1].id)
    }
  }

  const getAnimationClass = () => {
    if (animState === 'exiting') return 'animate-page-exit'
    if (animState === 'entering') return 'animate-page-enter'
    return ''
  }

  return (
    <div className="h-screen w-screen flex flex-col relative overflow-hidden bg-slate-900">
      <NetworkBackground />
      
      {/* Header */}
      <header className="relative z-50">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 overflow-hidden flex items-center justify-center">
              <img src="../images/netwatch-logo-star.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-white font-semibold text-lg tracking-wide">Net-watch</span>
          </div>
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
          <ul className={`flex-col md:flex-row md:flex gap-1 ${menuOpen ? 'flex' : 'hidden'} md:flex absolute md:relative top-full md:top-auto left-0 md:left-auto w-full md:w-auto backdrop-blur-md bg-slate-900/80 md:bg-transparent z-50 p-6 md:p-0 rounded-b-2xl md:rounded-none border-t border-white/10 md:border-0`}>
            {categories.map((cat, i) => (
              <li key={cat.id}>
                <button
                  onClick={() => navigateTo(cat.id)}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 w-full text-left rounded hover:bg-white/10 ${
                    currentPage === cat.id ? 'text-violet-400 font-semibold' : 'text-slate-300'
                  }`}
                >
                  {cat.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-8" />
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative z-10">
        <div className="h-full">
          <div key={displayedPage} className={`h-full ${getAnimationClass()}`}>
            {displayedPage === 'uvod' && <Uvod onNext={navigateNext} />}
            {displayedPage === 'o-nas' && <ONas />}
            {displayedPage === 'sluzby' && <Sluzby />}
            {displayedPage === 'galerie' && <Galerie />}
            {displayedPage === 'dotaznik' && <Dotaznik />}
            {displayedPage === 'kontakty' && <Kontakty />}
            {displayedPage === 'dukaz' && <Dukaz />}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-50">
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-8 mb-4" />
        <div className="px-8 pb-4 flex justify-between items-center">
          <p className="text-slate-500 text-sm">&copy; {new Date().getFullYear()} Net-watch</p>
          <div className="flex gap-3">
            <button
              onClick={navigatePrev}
              className="px-4 py-2 backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-medium rounded-lg transition-all"
            >
              Zpět
            </button>
            <button
              onClick={navigateNext}
              className="px-4 py-2 backdrop-blur-md bg-violet-600/80 hover:bg-violet-500 border border-violet-500/30 text-white text-sm font-medium rounded-lg transition-all"
            >
              Další
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}

function NetworkBackground() {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: null, y: null })
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = []
    const particleCount = 70
    const connectionDistance = 130
    const mouseRadius = 180

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1.5,
        opacity: Math.random() * 0.4 + 0.2
      })
    }

    let animationId
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        if (mouseRef.current.x !== null) {
          const dx = mouseRef.current.x - p.x
          const dy = mouseRef.current.y - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < mouseRadius) {
            const force = (mouseRadius - dist) / mouseRadius
            p.vx += (dx / dist) * force * 0.02
            p.vy += (dy / dist) * force * 0.02
          }
        }

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (speed > 2) {
          p.vx = (p.vx / speed) * 2
          p.vy = (p.vy / speed) * 2
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(139, 92, 246, ${p.opacity})`
        ctx.fill()
      })

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < connectionDistance) {
            const opacity = (1 - dist / connectionDistance) * 0.2
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    const handleMouse = (e) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }

    const handleMouseLeave = () => {
      mouseRef.current.x = null
      mouseRef.current.y = null
    }

    window.addEventListener('mousemove', handleMouse)
    window.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouse)
      window.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return <canvas ref={canvasRef} className="network-bg" />
}

function Uvod({ onNext }) {
  const [lockPos, setLockPos] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef(null)
  const startPosRef = useRef(0)
  const maxSlide = 200

  const handleMouseDown = (e) => {
    e.preventDefault()
    setIsDragging(true)
    startPosRef.current = lockPos
  }

  useEffect(() => {
    if (!isDragging) return
    
    const handleMouseMove = (e) => {
      const delta = e.movementX
      setLockPos(prev => Math.max(0, Math.min(startPosRef.current + delta, maxSlide)))
      startPosRef.current = lockPos
    }
    
    const handleMouseUp = () => {
      setIsDragging(false)
      if (lockPos >= maxSlide) {
        onNext()
        setLockPos(0)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, lockPos, onNext])

  return (
    <div className="h-full flex flex-col justify-center items-center px-8">
      <h1 className="text-5xl md:text-7xl font-bold text-white mb-16 leading-tight">
        Zabezpečte<br />se<br /><span>teď</span>.
      </h1>
      
      <div className="flex flex-col items-center" ref={containerRef}>
        <p className="text-slate-400 text-sm mb-4">Přetáhněte zámek pro pokračování</p>
        <div className="relative w-64 h-16 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className={`absolute top-1/2 -translate-y-1/2 w-12 h-12 bg-violet-600 rounded-full flex items-center justify-center cursor-grab shadow-lg ${isDragging ? 'cursor-grabbing scale-110' : ''}`}
            style={{ 
              left: '8px',
              transform: `translateY(-50%) translateX(${lockPos}px) ${isDragging ? 'scale(1.1)' : 'scale(1)'}`,
              transition: isDragging ? 'none' : 'transform 0.1s ease-out'
            }}
            onMouseDown={handleMouseDown}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-violet-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        <div className="w-64 h-1 bg-slate-700 rounded-full mt-3 overflow-hidden">
          <div 
            className="h-full bg-violet-500 rounded-full transition-all duration-75" 
            style={{ width: `${(lockPos / maxSlide) * 100}%` }} 
          />
        </div>
      </div>
    </div>
  )
}

function ONas() {
  return (
    <div className="h-full px-8 md:px-16 py-12 flex flex-col justify-start overflow-auto">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">O nás</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl">
        <div className="space-y-4">
          <p className="text-slate-300 leading-relaxed">
            Jsme tým specialistů s dlouholetou praxí v oblasti kybernetické bezpečnosti.
            Naše cesta začala v roce 2009, kdy jsme rozpoznali rostoucí potřebu kvalitní 
            ochrany v digitálním prostředí.
          </p>
          <p className="text-slate-300 leading-relaxed">
            Začínali jsme jako malý tým tří nadšenců v pronajatých prostorech. Dnes zaměstnáváme 
            více než 50 odborníků a chráníme stovky firem napříč Českou republikou i Evropou.
          </p>
        </div>
        
        <div className="space-y-4">
          <p className="text-slate-300 leading-relaxed">
            Věříme, že prevence je klíčem k bezpečnosti. Proto investujeme do nejmodernějších 
            technologií a neustálého vzdělávání našich zaměstnanců.
          </p>
          <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
            <h3 className="font-semibold text-white mb-3">Naše hodnoty:</h3>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-violet-500 rounded-full" />
                Důvěryhodnost a diskrétnost
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-violet-500 rounded-full" />
                Inovace a profesionalita
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-violet-500 rounded-full" />
                Zákaznický přístup
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function Sluzby() {
  const serviceImages = [
    { img: '_amal-s-7gaxRnvdEAc-unsplash.jpg', text: 'Moderní gadgety' },
    { img: 'dylan-gillis-KdeqA3aTnBY-unsplash.jpg', text: 'Bezpečnostní konzultace' },
    { img: 'gustas-brazaitis-xNKy-Cu20d4-unsplash.jpg', text: 'Tvorba automatizačních skriptů' },
    { img: 'mika-baumeister-J5yoGZLdpSI-unsplash.jpg', text: 'Analýza' },
  ]

  return (
    <div className="h-full px-8 md:px-16 py-12 flex flex-col justify-start overflow-auto">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">Služby</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl">
        <div className="space-y-4">
          <p className="text-slate-300 leading-relaxed">
            Nabízíme komplexní portfolio služeb v oblasti kybernetické bezpečnosti. 
            Od penetračního testování, přes bezpečnostní audity, až po školení 
            zaměstnanců a forenzní analýzu.
          </p>
          <p className="text-slate-300 leading-relaxed">
            Každá služba je přizpůsobena konkrétním potřebám klienta. Pracujeme 
            s nejmodernějšími technologiemi a metodami, abychom zajistili 
            maximální ochranu vašich systémů.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {serviceImages.map((item, i) => (
            <div key={i} className="aspect-square rounded-xl overflow-hidden hover:ring-2 hover:ring-violet-500 transition-all group relative">
              <img src={`/images/${item.img}`} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center">
                <span className="text-white/0 group-hover:text-white/90 text-sm font-medium transition-all">{item.text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Galerie() {
  const galleryImages = [
    { img: 'photo-1520110120835-c96534a4c984.jpg', text: 'Spolupráce' },
    { img: 'photo-1531058020387-3be344556be6.jpg', text: 'Prezentace' },
    { img: 'photo-1620825937374-87fc7d6bddc2.jpg', text: 'Penetrační testování' },
    { img: 'photo-1629904853716-f0bc54eea481.jpg', text: 'Profesionální přístup' },
    { img: 'taylor-vick-M5tzZtFCOfs-unsplash.jpg', text: 'Návrh servroven' },
    { img: 'thriday-hlYSnQzVFEg-unsplash.jpg', text: 'Kritické myšlení' },
  ]

  return (
    <div className="h-full px-8 md:px-16 py-12 flex flex-col justify-start items-center overflow-auto">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">Galerie</h1>
      
      <div className="grid grid-cols-3 gap-4 max-w-4xl w-full">
        {galleryImages.map((item, i) => (
          <div key={i} className="aspect-square rounded-xl overflow-hidden hover:ring-2 hover:ring-violet-500 transition-all cursor-pointer group relative">
            <img src={`/images/${item.img}`} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center">
              <span className="text-white/0 group-hover:text-white/90 text-sm font-medium transition-all">{item.text}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Dotaznik() {
  const [formData, setFormData] = useState({
    jmeno: '', email: '', telefon: '', vek: '', povolani: '',
    ucast: '', hodnoceni: '', doporuceni: '', comments: '', souhlas: false
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Děkujeme za vyplnění dotazníku!')
    setFormData({ jmeno: '', email: '', telefon: '', vek: '', povolani: '', ucast: '', hodnoceni: '', doporuceni: '', comments: '', souhlas: false })
  }

  return (
    <div className="h-full px-8 md:px-16 py-12 flex flex-col justify-start items-center overflow-auto">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">Dotazník spokojenosti</h1>
      
      <form onSubmit={handleSubmit} className="bg-slate-800/50 p-8 rounded-2xl max-w-2xl w-full border border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-slate-300 text-sm mb-2">Jméno a příjmení</label>
            <input type="text" required className="w-full bg-slate-900 border border-slate-600 text-white p-3 rounded-lg focus:outline-none focus:border-violet-500" value={formData.jmeno} onChange={e => setFormData({...formData, jmeno: e.target.value})} />
          </div>
          <div>
            <label className="block text-slate-300 text-sm mb-2">E-mail</label>
            <input type="email" required className="w-full bg-slate-900 border border-slate-600 text-white p-3 rounded-lg focus:outline-none focus:border-violet-500" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-slate-300 text-sm mb-2">Telefon</label>
            <input type="tel" className="w-full bg-slate-900 border border-slate-600 text-white p-3 rounded-lg focus:outline-none focus:border-violet-500" value={formData.telefon} onChange={e => setFormData({...formData, telefon: e.target.value})} />
          </div>
          <div>
            <label className="block text-slate-300 text-sm mb-2">Věk</label>
            <select className="w-full bg-slate-900 border border-slate-600 text-white p-3 rounded-lg focus:outline-none focus:border-violet-500" value={formData.vek} onChange={e => setFormData({...formData, vek: e.target.value})}>
              <option value="">Vyberte</option>
              <option>18-25</option><option>26-35</option><option>36-45</option><option>46-55</option><option>55+</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-slate-300 text-sm mb-2">Povolání</label>
          <input type="text" className="w-full bg-slate-900 border border-slate-600 text-white p-3 rounded-lg focus:outline-none focus:border-violet-500" value={formData.povolani} onChange={e => setFormData({...formData, povolani: e.target.value})} />
        </div>

        <div className="mb-6">
          <label className="block text-slate-300 text-sm mb-2">Jak často využíváte naše služby?</label>
          <select className="w-full bg-slate-900 border border-slate-600 text-white p-3 rounded-lg focus:outline-none focus:border-violet-500" value={formData.ucast} onChange={e => setFormData({...formData, ucast: e.target.value})}>
            <option value="">Vyberte</option>
            <option>Poprvé</option><option>Několikrát ročně</option><option>Měsíčně</option><option>Týdně</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-slate-300 text-sm mb-2">Hodnocení (1-5)</label>
          <div className="flex gap-4">
            {[1,2,3,4,5].map(n => (
              <label key={n} className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input type="radio" name="hodnoceni" value={n} checked={formData.hodnoceni == n} onChange={e => setFormData({...formData, hodnoceni: e.target.value})} />
                <span className="w-10 h-10 rounded-lg flex items-center justify-center border border-slate-600 hover:border-violet-500 hover:bg-slate-700 transition">{n}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-slate-300 text-sm mb-2">Jak jste se o nás dozvěděli?</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Sociální sítě', 'Doporučení', 'Google', 'Jiné'].map(opt => (
              <label key={opt} className="flex items-center gap-2 text-slate-400 cursor-pointer hover:text-violet-400">
                <input type="checkbox" className="accent-violet-500" />
                {opt}
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-slate-300 text-sm mb-2">Komentáře</label>
          <textarea className="w-full bg-slate-900 border border-slate-600 text-white p-3 rounded-lg h-24 resize-none focus:outline-none focus:border-violet-500" value={formData.comments} onChange={e => setFormData({...formData, comments: e.target.value})} />
        </div>

        <div className="mb-6">
          <label className="flex items-center gap-3 text-slate-400 cursor-pointer">
            <input type="checkbox" required checked={formData.souhlas} onChange={e => setFormData({...formData, souhlas: e.target.checked})} className="accent-violet-500" />
            Souhlasím se zpracováním osobních údajů
          </label>
        </div>

        <div className="flex gap-4 items-center">
          <input type="range" min="0" max="100" className="flex-1 accent-violet-500" />
          <button type="submit" className="bg-violet-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-violet-500 transition">Odeslat</button>
        </div>
      </form>
    </div>
  )
}

function Kontakty() {
  const [formData, setFormData] = useState({ jmeno: '', email: '', predmet: '', zprava: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('E-mail byl úspěšně odeslán!')
    setFormData({ jmeno: '', email: '', predmet: '', zprava: '' })
  }

  return (
    <div className="h-full px-8 md:px-16 py-12 flex flex-col justify-start overflow-auto">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">Kontakty</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl">
        <div className="space-y-6">
          <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
            <h3 className="font-semibold text-white mb-4">Zastupitelé</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-violet-600/20 flex items-center justify-center text-violet-400 font-semibold border border-violet-500/30">JN</div>
                <div>
                  <p className="font-medium text-white">Jan Novák</p>
                  <p className="text-slate-400 text-sm">Ředitel</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-violet-600/20 flex items-center justify-center text-violet-400 font-semibold border border-violet-500/30">ES</div>
                <div>
                  <p className="font-medium text-white">Eva Svobodová</p>
                  <p className="text-slate-400 text-sm">Vedoucí technického oddělení</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-violet-600/20 flex items-center justify-center text-violet-400 font-semibold border border-violet-500/30">MP</div>
                <div>
                  <p className="font-medium text-white">Martin Procházka</p>
                  <p className="text-slate-400 text-sm">Bezpečnostní analytik</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700 space-y-3">
            <p><strong className="text-violet-400">Adresa:</strong> <span className="text-slate-300">Praha 5, Na Pankráci 1234/56, 140 00</span></p>
            <p><strong className="text-violet-400">Telefon:</strong> <span className="text-slate-300">+420 123 456 789</span></p>
            <p><strong className="text-violet-400">E-mail:</strong> <span className="text-slate-300">info@netwatch.cz</span></p>
            <p><strong className="text-violet-400">IČO:</strong> <span className="text-slate-300">12345678</span></p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
            <h3 className="font-semibold text-white mb-4">Naše sídlo</h3>
            <div className="aspect-video bg-slate-900 border border-slate-600 rounded-xl flex items-center justify-center">
              <span className="text-slate-500">Mapa</span>
            </div>
          </div>
          
          <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
            <h3 className="font-semibold text-white mb-4">Napište nám</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" required placeholder="Vaše jméno" className="w-full bg-slate-900 border border-slate-600 text-white p-3 rounded-lg focus:outline-none focus:border-violet-500" value={formData.jmeno} onChange={e => setFormData({...formData, jmeno: e.target.value})} />
              <input type="email" required placeholder="Váš e-mail" className="w-full bg-slate-900 border border-slate-600 text-white p-3 rounded-lg focus:outline-none focus:border-violet-500" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              <input type="text" required placeholder="Předmět" className="w-full bg-slate-900 border border-slate-600 text-white p-3 rounded-lg focus:outline-none focus:border-violet-500" value={formData.predmet} onChange={e => setFormData({...formData, predmet: e.target.value})} />
              <textarea required placeholder="Zpráva" className="w-full bg-slate-900 border border-slate-600 text-white p-3 rounded-lg h-24 resize-none focus:outline-none focus:border-violet-500" value={formData.zprava} onChange={e => setFormData({...formData, zprava: e.target.value})} />
              <button type="submit" className="w-full bg-violet-600 text-white py-3 rounded-lg font-medium hover:bg-violet-500 transition">Odeslat e-mail</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

function Dukaz() {
  const reviews = [
    { name: 'Petr Svoboda', company: 'TechCorp s.r.o.', text: 'Služby Net-watch nám pomohly odhalit kritické bezpečnostní riziko v naší infrastruktuře.', rating: 5 },
    { name: 'Marie Kovářová', company: 'FinanceHub a.s.', text: 'Díky penetračnímu testování od Net-watch jsme získali certifikaci ISO 27001.', rating: 5 },
    { name: 'Tomáš Dvořák', company: 'InnovateTech', text: 'Nejlepší investice do bezpečnosti. Jejich tým je vždy k dispozici.', rating: 4 },
    { name: 'Anna Procházková', company: 'MediaGroup', text: 'Školení zaměstnanců výrazně snížilo počet bezpečnostních incidentů.', rating: 5 },
    { name: 'Martin Horák', company: 'RetailPlus', text: 'Monitoring sítí nám ušetřil statisíce korun díky včasné detekci hrozeb.', rating: 5 },
    { name: 'Zdeňka Nová', company: 'HealthCare Solutions', text: 'Vynikající bezpečnostní audit. Identifikovali všechny slabiny.', rating: 4 },
  ]

  return (
    <div className="h-full px-8 md:px-16 py-12 flex flex-col justify-start overflow-auto">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">Důkazy spokojenosti</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
        {reviews.map((r, i) => (
          <div key={i} className="p-6 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-violet-500/50 transition-colors">
            <div className="flex gap-1 mb-4">
              {Array(r.rating).fill('★').map((s, j) => <span key={j} className="text-yellow-400">{s}</span>)}
            </div>
            <p className="text-slate-300 mb-6 leading-relaxed">"{r.text}"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-600/20 flex items-center justify-center text-violet-400 text-sm font-medium border border-violet-500/30">
                {r.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="font-medium text-white">{r.name}</p>
                <p className="text-slate-500 text-sm">{r.company}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App

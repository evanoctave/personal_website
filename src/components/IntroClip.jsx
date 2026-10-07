// IntroClip: the "fade in and wave" clip under the home page heading. It plays once; a second before it
// ends it fades to black, the black box fades away, and then it tells the home page it's gone so the page
// can glide everything into the space (HomePage.jsx does that part). It starts once nothing covers the
// page (the printer intro or a page warp) so the fade-in is never hidden. Styles are .intro-clip in
// site.css.
import { useEffect, useRef, useState } from 'react'

// KNOB: the clip (public/clips/) and what screen readers hear for it. App.test.jsx checks SRC.
// to remake wave.mp4 from the raw camera file: cut 24.8s +3.8s of MOVI0116.avi at 20fps, crop to
// 1344x1008 from the top centre (drops the burned-in date stamp, stays 4:3), fade in 0.9s
export const SRC = '/clips/wave.mp4'
const LABEL = 'Evan sits down in front of the camera and waves'
// KNOB: the photo printed on the page in the printer intro (src/fx/PrinterIntro.jsx)
export const STILL = '/photos/mb-pier.jpg'

// KNOB: the fade-out. LEAD = seconds before the end that the fade to black starts; the two lengths must
// match the .is-fading / .is-out transitions under .intro-clip in site.css
const LEAD = 1
const FADE_MS = 900
const OUT_MS = 350

// the printer intro (.pi) and page warp (.pw) both sit on top of the page while they run
const covered = () => document.querySelector('.pi, .pw')

// replay: bump it to play the clip again from the top. onGone: called once the clip has faded away
export default function IntroClip({ replay = 0, onGone }) {
  const ref = useRef(null)
  // 'play' -> 'fading' (video to black) -> 'out' (black box fades away) -> onGone
  const [phase, setPhase] = useState('play')
  const goneRef = useRef(onGone)
  goneRef.current = onGone

  useEffect(() => {
    const video = ref.current
    if (!video) return undefined
    setPhase('play')
    let frame = 0
    try {
      video.pause()
      video.currentTime = 0
    } catch {
      // not ready yet; it starts from the top anyway
    }
    const watch = () => {
      if (video.duration && video.currentTime >= video.duration - LEAD) {
        setPhase('fading')
        return
      }
      frame = window.requestAnimationFrame(watch)
    }
    const start = () => {
      if (covered()) {
        frame = window.requestAnimationFrame(start)
        return
      }
      // autoplay can be refused (low power mode etc.); then just get out of the way
      const playing = video.play?.()
      playing?.catch?.(() => goneRef.current?.())
      frame = window.requestAnimationFrame(watch)
    }
    frame = window.requestAnimationFrame(start)
    return () => window.cancelAnimationFrame(frame)
  }, [replay])

  useEffect(() => {
    if (phase === 'play') return undefined
    const timer = phase === 'fading'
      ? window.setTimeout(() => setPhase('out'), FADE_MS)
      : window.setTimeout(() => goneRef.current?.(), OUT_MS)
    return () => window.clearTimeout(timer)
  }, [phase])

  return (
    <div className={`intro-photo intro-clip${phase === 'play' ? '' : ' is-fading'}${phase === 'out' ? ' is-out' : ''}`}>
      <video aria-label={LABEL} muted onEnded={() => setPhase((now) => (now === 'play' ? 'fading' : now))} playsInline preload="auto" ref={ref} src={SRC} />
    </div>
  )
}

// IntroClip: the "fade in and wave" clip under the home page heading. It plays once and, about a second
// before it ends, eases into a photo that stays (the Manhattan Beach sunset) with a soft wipe.
// It starts once nothing covers the page (the printer intro or a page warp) so the fade-in is never
// hidden. Reduced motion skips straight to the photo. Used by HomePage.jsx; styles are .intro-clip in
// site.css.
import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../fx/FxProvider.jsx'

// KNOB: the clip (public/clips/) and what screen readers hear for it. App.test.jsx checks SRC.
// to remake wave.mp4 from the raw camera file: cut 24.8s +3.8s of MOVI0116.avi at 20fps, crop to
// 1344x1008 from the top centre (drops the burned-in date stamp, stays 4:3), fade in 0.9s
export const SRC = '/clips/wave.mp4'
const LABEL = 'Evan sits down in front of the camera and waves'
// KNOB: the photo the clip turns into (also printed on the page in the printer intro), its crop, and its
// description. the hand-off's look and timing live under .intro-clip in site.css
export const STILL = '/photos/mb-pier.jpg'
const STILL_POSITION = '70% 50%'
const STILL_ALT = 'Sun setting beside the Manhattan Beach pier'

// KNOB: how many seconds before the clip ends the hand-off starts. overlapping keeps the wave moving
// under the wipe instead of freezing on the last frame first
const LEAD = 1.3

// the printer intro (.pi) and page warp (.pw) both sit on top of the page while they run
const covered = () => document.querySelector('.pi, .pw')

// replay: bump it to play the clip again from the top (the home page's replay button does)
export default function IntroClip({ replay = 0 }) {
  const ref = useRef(null)
  const reduced = prefersReducedMotion()
  const [done, setDone] = useState(reduced)

  useEffect(() => {
    const video = ref.current
    if (!video || reduced) return undefined
    setDone(false)
    let frame = 0
    try {
      video.pause()
      video.currentTime = 0
    } catch {
      // not ready yet; it starts from the top anyway
    }
    // once playing, check every frame and start the hand-off LEAD seconds before the end
    const watch = () => {
      if (video.duration && video.currentTime >= video.duration - LEAD) {
        setDone(true)
        return
      }
      frame = window.requestAnimationFrame(watch)
    }
    const start = () => {
      if (covered()) {
        frame = window.requestAnimationFrame(start)
        return
      }
      // autoplay can be refused (low power mode etc.); then skip to the photo rather than sit on black
      const playing = video.play?.()
      playing?.catch?.(() => setDone(true))
      frame = window.requestAnimationFrame(watch)
    }
    frame = window.requestAnimationFrame(start)
    return () => window.cancelAnimationFrame(frame)
  }, [replay, reduced])

  return (
    <div className={`intro-photo intro-clip${done ? ' is-done' : ''}`}>
      {!reduced && (
        <video aria-hidden={done} aria-label={LABEL} muted onEnded={() => setDone(true)} playsInline preload="auto" ref={ref} src={SRC} />
      )}
      <img alt={STILL_ALT} aria-hidden={!done} className="intro-clip-after" src={STILL} style={{ objectPosition: STILL_POSITION }} />
    </div>
  )
}

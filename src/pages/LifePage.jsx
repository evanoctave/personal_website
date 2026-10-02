import { Link } from 'react-router-dom'
import Clip from '../components/Clip.jsx'
import Placeholder from '../components/Placeholder.jsx'
import { chapters, days, formatDay } from '../data/life.js'

function Roll({ items }) {
  return (
    <ul className="roll">
      {items.map((item) => (
        <li className={`shot shot--${item.kind}${item.wide ? ' shot--wide' : ''}`} key={item.src}>
          <figure>
            {item.kind === 'clip'
              ? <Clip alt={item.alt} poster={item.poster} src={item.src} />
              : <Placeholder alt={item.alt} position={item.position} ratio={item.ratio ?? (item.wide ? '3 / 2' : '3 / 4')} src={item.src} />}
            <figcaption>
              {item.caption}
              {item.when && <span className="when"> · {item.when}</span>}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  )
}

export default function LifePage() {
  const digicamCount = days.reduce((total, day) => total + day.items.length, 0)
  const phoneCount = chapters.reduce((total, chapter) => total + chapter.items.length, 0)

  return (
    <section className="page life">
      <div className="life-intro">
        <h1>life</h1>
        <Placeholder alt="A small silver digicam sitting on a desk next to a keyboard" className="life-cam" ratio="4 / 5" src="/photos/digicam.jpg" />
        <p className="lede">Friends, campus, baseball, dogs, snacks.</p>
        <p className="muted">
          {digicamCount} shots from a $30 digicam, then {phoneCount} from my phone going back to senior year.
          Clips are muted until you say otherwise. The nerd stuff is on the <Link to="/about">about page</Link>.
        </p>
      </div>

      <nav aria-label="Chapters" className="life-nav">
        <a href="#chapter-digicam">digicam</a>
        {chapters.map((chapter) => <a href={`#chapter-${chapter.id}`} key={chapter.id}>{chapter.title}</a>)}
      </nav>

      <section aria-labelledby="chapter-digicam" className="chapter">
        <header className="chapter-head">
          <h2 id="chapter-digicam">aug 2026 · the digicam</h2>
          <p className="muted">One week, dated by the camera.</p>
        </header>
        {days.map((day) => (
          <section aria-labelledby={`day-${day.date}`} className="day" key={day.date}>
            <header className="day-head">
              <h3 id={`day-${day.date}`}>
                <time dateTime={day.date}>{formatDay(day.date)}</time>
              </h3>
              <p className="muted">{day.title}. {day.note}</p>
            </header>
            <Roll items={day.items} />
          </section>
        ))}
      </section>

      {chapters.map((chapter) => (
        <section aria-labelledby={`chapter-${chapter.id}`} className="chapter" key={chapter.id}>
          <header className="chapter-head">
            <h2 id={`chapter-${chapter.id}`}>{chapter.title}</h2>
            <p className="muted">{chapter.note}</p>
          </header>
          <Roll items={chapter.items} />
        </section>
      ))}
    </section>
  )
}

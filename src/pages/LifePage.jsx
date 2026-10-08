// Life page (/life): the photo + clip roll. the digicam week day by day, then the phone chapters.
// all the content is in src/data/life.js; components/Clip.jsx plays videos, Placeholder.jsx shows photos.
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
            {/* KNOB: photo shape when an item has no ratio: '3 / 2' if wide, else '3 / 4' */}
            {item.kind === 'clip'
              ? <Clip alt={item.alt} poster={item.poster} src={item.src} />
              : <Placeholder alt={item.alt} caption={item.when ? `${item.caption} · ${item.when}` : item.caption} position={item.position} ratio={item.ratio ?? (item.wide ? '3 / 2' : '3 / 4')} src={item.src} />}
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
  const phoneCount = chapters.reduce((total, chapter) => total + chapter.items.length, 0)

  return (
    <section className="page life">
      {/* KNOB: heading, lede, and intro note (App.test.jsx expects the h1 'life'). phoneCount counts itself */}
      <h1>life</h1>
      {/* KNOB: the photo up top, from the digicam roll. position = crop focus (far right: building, lamp, date stamp) */}
      <Placeholder alt="A parking lot at night, a lit apartment building and street lamps glowing behind the cars" className="life-cam" position="100% 50%" ratio="4 / 5" src="/photos/PICT0024.jpg" />
      <p className="lede">Places, friends, campus, baseball, trees, snacks.</p>
      <p className="muted">
        little bits of life :)
        Clips are muted until you say otherwise. The nerd stuff is on the <Link to="/about">about page</Link>.
      </p>

      <section aria-labelledby="chapter-digicam" className="chapter">
        {/* KNOB: digicam chapter heading + note. the days themselves are `days` in src/data/life.js */}
        <header className="chapter-head">
          <h2 id="chapter-digicam">sep 2026 · keychain camera</h2>
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

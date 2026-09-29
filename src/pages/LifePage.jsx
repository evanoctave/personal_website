import { Link } from 'react-router-dom'
import Clip from '../components/Clip.jsx'
import Placeholder from '../components/Placeholder.jsx'
import { days, formatDay } from '../data/life.js'

// clips take two columns, so a clip-heavy day tiles better at two columns than three
const columnsFor = (items) => {
  const clips = items.filter((item) => item.kind === 'clip').length
  return clips > items.length - clips || items.length < 3 ? 2 : 3
}

export default function LifePage() {
  const count = days.reduce((total, day) => total + day.items.length, 0)

  return (
    <section className="page life">
      <h1>life</h1>
      <p className="lede">Stuff from a $30 digicam. Friends, campus, snacks.</p>
      <p className="muted">
        {count} shots so far, dated by the camera. Clips are muted until you say otherwise.
        The nerd stuff is on the <Link to="/about">about page</Link>.
      </p>

      {days.map((day) => (
        <section aria-labelledby={`day-${day.date}`} className="day" key={day.date} style={{ '--cols': columnsFor(day.items) }}>
          <header className="day-head">
            <h2 id={`day-${day.date}`}>
              <time dateTime={day.date}>{formatDay(day.date)}</time>
            </h2>
            <p className="muted">{day.title}. {day.note}</p>
          </header>
          <ul className="roll">
            {day.items.map((item) => (
              <li className={`shot shot--${item.kind}`} key={item.src}>
                <figure>
                  {item.kind === 'clip'
                    ? <Clip alt={item.alt} poster={item.poster} src={item.src} />
                    : <Placeholder alt={item.alt} src={item.src} />}
                  <figcaption>{item.caption}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </section>
  )
}

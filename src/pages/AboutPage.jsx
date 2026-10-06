// About page (/about): the intro, bio, school, and desk + bench photos.
// photos are files in public/photos/, shown with components/Placeholder.jsx. styles in src/styles/site.css.
import { Link } from 'react-router-dom'
import Placeholder from '../components/Placeholder.jsx'

export default function AboutPage() {
  return (
    <section className="page">
      {/* KNOB: heading + subheading (App.test.jsx expects the h1 to say 'me') */}
      <h1>me</h1>
      <h2>you can call me ev</h2>
      {/* KNOB: the main about photo: src (file in public/photos/), alt, crop (position), shape (ratio) */}
      <Placeholder alt="Hello!" className="about-photo" position="50% 20%" ratio="4 / 5" src="/photos/hedge.jpg" />
      {/* KNOB: the one-liner under the photo */}
      <p className="lede">
        super mario galaxy speedrunner, don toliver fanboy, culinary warrior
      </p>
      {/* KNOB: the main bio. the comment inside marks where the tribute-page link goes */}
      <p>
        ...i guess i dabble in technology, too.
        
        My interest in technology came from a biiiiig looooove for video games (I know, how original.) specifically the mario franchise, from the ORIGINAL mario brothers game on the Famicom to Super Mario Galaxy (100%'d over 5 times, green stars included, ask me 'bout it.)
        I also grew up with a thing for puzzles and puzzle games--Probably came from the OCD.
        This naturally compounded into a passion for electronics and technology, leading me to binge watch as many technology unboxings as possible.
        
        My very first software project was a tribute page to one of my favorite baseball players, Trevor Bauer (BEFORE the controversy.)
        I'll leave a link to it right here. {/* leave a link to it in the word here */}

        Not too sure what else to say, <Link to="/contact">HMU</Link> and let's chat about...yeah!
      </p>

      {/* KNOB: the three photos under the bio: order, src, alt (also the lightbox text), crop, shape */}
      <div className="gallery gallery--three">
        <Placeholder alt="dealin'" position="50% 50%" ratio="3 / 4" src="/photos/pitch.jpg" />
        <Placeholder alt="BIG TUFFY" position="50% 40%" ratio="3 / 4" src="/photos/tuffy.jpg" />
        <Placeholder alt="physics project" position="50% 50%" ratio="3 / 4" src="/photos/workbench.jpg" />
      </div>

      {/* KNOB: school + degree line */}
      <h2>School</h2>
      <p>(B.S. Computer Engineering, California State University, Fullerton, 2029)</p>

      {/* KNOB: desk + bench photo row and the note under it */}
      <h2>Desk + bench</h2>
      <div className="gallery gallery--three">
        <Placeholder alt="A small wheeled robot on carpet" position="50% 50%" ratio="2 / 3" src="/photos/robot-car.jpg" />
        <Placeholder alt="Two monitors and a laptop with code on a home desk" position="50% 50%" ratio="2 / 3" src="/photos/desk-setup.jpg" />
        <Placeholder alt="They did surgery on a laptop" position="50% 50%" ratio="2 / 3" src="/photos/laptop-guts.jpg" />
      </div>
      <p className="muted">Server rack photos coming soon, peep the <Link to="/life">life page</Link>.</p>
    </section>
  )
}

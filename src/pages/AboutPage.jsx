// About page (/about): the intro, bio, school, and desk + bench photos.
// photos are files in public/photos/, shown with components/Placeholder.jsx. styles in src/styles/site.css.
import { Link } from 'react-router-dom'
import Placeholder from '../components/Placeholder.jsx'

export default function AboutPage() {
  return (
    <section className="page">
      {/* KNOB: heading + subheading (App.test.jsx expects the h1 to say 'me') */}
      <h1>me</h1>
      <h2>Evan Barreau, but you can call me ev</h2>
      {/* KNOB: the main about photo: src (file in public/photos/), alt, crop (position), shape (ratio) */}
      <Placeholder alt="Evan in a black t-shirt and chain in front of a hedge" caption="Hello!" className="about-photo" position="50% 20%" ratio="4 / 5" src="/photos/hedge.jpg" />
      {/* KNOB: the one-liner under the photo */}
      <p className="lede">
        super mario galaxy speedrunner, don toliver fanboy, culinary warrior
      </p>
      {/* KNOB: the main bio, one <p> per paragraph (blank lines inside a single <p> don't show on the page) */}
      <p>...i guess i dabble in technology, too.</p>
      <p>
        It started with a biiiiig looooove for video games (I know, how original), mostly Mario: from the ORIGINAL
        Mario Bros. on the Famicom to Super Mario Galaxy (100%&apos;d over 5 times, green stars included, ask me
        &apos;bout it). I also grew up hooked on puzzles and puzzle games (probably the OCD), and all of that turned
        into a love of electronics and way too many tech unboxing videos.
      </p>
      <p>
        My very first software project was a tribute page to one of my favorite baseball players.
        {/* TODO: link the tribute page here, e.g. <a href="https://...">Here it is.</a> */}
      </p>
      <p>Not too sure what else to say. <Link to="/contact">HMU</Link> and let&apos;s chat about...yeah!</p>

      {/* KNOB: the three photos under the bio: order, src, alt (what screen readers say), caption (the joke the
          photo viewer shows), crop, shape */}
      <div className="gallery gallery--three">
        <Placeholder alt="Evan mid-pitch on the mound in a pinstripe uniform" caption="dealin'" position="50% 50%" ratio="3 / 4" src="/photos/pitch.jpg" />
        <Placeholder alt="Evan with Tuffy the Titan, the Cal State Fullerton mascot" caption="BIG TUFFY" position="50% 40%" ratio="3 / 4" src="/photos/tuffy.jpg" />
        <Placeholder alt="A breadboard circuit wired to a decade resistor box" caption="physics project" position="50% 50%" ratio="3 / 4" src="/photos/workbench.jpg" />
      </div>

      {/* KNOB: school + degree line */}
      <h2>School</h2>
      <p>B.S. Computer Engineering, California State University, Fullerton. Class of 2029.</p>

      {/* KNOB: desk + bench photo row and the note under it */}
      <h2>Desk + bench</h2>
      <div className="gallery gallery--three">
        <Placeholder alt="A small wheeled robot on carpet" position="50% 50%" ratio="2 / 3" src="/photos/robot-car.jpg" />
        <Placeholder alt="Two monitors and a laptop with code on a home desk" position="50% 50%" ratio="2 / 3" src="/photos/desk-setup.jpg" />
        <Placeholder alt="A laptop taken apart with its motherboard exposed" caption="They did surgery on a laptop" position="50% 50%" ratio="2 / 3" src="/photos/laptop-guts.jpg" />
      </div>
      <p className="muted">Non-nerd stuff lives on the <Link to="/life">life page</Link>.</p>
    </section>
  )
}

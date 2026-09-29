import { Link } from 'react-router-dom'
import Placeholder from '../components/Placeholder.jsx'

export default function AboutPage() {
  return (
    <section className="page">
      <h1>me</h1>
      <h2>you can call me ev</h2>
      <Placeholder alt="Evan in a black t-shirt and chain standing in front of a hedge under palm trees" className="about-photo" position="50% 20%" ratio="4 / 5" src="/photos/hedge.jpg" />
      <p className="lede">
        hardware builder, software creator, bug multiplier.
      </p>
      <p>
        My interest in technology came from a biiiiig looooove for video games (I know, how original.)
        I was a Nintendo fanboy growing up, obsessed with the Mario Brothers franchise all the way from the ORIGINAL mario brothers game on the Famicom to Super Mario Galaxy (100%'d over 5 times, green stars included, ask me 'bout it.)
        I also grew up with a huge thing for puzzles and puzzle games--Probably came from the OCD.
        This naturally compounded into a passion for electronic and technology, leading me to binge watch as many technology unboxings as possible before my mom would catch me staying up past my bedtime.
        I only started learning how to program when I started university, which was back in August of 2025.
        
      </p>

      <h2>Right now</h2>
      <ul>
        <li>creating internal tools for the Department of Information Technology @ CSUF</li>
        <li>building EvoEat, a free macro and meal planning app with subscription-free photo scanning and analysis</li>
        <li>playing baseball (ask me!)</li>
        <li>maintaining my home server</li>
        <li>discovering another instance of the golden ratio in nature</li>
        <li>asking too many questions</li>
      </ul>

      <div className="gallery gallery--three">
        <Placeholder alt="Evan mid-pitch on the mound in a pinstripe uniform" position="50% 50%" ratio="3 / 4" src="/photos/pitch.jpg" />
        <Placeholder alt="Evan walking with Tuffy the elephant, the Cal State Fullerton mascot" position="40% 50%" ratio="3 / 4" src="/photos/tuffy.jpg" />
        <Placeholder alt="Evan at the IT desk with two monitors and a headset" position="50% 50%" ratio="3 / 4" src="/photos/it-desk.jpg" />
      </div>

      <h2>School</h2>
      <p>(B.S. Computer Engineering, California State University, Fullerton, 2029)</p>

      <h2>Desk + whiteboard</h2>
      <div className="gallery gallery--three">
        <Placeholder alt="Whiteboard with thin film interference equations" position="40% 50%" ratio="2 / 3" src="/photos/PICT0016.jpg" />
        <Placeholder alt="Spiral notebook with function and inverse problems" position="60% 50%" ratio="2 / 3" src="/photos/PICT0040.jpg" />
        <Placeholder alt="Laptop and open textbook on a study table" position="40% 50%" ratio="2 / 3" src="/photos/PICT0043.jpg" />
      </div>
      <p className="muted">Rack photos coming once I clean the cables. More of the non-nerd stuff on the <Link to="/life">life page</Link>.</p>
    </section>
  )
}

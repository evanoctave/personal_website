import Placeholder from '../components/Placeholder.jsx'

export default function AboutPage() {
  return (
    <section className="page">
      <h1>me</h1>
      <h2>you can call me ev</h2>
      <Placeholder className="about-photo" label="me" ratio="4 / 5" />
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

      <h2>School</h2>
      <p>(B.S. Computer Engineering, California State University, Fullerton, 2029)</p>

      <h2>Desk + rack</h2>
      <div className="gallery gallery--three">
        <Placeholder label="rack" ratio="2 / 3" />
        <Placeholder label="desk" ratio="2 / 3" />
        <Placeholder label="close-up" ratio="2 / 3" />
      </div>
    </section>
  )
}

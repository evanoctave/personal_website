export default function PersonalMediaPanel() {
  return (
    <section aria-label="Personal media placeholders" className="personal-media-panel">
      <article className="media-slot media-slot--portrait">
        <p className="eyebrow">Portrait slot</p>
        <h2>Add portrait of Evan</h2>
        <p>Replace with an in-person photo when ready.</p>
      </article>
      <article className="media-slot media-slot--rack">
        <p className="eyebrow">Hardware slot</p>
        <h2>Add photo of in-person server rack</h2>
        <p>Replace with real equipment photo and descriptive alt text.</p>
      </article>
    </section>
  )
}

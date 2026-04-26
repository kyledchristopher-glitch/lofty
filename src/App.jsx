import BeachScene from './components/BeachScene.jsx'
import './index.css'

function App() {
  return (
    <>
      <BeachScene />
      <main className="contentWrap">
        <section className="introPanel">
          <p className="sectionKicker">Roasting Works · Encinitas</p>
          <h2>Built around the ritual of coastal coffee.</h2>
          <p>
            A pitch concept for Lofty Coffee that turns the Encinitas sunset into a scroll-driven brand moment:
            organic coffee, scratch-made food, and a calm café atmosphere from first light to afterglow.
          </p>
        </section>

        <section className="storyGrid" aria-label="Lofty concept pillars">
          <article>
            <span>01</span>
            <h3>Roasted by the Coast</h3>
            <p>Fresh-roasted coffee presented with the pace and warmth of North Coast Highway 101.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Bakery & Brunch</h3>
            <p>House-baked pastries, nourishing breakfast plates, brunch staples, and café classics.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Stay Awhile</h3>
            <p>A spacious, work-friendly café experience for locals, travelers, remote workers, and slow mornings.</p>
          </article>
        </section>

        <section className="ctaPanel">
          <p className="sectionKicker">97 N Coast Hwy 101 · Encinitas, CA</p>
          <h2>Coffee on the Coast, from sunrise to afterglow.</h2>
          <div className="buttonRow">
            <a href="https://loftycoffee.com/pages/roasting-works" target="_blank" rel="noreferrer">Visit Roasting Works</a>
            <a href="https://loftycoffee.com/" target="_blank" rel="noreferrer" className="secondary">Explore Lofty</a>
          </div>
        </section>
      </main>
    </>
  )
}

export default App

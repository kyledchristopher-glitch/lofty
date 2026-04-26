import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import StarField from './StarField.jsx'
import styles from './BeachScene.module.css'

gsap.registerPlugin(ScrollTrigger)

const REQUIRED_ASSETS = [
  '/images/beach-day.jpg',
  '/images/beach-night.jpg',
  '/images/sun.png',
  '/images/bonfire.png'
]

function useImagePreflight(srcList) {
  const [missing, setMissing] = useState([])

  useEffect(() => {
    let cancelled = false

    Promise.all(
      srcList.map(
        (src) =>
          new Promise((resolve) => {
            const image = new Image()
            image.onload = () => resolve(null)
            image.onerror = () => resolve(src)
            image.src = src
          })
      )
    ).then((results) => {
      if (!cancelled) setMissing(results.filter(Boolean))
    })

    return () => {
      cancelled = true
    }
  }, [srcList])

  return missing
}

export default function BeachScene() {
  const sceneRef = useRef(null)
  const dayRef = useRef(null)
  const nightRef = useRef(null)
  const starsWrapRef = useRef(null)
  const sunRef = useRef(null)
  const bonfireRef = useRef(null)
  const copyRef = useRef(null)
  const scrollHintRef = useRef(null)
  const missingAssets = useImagePreflight(REQUIRED_ASSETS)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      gsap.set(nightRef.current, { opacity: 0 })
      gsap.set(starsWrapRef.current, { opacity: 0 })
      gsap.set(bonfireRef.current, { opacity: 0, scale: 0.68, y: 16, transformOrigin: '50% 100%' })
      gsap.set(copyRef.current, { opacity: 0, y: 34 })
      gsap.set(sceneRef.current, { '--vignette-opacity': 0.28, '--night-wash-opacity': 0 })

      if (reduceMotion) {
        gsap.set(nightRef.current, { opacity: 1 })
        gsap.set(starsWrapRef.current, { opacity: 1 })
        gsap.set(bonfireRef.current, { opacity: 1, scale: 1, y: 0 })
        gsap.set(copyRef.current, { opacity: 1, y: 0 })
        gsap.set(scrollHintRef.current, { opacity: 0 })
        return
      }

      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: sceneRef.current,
          start: 'top top',
          end: '+=350%',
          scrub: 0.9,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      })

      timeline
        // The sun only drops to the horizon, then fades before it can visibly cross the waterline.
        .to(sunRef.current, { y: '4.6vh', opacity: 0, scale: 0.58, ease: 'power2.in' }, 0)
        .to(dayRef.current, { opacity: 0.1 }, 0.3)
        .to(nightRef.current, { opacity: 1 }, 0.3)
        .to(sceneRef.current, { '--vignette-opacity': 0.78, '--night-wash-opacity': 0.24 }, 0.42)
        // Stars come in late, once the night sky is established.
        .to(starsWrapRef.current, { opacity: 1, ease: 'power1.out' }, 0.64)
        // The fire rises only a few pixels from the sand, not from the waterline.
        .to(bonfireRef.current, { opacity: 1, scale: 1, y: 0, ease: 'power2.out' }, 0.66)
        .to(copyRef.current, { opacity: 1, y: 0, ease: 'power2.out' }, 0.78)

      gsap.to(scrollHintRef.current, {
        opacity: 0,
        y: 10,
        duration: 0.35,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: sceneRef.current,
          start: 'top top-=1',
          end: 'top top-=2',
          toggleActions: 'play none none reverse'
        }
      })
    }, sceneRef)

    return () => ctx.revert()
  }, [])

  return (
    <main className={styles.pageShell}>
      <section ref={sceneRef} className={styles.scene} aria-label="Cinematic beach sunset to night scroll scene">
        <img ref={dayRef} className={styles.backgroundImage} src="/images/beach-day.jpg" alt="" aria-hidden="true" />
        <img ref={nightRef} className={styles.backgroundImage} src="/images/beach-night.jpg" alt="" aria-hidden="true" />

        <div ref={starsWrapRef} className={styles.starsWrap} aria-hidden="true">
          <StarField count={240} />
        </div>

        <img ref={sunRef} className={styles.sun} src="/images/sun.png" alt="" aria-hidden="true" />

        <div ref={bonfireRef} className={styles.bonfireWrap} aria-hidden="true">
          <div className={styles.fireGlow} />
          <img className={styles.bonfire} src="/images/bonfire.png" alt="" />
        </div>

        <div className={styles.nightWash} />
        <div className={styles.vignette} />

        <div ref={copyRef} className={styles.copyBlock}>
          <p className={styles.eyebrow}>Coffee on the Coast</p>
          <h1>From first light to afterglow.</h1>
          <p className={styles.bodyCopy}>Organic coffee, house-baked pastries, and a calm Encinitas café experience along North Coast Highway 101.</p>
        </div>

        <div ref={scrollHintRef} className={styles.scrollHint} aria-hidden="true">
          <span>Scroll</span>
          <i />
        </div>

        {missingAssets.length > 0 && (
          <aside className={styles.assetWarning} role="status">
            <strong>Missing image assets</strong>
            <span>Add these files to public/images/:</span>
            <code>{missingAssets.map((src) => src.replace('/images/', '')).join(', ')}</code>
          </aside>
        )}
      </section>
    </main>
  )
}

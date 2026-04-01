import { useMemo } from 'react'
import Particles from 'react-tsparticles'
import { loadSlim } from 'tsparticles-slim'

export function ParticlesBackground() {
  const options = useMemo(
    () => ({
      fullScreen: { enable: true, zIndex: -2 },
      background: { color: { value: '#050711' } },
      fpsLimit: 60,
      interactivity: {
        events: {
          onHover: { enable: true, mode: 'grab' },
          resize: true,
        },
        modes: {
          grab: { distance: 160, links: { opacity: 0.4 } },
        },
      },
      particles: {
        color: { value: ['#22d3ee', '#60a5fa', '#14b8a6'] },
        links: {
          color: '#0ea5e9',
          distance: 130,
          enable: true,
          opacity: 0.2,
          width: 1,
        },
        move: {
          direction: 'none',
          enable: true,
          outModes: { default: 'out' },
          random: true,
          speed: 0.5,
          straight: false,
        },
        number: { density: { enable: true, area: 900 }, value: 55 },
        opacity: { value: 0.4 },
        shape: { type: 'circle' },
        size: { value: { min: 1, max: 3 } },
      },
      detectRetina: true,
    }),
    [],
  )

  return <Particles id="tsparticles" init={loadSlim} options={options} />
}

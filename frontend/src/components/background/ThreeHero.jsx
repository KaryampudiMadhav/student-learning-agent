import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function ThreeHero() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x020617)

    const camera = new THREE.PerspectiveCamera(
      55,
      mount.clientWidth / 360,
      0.1,
      1000
    )
    camera.position.z = 12

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(mount.clientWidth, 360)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    // 💡 Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.9)
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2)
    dirLight.position.set(5, 10, 7)
    scene.add(ambient, dirLight)

    // 🧾 Label
    const createLabel = (text, isCenter = false) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      canvas.width = 1024
      canvas.height = 256

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.font = isCenter ? 'bold 64px Arial' : 'bold 52px Arial'
      ctx.fillStyle = '#e2e8f0'
      ctx.textAlign = 'center'

      ctx.fillText(text, canvas.width / 2, 140)

      const texture = new THREE.CanvasTexture(canvas)

      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
      })

      const sprite = new THREE.Sprite(material)
      sprite.scale.set(isCenter ? 5.5 : 4.5, isCenter ? 2 : 1.6, 1)

      return sprite
    }

    // 🔷 Geometry
    const geometry = new THREE.IcosahedronGeometry(1.2, 0)

    // 🧠 ORCHESTRATOR (ONLY HIGHLIGHTED)
    const orchestratorMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f6f8a,
      emissive: 0x0b4f63,
      emissiveIntensity: 2.1,
      metalness: 0.95,
      roughness: 0.16,
    })

    const orchestrator = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.3, 0),
      orchestratorMaterial
    )

    const orchestratorLabel = createLabel('Orchestrator Agent', true)

    scene.add(orchestrator, orchestratorLabel)

    // 🔄 Agents (ALL SAME COLOR, NO EDGES)
    const agentNames = [
      'Roadmap Agent',
      'Task Agent',
      'Resource Agent',
      'Evaluation Agent',
    ]

    const agents = agentNames.map((name, i) => {
      const material = new THREE.MeshStandardMaterial({
        color: 0x64748b, // neutral gray
        metalness: 0.6,
        roughness: 0.5,
      })

      const mesh = new THREE.Mesh(geometry, material)

      const label = createLabel(name)

      scene.add(mesh, label)

      return {
        mesh,
        label,
        angle: (i / agentNames.length) * Math.PI * 2,
        radius: 5,
        speed: 0.003 + i * 0.001,
      }
    })

    // ✨ Orbit ring (subtle)
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(4.8, 5, 64),
      new THREE.MeshBasicMaterial({
        color: 0x3b82f6,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.1,
      })
    )
    ring.rotation.x = Math.PI / 2
    scene.add(ring)

    // Mouse
    const mouse = { x: 0, y: 0 }

    const onMouseMove = (e) => {
      const rect = mount.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    }

    mount.addEventListener('mousemove', onMouseMove)

    // 🎥 Animation
    let raf
    const animate = () => {
      const time = Date.now() * 0.001

      // 🧠 Orchestrator (dominant animation)
      orchestrator.rotation.x += 0.01
      orchestrator.rotation.y += 0.01

      const scale = 1.15 + Math.sin(time * 2) * 0.1
      orchestrator.scale.set(scale, scale, scale)

      orchestratorLabel.position.set(0, -3.5, 0)

      // 🔄 Agents
      agents.forEach((agent) => {
        agent.angle += agent.speed

        const x = Math.cos(agent.angle) * agent.radius
        const z = Math.sin(agent.angle) * agent.radius
        const y = Math.sin(time + agent.angle) * 0.7

        agent.mesh.position.set(x, y, z)
        agent.mesh.rotation.x += 0.01
        agent.mesh.rotation.y += 0.01

        agent.label.position.set(x, y - 2.5, z)
      })

      // Camera
      camera.position.x += (mouse.x * 1 - camera.position.x) * 0.05
      camera.position.y += (mouse.y * 0.6 - camera.position.y) * 0.05

      camera.lookAt(scene.position)
      renderer.render(scene, camera)

      raf = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(raf)
      mount.removeEventListener('mousemove', onMouseMove)
      mount.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [])

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-white/10">
      <div ref={mountRef} className="w-full h-[360px]" />
    </div>
  )
}
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function ThreeHero() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, mount.clientWidth / 320, 0.1, 1000)
    camera.position.z = 8

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(mount.clientWidth, 320)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    const ambient = new THREE.AmbientLight(0x6dd5ff, 0.8)
    const directional = new THREE.DirectionalLight(0xffffff, 1)
    directional.position.set(5, 8, 6)
    scene.add(ambient, directional)

    const geometry = new THREE.IcosahedronGeometry(0.8, 0)
    const material = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x0e7490,
      emissiveIntensity: 0.4,
    })

    const meshes = Array.from({ length: 6 }).map((_, index) => {
      const mesh = new THREE.Mesh(geometry, material.clone())
      mesh.position.set((index - 2.5) * 1.4, Math.sin(index) * 0.8, -Math.random() * 2)
      mesh.rotation.set(Math.random(), Math.random(), Math.random())
      scene.add(mesh)
      return mesh
    })

    const mouse = { x: 0, y: 0 }

    const onMouseMove = (event) => {
      const rect = mount.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    }

    const onResize = () => {
      if (!mount) return
      camera.aspect = mount.clientWidth / 320
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, 320)
    }

    mount.addEventListener('mousemove', onMouseMove)
    window.addEventListener('resize', onResize)

    let raf
    const animate = () => {
      meshes.forEach((mesh, idx) => {
        mesh.rotation.x += 0.003 + idx * 0.0003
        mesh.rotation.y += 0.004 + idx * 0.0002
        mesh.position.y += Math.sin(Date.now() * 0.001 + idx) * 0.0012
      })
      camera.position.x += (mouse.x * 0.7 - camera.position.x) * 0.03
      camera.position.y += (mouse.y * 0.35 - camera.position.y) * 0.03
      camera.lookAt(scene.position)
      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(raf)
      mount.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      mount.removeChild(renderer.domElement)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      meshes.forEach((mesh) => {
        mesh.geometry.dispose()
        mesh.material.dispose()
      })
    }
  }, [])

  return <div ref={mountRef} className="w-full overflow-hidden rounded-2xl border border-cyan-200/15 bg-slate-900/30" />
}

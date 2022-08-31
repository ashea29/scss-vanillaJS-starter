const noReducedMotionPreference = window.matchMedia('(prefers-reduced-motion: no-preference)')


if (noReducedMotionPreference.matches) {
  AOS.init({
    duration: 800,
    mirror: true,
    easing: 'ease-in-out'
  })
}

noReducedMotionPreference.addEventListener('change', () => {
  window.location.reload()
})
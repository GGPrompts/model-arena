export function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[var(--bg-void)]">
      {/* Layer 0: Deep space void base */}
      <div className="absolute inset-0 bs-void-base" />

      {/* Layer 1: Nebula clouds - distant cosmic dust */}
      <div className="absolute inset-0 bs-nebula" />

      {/* Layer 2: Base atmospheric gradient */}
      <div className="absolute inset-0 bs-bg-gradient" />

      {/* Layer 3: Primary aurora - slow breathing glow */}
      <div className="absolute inset-0 bs-aurora" />

      {/* Layer 4: Secondary aurora - counter-rotating accent */}
      <div className="absolute inset-0 bs-aurora-secondary" />

      {/* Layer 5: Deep starfield - distant stars */}
      <div className="absolute inset-0 bs-starfield-deep" />

      {/* Layer 6: Near starfield - brighter, twinkling */}
      <div className="absolute inset-0 bs-starfield" />

      {/* Layer 7: Floating particles - energy motes */}
      <div className="absolute inset-0 bs-particles" />

      {/* Layer 8: Perspective grid floor */}
      <div className="absolute inset-0 bs-grid" />

      {/* Layer 9: Horizon glow line */}
      <div className="absolute inset-0 bs-horizon-glow" />

      {/* Layer 10: Diagonal signal interference */}
      <div className="absolute inset-0 bs-diagonals" />

      {/* Layer 11: Vertical data streams */}
      <div className="absolute inset-0 bs-data-streams" />

      {/* Layer 12: Central command glow - breathing core */}
      <div className="absolute inset-0 bs-core-glow" />

      {/* Layer 13: Edge accents - corner energy */}
      <div className="absolute inset-0 bs-edge-accents" />

      {/* Layer 14: Film grain / noise texture */}
      <div className="absolute inset-0 bs-noise" />

      {/* Layer 15: CRT scanlines */}
      <div className="absolute inset-0 bs-scanlines pointer-events-none" />

      {/* Layer 16: Chromatic aberration edges */}
      <div className="absolute inset-0 bs-chromatic" />

      {/* Layer 17: Heavy vignette - command focus */}
      <div className="absolute inset-0 bs-vignette" />
    </div>
  );
}

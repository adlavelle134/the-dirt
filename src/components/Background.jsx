export default function Background() {
  return (
    <>
      <div className="bg-landscape" aria-hidden="true">
        {/* Sky gradient */}
        <div className="bg-sky">
          {/* Sun */}
          <div className="bg-sun" style={{ bottom: '0', left: '50%', transform: 'translateX(-50%)' }}>
            <div className="bg-sun-lines">
              {[4, 3, 3, 2, 2, 3, 3, 4].map((h, i) => (
                <div key={i} className="bg-sun-line" style={{ height: `${h}px` }} />
              ))}
            </div>
          </div>
        </div>

        {/* Mountains */}
        <div className="bg-mountains">
          <svg
            viewBox="0 0 400 140"
            preserveAspectRatio="none"
            style={{ width: '100%', height: '100%', display: 'block' }}
          >
            {/* Back mountain range */}
            <polygon points="0,140 40,60 80,90 120,40 180,80 230,20 280,70 330,30 380,65 400,50 400,140" fill="#1a0030" />
            {/* Front mountain range */}
            <polygon points="0,140 0,100 50,80 100,110 150,65 200,95 250,55 300,85 360,70 400,90 400,140" fill="#2d0050" />
          </svg>
        </div>

        {/* Ground */}
        <div className="bg-ground">
          <div className="bg-ground-grid" />
        </div>
      </div>

      {/* CRT Scanlines */}
      <div className="scanlines" aria-hidden="true" />
    </>
  )
}

import { useNavigate } from 'react-router-dom'

const OBSTACLES = [
  { name: 'Over & Out', desc: 'Four beams stand in your way. Weave through, grab the sandbag, bring it back to the start, and throw your way back through every single one.' },
  { name: 'The Wobbler', desc: 'Grab the weight and find your balance. One foot in front of the other across the full beam. Fall off? Back to the start.' },
  { name: 'The Peaks', desc: 'An assault of vertical beams at every height imaginable. Run up, run down, no hands, no mercy. Just you and your legs.' },
  { name: 'The Ranch Bar', desc: "This isn't a fancy gym bar. It's pipe and cement and it's all yours. 5 deadlifts or 5 landmine rows — pick your poison." },
  { name: 'Ground & Pound', desc: 'This tractor tire outweighs your excuses. Two flips. All heart. Get it done and move on.' },
  { name: 'The Heave', desc: 'Grab a rock and get it to the other side. No carrying, no rolling, no excuses. Just you, the rock, and however many throws it takes.' },
  { name: 'Dead Weight', desc: "It's a stump. It's heavy. It's awkward. Bear hug it, shoulder it, drag your dignity along with it — just get it across the course." },
  { name: 'The Haul', desc: 'Load the wheelbarrow with burlap sacks of sand then push it through the course to the other end. Loading it is just the warm up.' },
  { name: 'The Drag', desc: 'Two ropes, one sled, and a whole lot of ground to cover. Dig in and pull that sled all the way to the other side.' },
  { name: 'Hand Over Fist', desc: "Grab the rope and don't let go. Pull that cement block all the way in, hand over fist, until it's at your feet. Then run it over to the other end and do it again." },
  { name: 'The Lumberjack', desc: 'Grab the log and carry it the full length of the course and back. It\'s the last obstacle. Give it everything you have left.' },
]

export default function Course() {
  const navigate = useNavigate()

  return (
    <div className="page">
      {/* Header */}
      <div style={{ width: '100%', marginBottom: '8px' }}>
        <button className="btn btn-cyan btn-small" onClick={() => navigate('/')}>
          ← BACK
        </button>
      </div>

      <h1 className="neon-cyan" style={{
        fontFamily: 'var(--font-arcade)',
        fontSize: 'clamp(1.2rem, 5vw, 2rem)',
        textAlign: 'center',
        letterSpacing: '4px',
        marginBottom: '8px',
        marginTop: '8px',
      }}>
        THE COURSE
      </h1>

      <div className="divider" />

      {/* Obstacle List */}
      <div className="arcade-panel w-full" style={{ maxWidth: '480px' }}>
        {OBSTACLES.map((obs, i) => (
          <div key={i} className="obstacle-item">
            <span className="obstacle-number">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <div style={{
                fontFamily: 'var(--font-arcade)',
                fontSize: '0.6rem',
                color: 'var(--cyan)',
                marginBottom: '6px',
                letterSpacing: '1px',
              }}>
                {obs.name}
              </div>
              <div className="obstacle-text">{obs.desc}</div>
            </div>
          </div>
        ))}
        <p style={{
          fontFamily: 'var(--font-arcade)',
          fontSize: '0.6rem',
          color: 'var(--yellow)',
          textShadow: 'var(--glow-yellow)',
          textAlign: 'center',
          lineHeight: '2',
          padding: '16px 8px 4px',
          letterSpacing: '1px',
        }}>
          Run back to the start and finish this.<br />You got this!
        </p>
      </div>

      {/* Penalty */}
      <div className="penalty-notice w-full mt-8" style={{ maxWidth: '480px' }}>
        ⚠ SKIP A STATION = 10 BURPEES ⚠
      </div>

      <div style={{ marginTop: '32px' }}>
        <button className="btn btn-cyan btn-small" onClick={() => navigate('/')}>
          ← BACK TO START
        </button>
      </div>
    </div>
  )
}

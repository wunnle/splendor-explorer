import { useEffect, useMemo, useState } from 'react'
import './App.css'
import type { Card } from './components/Card'
import { CardView } from './components/Card'
import { Sidebar } from './components/Sidebar'

export const allColors = ['black', 'blue', 'green', 'red', 'white'] as const

export type ColorKey = (typeof allColors)[number]

function App() {
  const [cards, setCards] = useState<Card[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [requires, setRequires] = useState<Set<ColorKey>>(new Set())
  const [vpFilter, setVpFilter] = useState<Set<number>>(new Set())
  const [tierFilter, setTierFilter] = useState<Set<number>>(new Set())
  const [cardColorFilter, setCardColorFilter] = useState<Set<ColorKey>>(new Set())
  const [onlyAffordable, setOnlyAffordable] = useState(false)
  const [bank, setBank] = useState<Record<ColorKey, number>>({
    black: 7,
    blue: 7,
    green: 7,
    red: 7,
    white: 7,
  })
  const [hand, setHand] = useState<Record<ColorKey, number>>({
    black: 0,
    blue: 0,
    green: 0,
    red: 0,
    white: 0,
  })

  useEffect(() => {
    const load = async () => {
      try {
        setStatus('loading')
        const res = await fetch('/cards.json')
        if (!res.ok) throw new Error('Failed to fetch cards.json')
        const data = (await res.json()) as Card[]
        setCards(data)
        setStatus('idle')
      } catch (error) {
        console.error(error)
        setStatus('error')
      }
    }

    load()
  }, [])

  const toggleRequire = (color: ColorKey) => {
    setRequires((prev) => {
      const next = new Set(prev)
      if (next.has(color)) {
        next.delete(color)
      } else {
        next.add(color)
      }
      return next
    })
  }

  const toggleVP = (vp: number) => {
    setVpFilter((prev) => {
      const next = new Set(prev)
      if (next.has(vp)) {
        next.delete(vp)
      } else {
        next.add(vp)
      }
      return next
    })
  }

  const toggleTier = (tier: number) => {
    setTierFilter((prev) => {
      const next = new Set(prev)
      if (next.has(tier)) {
        next.delete(tier)
      } else {
        next.add(tier)
      }
      return next
    })
  }

  const toggleCardColor = (color: ColorKey) => {
    setCardColorFilter((prev) => {
      const next = new Set(prev)
      if (next.has(color)) {
        next.delete(color)
      } else {
        next.add(color)
      }
      return next
    })
  }

  const takeBankGem = (color: ColorKey) => {
    if (bank[color] > 0) {
      setBank((prev) => ({ ...prev, [color]: prev[color] - 1 }))
      setHand((prev) => ({ ...prev, [color]: prev[color] + 1 }))
    }
  }

  const returnHandGem = (color: ColorKey) => {
    if (hand[color] > 0) {
      setHand((prev) => ({ ...prev, [color]: prev[color] - 1 }))
      setBank((prev) => ({ ...prev, [color]: prev[color] + 1 }))
    }
  }

  const clearHand = () => {
    const returns: Record<ColorKey, number> = { ...hand }
    setHand({ black: 0, blue: 0, green: 0, red: 0, white: 0 })
    setBank((prev) => ({
      black: prev.black + returns.black,
      blue: prev.blue + returns.blue,
      green: prev.green + returns.green,
      red: prev.red + returns.red,
      white: prev.white + returns.white,
    }))
  }

  const allVP = useMemo(() => {
    const vps = new Set(cards.map((c) => c.points))
    return Array.from(vps).sort((a, b) => a - b)
  }, [cards])

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      if (requires.size) {
        for (const color of requires) {
          if (card.cost[color] <= 0) return false
        }
      }
      if (vpFilter.size && !vpFilter.has(card.points)) return false
      if (tierFilter.size && !tierFilter.has(card.level)) return false
      if (cardColorFilter.size && !cardColorFilter.has(card.color as ColorKey)) return false
      if (onlyAffordable) {
        const canAfford = Object.entries(card.cost).every(([color, cost]) => (hand[color as ColorKey] ?? 0) >= cost)
        if (!canAfford) return false
      }
      return true
    })
  }, [cards, requires, vpFilter, tierFilter, cardColorFilter, onlyAffordable, hand])

  const counts = useMemo(() => {
    const perLevel = filteredCards.reduce<Record<number, number>>((acc, card) => {
      acc[card.level] = (acc[card.level] ?? 0) + 1
      return acc
    }, {})
    return perLevel
  }, [filteredCards])

  return (
    <div className="app-layout">
      <Sidebar bank={bank} hand={hand} onIncrement={takeBankGem} onDecrement={returnHandGem} onClear={clearHand} />
      <div className="page">
        <header className="hero">
        <div>
          <h1>Splendor explorer</h1>
        </div>
        <div className="pill">
          {cards.length ? (
            <span>
              <strong>{filteredCards.length}</strong> of {cards.length} cards · T1:{counts[1] ?? 0} · T2:{counts[2] ?? 0} · T3:{counts[3] ?? 0}
            </span>
          ) : (
            <span>Loading card data…</span>
          )}
        </div>
      </header>

      <section className="filters" aria-label="Card filters">
        <div className="filter-group">
          <div className="filter-label">Cost</div>
          <div className="chips">
            {allColors.map((color) => {
              const active = requires.has(color)
              return (
                <button
                  key={color}
                  type="button"
                  className={`chip ${active ? 'chip--active' : ''}`}
                  onClick={() => toggleRequire(color)}
                >
                  <span className="chip__dot" data-color={color} />
                  <span className="chip__label">{color}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="filter-group">
          <div className="filter-label">Token</div>
          <div className="chips">
            {allColors.map((color) => {
              const active = cardColorFilter.has(color)
              return (
                <button
                  key={color}
                  type="button"
                  className={`chip ${active ? 'chip--active' : ''}`}
                  onClick={() => toggleCardColor(color)}
                >
                  <span className="chip__dot" data-color={color} />
                  <span className="chip__label">{color}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="filter-group">
          <div className="filter-label">VP</div>
          <div className="chips">
            {allVP.map((vp) => {
              const active = vpFilter.has(vp)
              return (
                <button
                  key={vp}
                  type="button"
                  className={`chip ${active ? 'chip--active' : ''}`}
                  onClick={() => toggleVP(vp)}
                >
                  <span className="chip__label">{vp}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="filter-group">
          <div className="filter-label">Tier</div>
          <div className="chips">
            {[1, 2, 3].map((tier) => {
              const active = tierFilter.has(tier)
              return (
                <button
                  key={tier}
                  type="button"
                  className={`chip ${active ? 'chip--active' : ''}`}
                  onClick={() => toggleTier(tier)}
                >
                  <span className="chip__label">{tier}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="filter-group filter-group--toggle">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={onlyAffordable}
              onChange={(e) => setOnlyAffordable(e.target.checked)}
            />
            <span>Only affordable</span>
          </label>
        </div>
      </section>

      {status === 'error' && <div className="notice">Could not load cards. Check cards.json.</div>}

      {status === 'loading' && <div className="notice">Loading cards…</div>}

      <section className="grid" aria-live="polite">
        {filteredCards.map((card) => (
          <CardView key={`${card.level}-${card.color}-${card.points}-${JSON.stringify(card.cost)}`} card={card} hand={hand} />
        ))}
      </section>
      </div>
    </div>
  )
}

export default App

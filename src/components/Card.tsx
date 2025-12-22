export type CardCost = {
  black: number
  blue: number
  green: number
  red: number
  white: number
}

export type Card = {
  level: number
  color: string
  points: number
  cost: CardCost
}

type Hand = Record<string, number>

const colorAccent: Record<string, string> = {
  black: '#0f172a',
  blue: '#2563eb',
  green: '#16a34a',
  red: '#dc2626',
  white: '#e2e8f0',
}

type Props = {
  card: Card
  hand?: Hand
}

function canAfford(card: Card, hand: Hand): boolean {
  return Object.entries(card.cost).every(([color, cost]) => (hand[color] ?? 0) >= cost)
}

export function CardView({ card, hand }: Props) {
  const accent = colorAccent[card.color] ?? '#4338ca'
  const accentSoft = `${accent}33` // ~20% opacity
  const accentBorder = accent // full color for a clearer outline
  const affordable = hand ? canAfford(card, hand) : false

  return (
    <article
      className={`card ${affordable ? 'card--affordable' : ''}`}
      style={{
        ['--accent' as string]: accent,
        ['--accent-soft' as string]: accentSoft,
        ['--accent-border' as string]: accentBorder,
      }}
    >
      <header className="card__header">
        <div className="card__level">Tier <span className="num">{card.level}</span></div>
        <div className="card__color">{card.color}</div>
        <div className="card__points"><span className="num">{card.points}</span> VP</div>
      </header>
      <div className="card__costs">
        {Object.entries(card.cost).map(([color, value]) => (
          <div key={color} className={`card__cost ${value === 0 ? 'card__cost--zero' : ''}`}>
            <span className="card__cost-dot" data-color={color} />
            <span className="card__cost-value num">{value}</span>
          </div>
        ))}
      </div>
    </article>
  )
}

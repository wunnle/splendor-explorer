import type { ColorKey } from '../App'
import './Sidebar.css'

type Props = {
  bank: Record<ColorKey, number>
  hand: Record<ColorKey, number>
  onIncrement: (color: ColorKey) => void
  onDecrement: (color: ColorKey) => void
  onClear: () => void
}

const colors: ColorKey[] = ['black', 'blue', 'green', 'red', 'white']

export function Sidebar({ bank, hand, onIncrement, onDecrement, onClear }: Props) {
  const totalInHand = Object.values(hand).reduce((sum, count) => sum + count, 0)

  return (
    <aside className="sidebar">
      <Hand
        hand={hand}
        bank={bank}
        totalInHand={totalInHand}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
        onClear={onClear}
      />
    </aside>
  )
}

type HandProps = {
  hand: Record<ColorKey, number>
  bank: Record<ColorKey, number>
  totalInHand: number
  onIncrement: (color: ColorKey) => void
  onDecrement: (color: ColorKey) => void
  onClear: () => void
}

function Hand({ hand, bank, totalInHand, onIncrement, onDecrement, onClear }: HandProps) {
  return (
    <section className="hand">
      <div className="hand__header">
        <h2 className="sidebar__title">Hand ({totalInHand})</h2>
        <button type="button" className="clear-btn" onClick={onClear} disabled={totalInHand === 0}>
          Clear
        </button>
      </div>
      <div className="hand-list">
        {colors.map((color) => {
          const count = hand[color]
          const available = bank[color]
          return (
            <div key={color} className="hand-row" data-color={color}>
              <div className="hand-row__controls">
                <button
                  type="button"
                  className="arrow-btn"
                  onClick={() => onIncrement(color)}
                  disabled={available === 0}
                  title={`Take ${color} gem`}
                >
                  ▲
                </button>
                <span className="gem-dot gem-dot--with-count" data-color={color}>
                  {count}
                </span>
                <button
                  type="button"
                  className="arrow-btn"
                  onClick={() => onDecrement(color)}
                  disabled={count === 0}
                  title={`Return ${color} gem`}
                >
                  ▼
                </button>
              </div>
              <div className="hand-row__count" aria-hidden>
                {count}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

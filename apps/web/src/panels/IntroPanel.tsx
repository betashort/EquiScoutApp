import { panel } from '../ui/classes'

const DEFAULT_INTRO =
  '一口馬主の候補検討向けに、調教師・牧場・血統などを調べます'

type IntroPanelProps = {
  text?: string
}

export function IntroPanel({ text = DEFAULT_INTRO }: IntroPanelProps) {
  return (
    <section className={panel} aria-label="案内">
      <p className="m-0 text-[0.9375rem] text-eq-muted">{text}</p>
    </section>
  )
}

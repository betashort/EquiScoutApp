import { sectionHeader } from '../ui/classes'

type SectionHeaderProps = {
  title: string
}

export function SectionHeader({ title }: SectionHeaderProps) {
  return <h2 className={sectionHeader}>{title}</h2>
}

import type { ChangeEvent } from 'react'
import { FormField } from '../components/FormField'
import { SectionHeader } from '../components/SectionHeader'
import type { ConnectionViewModel } from '../domain/mocks'
import { formGrid2, input, label, panel, panelBody } from '../ui/classes'

export type ConnectionPanelProps = {
  values: ConnectionViewModel
  onChange?: (field: keyof ConnectionViewModel, value: string) => void
}

export function ConnectionPanel({ values, onChange }: ConnectionPanelProps) {
  const bind = (field: keyof ConnectionViewModel) => ({
    value: values[field],
    onChange: (event: ChangeEvent<HTMLInputElement>) =>
      onChange?.(field, event.target.value),
  })

  return (
    <section className={panel} aria-label="接続設定">
      <SectionHeader title="PostgreSQL 接続" />
      <div className={panelBody}>
        <div className={formGrid2}>
          <FormField label="ホスト" htmlFor="pg-host">
            <input id="pg-host" className={input} {...bind('host')} />
          </FormField>
          <FormField label="ポート" htmlFor="pg-port">
            <input id="pg-port" className={input} {...bind('port')} />
          </FormField>
          <FormField label="データベース" htmlFor="pg-db">
            <input id="pg-db" className={input} {...bind('database')} />
          </FormField>
          <FormField label="ユーザー" htmlFor="pg-user">
            <input id="pg-user" className={input} {...bind('user')} />
          </FormField>
          <FormField label="パスワード" htmlFor="pg-pass">
            <input
              id="pg-pass"
              className={input}
              type="password"
              {...bind('password')}
            />
          </FormField>
        </div>
        <div>
          <p className={label}>SQLite パス（読取）</p>
          <p className="m-0 text-sm break-all text-eq-muted">{values.sqlitePath}</p>
        </div>
      </div>
    </section>
  )
}

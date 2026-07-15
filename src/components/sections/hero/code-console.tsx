import * as React from 'react'

// Decorative mock editor for the Command hero. Fixed dark styling by design.
const C = {
  ln: '#3a3a44',
  kw: '#c792ea',
  id: '#82aaff',
  str: '#ff9d7a',
  prop: '#7fd1b9',
  num: '#f7c86b',
  punc: '#8b8b98',
} as const

const treeFiles = [
  { name: 'src/', indent: 0, active: false },
  { name: 'App.tsx', indent: 1, active: true },
  { name: 'Box.tsx', indent: 1, active: false },
  { name: 'Grid.tsx', indent: 1, active: false },
  { name: 'lib/', indent: 0, active: false },
  { name: 'api.ts', indent: 1, active: false },
]

// One colored code token.
function Tok({ c, children }: { c: string; children: React.ReactNode }) {
  return <span style={{ color: c }}>{children}</span>
}

// One code line with a dim line number.
function Line({ n, children }: { n: number; children?: React.ReactNode }) {
  return (
    <div className="whitespace-pre">
      <Tok c={C.ln}>{String(n).padEnd(3, ' ')}</Tok>
      {children}
    </div>
  )
}

export function CodeConsole() {
  return (
    <div
      className="overflow-hidden rounded-[14px] border border-white/10 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.7)]"
      style={{ background: '#0c0c11' }}
      aria-hidden
    >
      {/* window chrome */}
      <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-3">
        <span className="h-[11px] w-[11px] rounded-full" style={{ background: '#ff5f57' }} />
        <span className="h-[11px] w-[11px] rounded-full" style={{ background: '#febc2e' }} />
        <span className="h-[11px] w-[11px] rounded-full" style={{ background: '#28c840' }} />
        <span className="ml-2.5 font-mono text-xs text-[#6b6b78]">codebox — App.tsx</span>
        <span className="ml-auto rounded-full bg-[#003c33]/55 px-2.5 py-[3px] font-mono text-[11px] text-[#7fd1b9]">
          ● build passing
        </span>
      </div>

      <div className="grid grid-cols-[110px_1fr]">
        {/* file tree */}
        <div className="flex flex-col gap-[11px] border-r border-white/[0.06] px-3 py-4">
          {treeFiles.map((f) => (
            <span
              key={f.name}
              className="font-mono text-[11px]"
              style={{ color: f.active ? C.prop : '#5a5a66', paddingLeft: f.indent ? 10 : 0 }}
            >
              {f.name}
            </span>
          ))}
        </div>

        {/* code */}
        <pre className="overflow-x-auto px-4 py-4 font-mono text-[12.5px] leading-[1.95]">
          <code>
            <Line n={1}>
              <Tok c={C.kw}>import</Tok>
              <Tok c={C.punc}> {'{ '}</Tok>
              <Tok c={C.id}>Box, Grid</Tok>
              <Tok c={C.punc}>{' }'} </Tok>
              <Tok c={C.kw}>from</Tok>
              <Tok c={C.str}> &apos;@codebox/ui&apos;</Tok>
            </Line>
            <Line n={2} />
            <Line n={3}>
              <Tok c={C.kw}>export function</Tok>
              <Tok c={C.id}> App</Tok>
              <Tok c={C.punc}>() {'{'}</Tok>
            </Line>
            <Line n={4}>
              <Tok c={C.punc}>{'  return ('}</Tok>
            </Line>
            <Line n={5}>
              <Tok c={C.punc}>{'    <'}</Tok>
              <Tok c={C.id}>Box</Tok>
              <Tok c={C.prop}> modular scalable</Tok>
              <Tok c={C.punc}>{'>'}</Tok>
            </Line>
            <Line n={6}>
              <Tok c={C.punc}>{'      <'}</Tok>
              <Tok c={C.id}>Grid</Tok>
              <Tok c={C.prop}> cols</Tok>
              <Tok c={C.punc}>=&#123;</Tok>
              <Tok c={C.num}>3</Tok>
              <Tok c={C.punc}>&#125; </Tok>
              <Tok c={C.prop}>gap</Tok>
              <Tok c={C.punc}>=</Tok>
              <Tok c={C.str}>&quot;lg&quot;</Tok>
              <Tok c={C.punc}> /{'>'}</Tok>
            </Line>
            <Line n={7}>
              <Tok c={C.punc}>{'    </'}</Tok>
              <Tok c={C.id}>Box</Tok>
              <Tok c={C.punc}>{'>'}</Tok>
            </Line>
            <Line n={8}>
              <Tok c={C.punc}>{'  )'}</Tok>
            </Line>
            <Line n={9}>
              <Tok c={C.punc}>{'}'}</Tok>
            </Line>
          </code>
        </pre>
      </div>

      {/* footer badges */}
      <div className="flex items-center gap-2 border-t border-white/[0.07] px-4 py-3">
        {['main', 'TypeScript', 'modular'].map((b) => (
          <span
            key={b}
            className="rounded-[5px] bg-white/[0.06] px-2.5 py-1 font-mono text-[10px] text-[#8b8b98]"
          >
            {b}
          </span>
        ))}
        <span className="ml-auto h-[22px] w-[22px] rounded-[5px] bg-white/[0.07]" />
        <span className="h-[22px] w-[22px] rounded-[5px] bg-white/[0.07]" />
      </div>
    </div>
  )
}

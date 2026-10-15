import type { ReactNode } from "react"

function renderInline(text: string): ReactNode[] {
  const segments = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g)

  return segments.filter(Boolean).map((segment, index) => {

    if (segment.startsWith("**") && segment.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-foreground">
          {segment.slice(2, -2)}
        </strong>
      )
    }

    if (segment.startsWith("*") && segment.endsWith("*")) {
      return <em key={index}>{segment.slice(1, -1)}</em>
    }

    const linkMatch = segment.match(/^\[([^\]]+)\]\(([^\)]+)\)$/)
    if (linkMatch) {
      return (
        <a
          key={index}
          href={linkMatch[2]}
          className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-muted-foreground"
        >
          {linkMatch[1]}
        </a>
      )
    }

    return <span key={index}>{segment}</span>
  })
}

export function ArticleRichText({ markdown }: { markdown: string }) {
  const lines = markdown.split("\n")
  const blocks: ReactNode[] = []
  let paragraph: string[] = []
  let listItems: string[] = []
  let quoteLines: string[] = []

  const flushParagraph = () => {
    if (!paragraph.length) return
    blocks.push(
      <p key={`p-${blocks.length}`} className="type-body text-muted-foreground">
        {paragraph.map((line, index) => (
          <span key={index}>
            {index > 0 ? <br /> : null}
            {renderInline(line)}
          </span>
        ))}
      </p>
    )
    paragraph = []
  }

  const flushList = () => {
    if (!listItems.length) return
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="space-y-3">
        {listItems.map((item, index) => (
          <li key={index} className="type-body flex items-start gap-3 text-muted-foreground">
            <span aria-hidden="true" className="mt-3 size-1 shrink-0 rotate-45 bg-primary" />
            <span>{renderInline(item)}</span>
          </li>
        ))}
      </ul>
    )
    listItems = []
  }

  const flushQuote = () => {
    if (!quoteLines.length) return
    blocks.push(
      <blockquote
        key={`q-${blocks.length}`}
        className="border-l border-border pl-5 italic text-muted-foreground"
      >
        <p className="type-body">
          {quoteLines.map((line, index) => (
            <span key={index}>
              {index > 0 ? <br /> : null}
              {renderInline(line)}
            </span>
          ))}
        </p>
      </blockquote>
    )
    quoteLines = []
  }

  const flushAll = () => {
    flushParagraph()
    flushList()
    flushQuote()
  }

  for (const line of lines) {
    const trimmed = line.trim()

    if (!trimmed) {
      flushAll()
      continue
    }

    if (trimmed === "---") {
      flushAll()
      blocks.push(
        <hr key={`hr-${blocks.length}`} className="border-0 border-t border-dashed border-border" />
      )
      continue
    }

    if (trimmed.startsWith("# ")) {
      flushAll()
      blocks.push(
        <h1
          key={`h1-${blocks.length}`}
          className="max-w-3xl text-[clamp(1.75rem,4vw,2.75rem)] font-[560] leading-[1.12] tracking-[-0.032em] text-foreground"
        >
          {trimmed.slice(2)}
        </h1>
      )
      continue
    }

    if (trimmed.startsWith("## ")) {
      flushAll()
      blocks.push(
        <h2 key={`h2-${blocks.length}`} className="type-section pt-4 text-foreground">
          {trimmed.slice(3)}
        </h2>
      )
      continue
    }

    if (trimmed.startsWith("### ")) {
      flushAll()
      blocks.push(
        <h3 key={`h3-${blocks.length}`} className="type-title pt-3 text-foreground sm:text-[1.35rem]">
          {trimmed.slice(4)}
        </h3>
      )
      continue
    }

    if (trimmed.startsWith("- ")) {
      flushQuote()
      flushParagraph()
      listItems.push(trimmed.slice(2))
      continue
    }

    if (trimmed.startsWith("> ")) {
      flushList()
      flushParagraph()
      quoteLines.push(trimmed.slice(2))
      continue
    }

    flushList()
    flushQuote()
    paragraph.push(line)
  }

  flushAll()

  return <div className="space-y-7">{blocks}</div>
}

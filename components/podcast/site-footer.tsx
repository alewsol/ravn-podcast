import Image from "next/image"
import Link from "next/link"

const columns = [
  {
    title: "Flagship podcast",
    links: [{ href: "/atoms", label: "ATOMS" }],
  },
  {
    title: "Editorial",
    links: [
      { href: "/#editorial", label: "Founder Files" },
      { href: "/#companies", label: "Worth Watching" },
      { href: "/#opinions", label: "Hot Takes" },
    ],
  },
  {
    title: "Stay close",
    links: [{ href: "/#newsletter", label: "Newsletter" }],
  },
] as const

export function PodcastSiteFooter() {
  return (
    <footer className="site-container editorial-footer">
      <div className="editorial-footer-main">
        <div className="editorial-footer-intro">
          <Link href="/" className="editorial-brand" aria-label="Budera home">
            <Image src="/logo.svg" alt="" width={32} height={32} className="ink-logo" />
            <span>Budera</span>
          </Link>
          <p className="editorial-body">
            The media for people building the future before it’s obvious.
          </p>
        </div>
        <nav aria-label="Footer" className="editorial-footer-nav">
          {columns.map((column) => (
            <div key={column.title}>
              <p className="editorial-eyebrow">{column.title}</p>
              <ul>
                {column.links.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="editorial-nav-link">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="editorial-footer-bottom">
        <p>© {new Date().getFullYear()} Budera. All rights reserved.</p>
        <p>ATOMS — The people building the physical future.</p>
      </div>
      <div aria-hidden="true" className="editorial-footer-wordmark">BUDERA</div>
    </footer>
  )
}

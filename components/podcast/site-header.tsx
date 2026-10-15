"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ListIcon } from "@phosphor-icons/react/dist/ssr/List"
import { XIcon } from "@phosphor-icons/react/dist/ssr/X"

import { useActiveSection } from "@/hooks/use-active-section"
import { cn } from "@/lib/utils"

import { navItems, sectionIds } from "./data"

export function PodcastSiteHeader() {
  const [open, setOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const active = useActiveSection(sectionIds)

  useEffect(() => {
    if (!open) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    const onPointer = (event: PointerEvent) => {
      const target = event.target
      if (target instanceof Node && !headerRef.current?.contains(target)) {
        setOpen(false)
      }
    }

    window.addEventListener("keydown", onKey)
    window.addEventListener("pointerdown", onPointer)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("pointerdown", onPointer)
    }
  }, [open])

  return (
    <header ref={headerRef} className="editorial-header">
      <div className="site-container editorial-header-bar">
        <Link href="/" className="editorial-brand" aria-label="Budera home">
          <Image src="/logo.svg" alt="" width={32} height={32} className="ink-logo" />
          <span>Budera</span>
        </Link>
        <nav aria-label="Primary" className="editorial-desktop-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active === item.id ? "location" : undefined}
              className={cn("editorial-nav-link", active === item.id && "is-active")}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="editorial-header-actions">
          <Link href="/#newsletter" className="ink-button ink-button-solid header-subscribe">
            Subscribe
          </Link>
          <button
            type="button"
            className="editorial-menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <XIcon size={21} /> : <ListIcon size={21} />}
          </button>
        </div>
        {open ? (
          <nav id="mobile-nav" aria-label="Mobile" className="editorial-mobile-nav ink-panel">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active === item.id ? "location" : undefined}
                className={cn("editorial-nav-link", active === item.id && "is-active")}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/#newsletter" onClick={() => setOpen(false)} className="editorial-nav-link">
              Subscribe
            </Link>
          </nav>
        ) : null}
      </div>
    </header>
  )
}

import Link from "next/link"

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-5 text-center sm:px-6">
      <p className="type-meta text-muted-foreground">Budera</p>
      <h1 className="type-hero mt-4 text-foreground">That article doesn’t exist.</h1>
      <p className="type-body mt-4 text-muted-foreground">
        The link may be old, or the article may not have been published yet.
      </p>
      <Link
        href="/"
        className="type-meta mt-8 inline-flex h-10 items-center justify-center rounded-full bg-primary px-4 font-medium text-primary-foreground transition-transform duration-300 hover:scale-[1.02]"
      >
        Back to homepage
      </Link>
    </div>
  )
}

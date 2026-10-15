import { chromium } from "playwright"

const browser = await chromium.launch({
  executablePath:
    process.env.USERPROFILE +
    "\\AppData\\Local\\ms-playwright\\chromium-1208\\chrome-win64\\chrome.exe",
})
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } })

await page.goto("http://localhost:3000/", { waitUntil: "networkidle" })
await page.waitForTimeout(1500)

const info = await page.evaluate(() => {
  const shaderDivs = Array.from(document.querySelectorAll("[data-paper-shader]")).filter(
    (el) => el.tagName !== "STYLE"
  )
  return shaderDivs.map((el) => {
    const mount = el.paperShaderMount
    const u = mount ? mount.providedUniforms : {}
    const plain = {}
    for (const [k, v] of Object.entries(u)) {
      plain[k] = v instanceof HTMLImageElement ? `IMG(${v.src.split("/").pop()},${v.naturalWidth}x${v.naturalHeight},complete=${v.complete})` : v
    }
    return {
      inHosts: !!el.closest("#podcast"),
      canvasSize: mount ? [mount.canvasElement.width, mount.canvasElement.height] : null,
      parentWidth: mount?.parentWidth,
      parentHeight: mount?.parentHeight,
      renderScale: mount?.renderScale,
      uniforms: plain,
    }
  })
})
console.log(JSON.stringify(info, null, 2))

await browser.close()

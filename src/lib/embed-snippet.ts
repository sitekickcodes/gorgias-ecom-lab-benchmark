const EMBED_ORIGIN = "https://gorgias.sitekick.co"

const AUTO_HEIGHT_SCRIPT = `<script type="text/javascript">window.addEventListener("message",function(a){if(void 0!==a.data["gorgias-embed-height"]){var e=document.querySelectorAll("iframe");for(var t in a.data["gorgias-embed-height"])for(var r,i=0;r=e[i];i++)if(r.contentWindow===a.source){var d=a.data["gorgias-embed-height"][t]+"px";r.style.height=d}}});</script>`

/**
 * Builds an iframe embed snippet in the Datawrapper/Ramp style:
 * - short URL pointing to a server-stored chart
 * - self-resizing via postMessage (no fixed-height lock-in)
 * - `width: 0; min-width: 100%` trick for robust width behavior in email/CMS
 */
export function buildIframeSnippet(opts: {
  path: string
  id: string
  title: string
  initialHeight: number
  ariaLabel?: string
}): string {
  const src = `${EMBED_ORIGIN}${opts.path}`
  const title = opts.title.replace(/"/g, "&quot;")
  const aria = (opts.ariaLabel ?? opts.title).replace(/"/g, "&quot;")
  const iframe = `<iframe title="${title}" aria-label="${aria}" id="gorgias-chart-${opts.id}" src="${src}" scrolling="no" frameborder="0" style="width: 0; min-width: 100% !important; border: none;" height="${opts.initialHeight}"></iframe>`
  return `${iframe}${AUTO_HEIGHT_SCRIPT}`
}

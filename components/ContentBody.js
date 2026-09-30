// Deliberately renders text through React: pasted HTML never executes.
//
// Beyond paragraphs, lists and headings, an editor can place media by typing
// it on its own line in the admin — no HTML, so nothing can smuggle a script:
//
//   ![Alt text](https://…/photo.webp)                 one photograph
//   ![Alt text](https://…/photo.webp "Caption")       …with a caption
//   two or more image lines together                  a photo gallery
//   ![Logo: Asia Book of Records](https://…/logo.webp) a logo, shown whole
//   https://www.youtube.com/watch?v=VIDEO_ID           an embedded video

const IMAGE = /^!\[([^\]]*)\]\((\S+?)(?:\s+"([^"]*)")?\)$/;
const YOUTUBE = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})(?:[?&#]\S*)?$/;

// Only web addresses and site paths — never javascript:, data: or the like.
const safeSrc = (src) => /^(https?:\/\/|\/)[^\s]*$/i.test(src);

function parseImage(line) {
  const m = line.trim().match(IMAGE);
  if (!m || !safeSrc(m[2])) return null;
  const logo = /^logo:\s*/i.test(m[1]);
  return { alt: m[1].replace(/^logo:\s*/i, ''), src: m[2], caption: m[3] || '', logo };
}

function Media({ images }) {
  if (images.every((img) => img.logo)) {
    return (
      <div className="cb-logos">
        {images.map((img, i) => <img key={i} src={img.src} alt={img.alt} loading="lazy" decoding="async" />)}
      </div>
    );
  }
  if (images.length === 1) {
    const [img] = images;
    return (
      <figure className="cb-figure">
        <img src={img.src} alt={img.alt} loading="lazy" decoding="async" />
        {img.caption && <figcaption>{img.caption}</figcaption>}
      </figure>
    );
  }
  return (
    <div className={`cb-gallery cb-gallery-${Math.min(images.length, 3)}`}>
      {images.map((img, i) => (
        <figure key={i} className="cb-figure">
          <img src={img.src} alt={img.alt} loading="lazy" decoding="async" />
          {img.caption && <figcaption>{img.caption}</figcaption>}
        </figure>
      ))}
    </div>
  );
}

// [Link text](/path) — a link inside a paragraph or list item. Only site
// paths and https addresses become links; anything else stays as text.
const LINK = /\[([^\]\n]+)\]\((\/(?!\/)[^\s)]*|https:\/\/[^\s)]+)\)/g;

function inline(text) {
  const parts = [];
  let last = 0;
  for (const m of String(text).matchAll(LINK)) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const external = m[2].startsWith('https://');
    parts.push(
      <a key={m.index} href={m[2]} {...(external ? { target: '_blank', rel: 'noopener' } : {})}>{m[1]}</a>
    );
    last = m.index + m[0].length;
  }
  if (!parts.length) return text;
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export default function ContentBody({ text = '' }) {
  return <div className="editorial-body">{String(text).split(/\n\s*\n/).filter(Boolean).map((block, i) => {
    const lines = block.split('\n').filter((l) => l.trim());
    const images = lines.map(parseImage);
    if (images.every(Boolean)) return <Media key={i} images={images} />;
    const video = lines.length === 1 && lines[0].trim().match(YOUTUBE);
    if (video) {
      return (
        <div key={i} className="cb-video">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video[1]}`}
            title="Video"
            loading="lazy"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }
    if (lines.every((line) => /^[-*•]\s+/.test(line))) {
      return <ul key={i} className={lines.length >= 10 ? 'cb-cols' : undefined}>{lines.map((line, j) => <li key={j}>{inline(line.replace(/^[-*•]\s+/, ''))}</li>)}</ul>;
    }
    if (/^###\s/.test(block)) return <h3 key={i}>{block.replace(/^###\s+/, '')}</h3>;
    if (/^##\s/.test(block)) return <h2 key={i}>{block.replace(/^##\s+/, '')}</h2>;
    if (block.length < 85 && /^[A-Z][A-Z &(),/’'–:-]+$/.test(block)) return <h2 key={i}>{block}</h2>;
    // A paragraph that is nothing but a link reads as a call to action.
    const only = block.trim().match(new RegExp(`^${LINK.source}$`));
    if (only) return <p key={i} className="cb-cta"><a className="view-all" href={only[2]}>{only[1]}</a></p>;
    return <p key={i}>{inline(block)}</p>;
  })}</div>;
}

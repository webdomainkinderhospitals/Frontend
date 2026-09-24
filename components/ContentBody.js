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
      return <ul key={i}>{lines.map((line, j) => <li key={j}>{line.replace(/^[-*•]\s+/, '')}</li>)}</ul>;
    }
    if (/^###\s/.test(block)) return <h3 key={i}>{block.replace(/^###\s+/, '')}</h3>;
    if (/^##\s/.test(block)) return <h2 key={i}>{block.replace(/^##\s+/, '')}</h2>;
    if (block.length < 85 && /^[A-Z][A-Z &(),/’'–:-]+$/.test(block)) return <h2 key={i}>{block}</h2>;
    return <p key={i}>{block}</p>;
  })}</div>;
}

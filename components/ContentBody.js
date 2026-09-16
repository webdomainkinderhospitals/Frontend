// Deliberately renders text through React: pasted HTML never executes.
export default function ContentBody({ text = '' }) {
  return <div className="editorial-body">{String(text).split(/\n\s*\n/).filter(Boolean).map((block, i) => {
    const lines = block.split('\n');
    if (lines.every((line) => /^[-*•]\s+/.test(line))) {
      return <ul key={i}>{lines.map((line, j) => <li key={j}>{line.replace(/^[-*•]\s+/, '')}</li>)}</ul>;
    }
    if (/^##\s/.test(block)) return <h2 key={i}>{block.replace(/^##\s+/, '')}</h2>;
    if (block.length < 85 && /^[A-Z][A-Z &(),/’'–:-]+$/.test(block)) return <h2 key={i}>{block}</h2>;
    return <p key={i}>{block}</p>;
  })}</div>;
}

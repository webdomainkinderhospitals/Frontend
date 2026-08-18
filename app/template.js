// Re-mounts on every navigation so each page opens with a soft fade-up.
export default function Template({ children }) {
  return <div className="page-enter">{children}</div>;
}

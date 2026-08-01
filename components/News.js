function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function News({ news = [] }) {
  return (
    <section id="news" style={{ background: 'var(--bg-soft)' }}>
      <div className="container">
        <div className="section-head">
          <div>
            <span className="section-eyebrow">News &amp; Insights</span>
            <h2 className="section-title">
              News, events <em>&amp; health insights</em>
            </h2>
            <p className="section-intro">
              Trustworthy health and medical information from our doctors, researchers, and
              clinical teams at Kinder Hospital.
            </p>
          </div>
          <a href="https://api.whatsapp.com/send?phone=919446654500&text=Hello%20Kinder%20Hospitals%2C%20I%20would%20like%20to%20know%20more%20about%20your%20services." target="_blank" rel="noopener" className="view-all">View All →</a>
        </div>
        <div className="blog-grid">
          {news.map((item, i) => (
            <div className="blog-card" key={item.id ?? i}>
              <div
                className="blog-img"
                style={{
                  backgroundImage: item.imageUrl
                    ? `url('${item.imageUrl}'), var(--mesh-card)`
                    : 'var(--mesh-card)',
                }}
              ></div>
              {item.category ? <span className="blog-tag">{item.category}</span> : null}
              <h3>{item.title}</h3>
              <div className="blog-meta">
                {[item.author, formatDate(item.publishedAt)].filter(Boolean).join(' · ')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

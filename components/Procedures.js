import { procedureIcon } from './icons';

export default function Procedures({ procedures = [] }) {
  return (
    <section className="procedures" id="packages">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="section-eyebrow">Key Procedures</span>
            <h2 className="section-title">
              Signature procedures, <em>kinder outcomes</em>
            </h2>
            <p className="section-intro">
              Procedures where Kinder Hospitals has built deep clinical expertise — backed by ART
              certification, Level III NICU, and modular operation theatres.
            </p>
          </div>
          <a href="https://api.whatsapp.com/send?phone=919446654500&text=Hello%20Kinder%20Hospitals%2C%20I%20would%20like%20to%20know%20more%20about%20your%20services." target="_blank" rel="noopener" className="view-all">View All Procedures →</a>
        </div>
        <div className="procedure-grid">
          {procedures.map((proc, i) => (
            <div className="procedure-card" key={proc.id ?? i}>
              <div className="procedure-icon">{procedureIcon(proc.icon, i)}</div>
              <h3>{proc.name}</h3>
              <p>{proc.description}</p>
              <a href="https://api.whatsapp.com/send?phone=919446654500&text=Hello%20Kinder%20Hospitals%2C%20I%20would%20like%20to%20know%20more%20about%20your%20services." target="_blank" rel="noopener">Know More →</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

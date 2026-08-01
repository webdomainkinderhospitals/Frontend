import { specIcon } from './icons';

export default function Specialities({ specialities = [] }) {
  return (
    <section>
      <div className="container">
        <div className="section-head">
          <div>
            <span className="section-eyebrow">Departments</span>
            <h2 className="section-title">
              25+ specialities, <em>under one roof</em>
            </h2>
            <p className="section-intro">
              From maternity and IVF to paediatrics and women&apos;s wellness — comprehensive care
              designed around your family&apos;s every stage.
            </p>
          </div>
          <a href="#" className="view-all">View All Departments →</a>
        </div>
        <div className="spec-grid">
          {specialities.map((spec, i) => (
            <div className="spec-card" key={spec.id ?? i} title={spec.description || undefined}>
              <div className="spec-icon">{specIcon(spec.icon, i)}</div>
              <h4>{spec.name}</h4>
              <span className="spec-arrow">→</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { specialityIconUrl } from '@/lib/speciality-icons.mjs';

// The hospital's own speciality icon (see lib/speciality-icons.mjs), drawn as
// a CSS mask filled with currentColor inside a brand tile.
export default function SpecialityIcon({ name, icon, className = 'spec-glyph' }) {
  return (
    <span className={`${className} spec-3d`} aria-hidden="true">
      <span className="spec-ico" style={{ '--ico': `url(${specialityIconUrl(name, icon)})` }} />
    </span>
  );
}

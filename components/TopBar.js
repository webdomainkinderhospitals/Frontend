export default function TopBar({ settings, locations = [] }) {
  const cities = locations.length
    ? locations.map((l) => l.name).join(' · ')
    : 'Cherthala · Kochi · Bengaluru · Alappuzha · Singapore';

  return (
    <div className="top-bar">
      <div className="container">
        <div className="top-bar-left">
          <a href={`mailto:${settings.email}`}>✉ {settings.email}</a>
          <a href={`tel:${(settings.emergencyPhone || '').replace(/\s/g, '')}`}>
            🚑 24/7 Emergency: {settings.emergencyPhone}
          </a>
        </div>
        <div className="top-bar-right">
          {settings.announcement ? (
            <span className="loc-pill">{settings.announcement}</span>
          ) : (
            <span className="loc-pill">📍 {cities}</span>
          )}
          <a href="#">Careers</a>
          <a href="#">Patient Portal</a>
          <a href="#">🔍 Search</a>
        </div>
      </div>
    </div>
  );
}

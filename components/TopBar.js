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
          <a href={`mailto:${settings.email}?subject=Careers%20at%20Kinder`}>Careers</a>
          <a href="https://api.whatsapp.com/send?phone=919446654500&text=Hello%20Kinder%20Hospitals%2C%20I%20would%20like%20to%20book%20an%20appointment." target="_blank" rel="noopener">Patient Portal</a>
          <a href="/#specialities">🔍 Search</a>
        </div>
      </div>
    </div>
  );
}

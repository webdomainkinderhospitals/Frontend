import UiIcon from '@/components/UiIcon';

export default function TopBar({ settings, locations = [] }) {
  const cities = locations.length
    ? locations.map((l) => l.name).join(' · ')
    : 'Cherthala · Kochi · Bengaluru · Alappuzha · Singapore';

  return (
    <div className="top-bar">
      <div className="container">
        <div className="top-bar-left">
          <a href={`mailto:${settings.email}`}>
            <UiIcon name="mail" /> {settings.email}
          </a>
          <a href={`tel:${(settings.emergencyPhone || '').replace(/\s/g, '')}`}>
            <UiIcon name="ambulance" /> 24/7 Emergency: {settings.emergencyPhone}
          </a>
        </div>
        <div className="top-bar-right">
          {settings.announcement ? (
            <span className="loc-pill">{settings.announcement}</span>
          ) : (
            <span className="loc-pill">
              <UiIcon name="pin" size={13} /> {cities}
            </span>
          )}
          <a href="/careers">Careers</a>
          <a href="/patients">Patient Portal</a>
          <a href="/find-care">
            <UiIcon name="search" /> Find Care
          </a>
        </div>
      </div>
    </div>
  );
}

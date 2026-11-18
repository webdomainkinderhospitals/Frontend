// Doctor portraits on the Kinder studio-blue backdrop, the look of the latest
// Cherthala photo shoot. Kochi has its own studio shoot on the same blue
// (Nov 2026); the Kollam portraits (shot on plain light backgrounds) have had
// their backgrounds replaced with it, so every doctor card across the site
// matches. Each doctor is matched
// at their own hospital by name; "Dr Jeevan Raj CN" and "Dr. Jeevan Raj C N"
// are the same doctor, and a photo named by first name only goes to the one
// doctor at that hospital with that first name.
const DIR = '/doctors/studio';

const CENTRES = {
  cherthala: [
    ['Dr Ananthen K S', 'ananthen-k-s'], ['Dr Ashby Joseph', 'ashby-joseph'], ['Dr Jeevan Raj CN', 'jeevan-raj-c-n'],
    ['Dr Kevin George', 'kevin-george'], ['Dr Meera Mohan', 'meera-mohan'], ['Dr Neena Ananthen', 'neena-ananthen'],
    ['Dr Rahul KH', 'rahul-k-h'], ['Dr Remya', 'remya'], ['Dr Reshmy J R', 'reshmy-j-r'],
    ['Dr Shilpa Govind', 'shilpa-govind'], ['Dr Thankachy Roy', 'thankachy-roy'], ['Dr Vijitha A S', 'vijitha-a-s'],
  ],
  kochi: [
    ['Brigadier (Dr.) A P Radhakrishnan', 'brigadier-dr-a-p-radhakrishnan'], ['Dr. Abhishek Radhakrishnan', 'dr-abhishek-radhakrishnan'],
    ['Dr. Aruna Chandra Babu', 'dr-aruna-chandra-babu'], ['Dr. Bipin Johny', 'dr-bipin-johny'], ['Dr. Boban Abraham', 'dr-boban-abraham'],
    ['Dr. Denny Paul Kuttikkat', 'dr-denny-paul-kuttikkat'], ['Dr. Madhuja Gopishyam', 'dr-madhuja-gopishyam'], ['Dr. Manoj M', 'dr-manoj-m'],
    ['Mariea George', 'mariea-george'], ['Dr. Minu George', 'dr-minu-george'], ['Dr. Mithun Mathew', 'dr-mithun-mathew'],
    ['Dr. Nasna Majeed', 'dr-nasna-majeed'], ['Dr. Nikhil V. Mathew', 'dr-nikhil-v-mathew'], ['Dr. Noorjahan P P', 'dr-noorjahan-p-p'],
    ['Dr. Praveen Kumar K S', 'dr-praveen-kumar-k-s'], ['Dr. Priyanka', 'dr-priyanka'], ['Dr. Reju Joseph Thomas', 'dr-reju-joseph-thomas'],
    ['Dr. Rekha B Nair', 'dr-rekha-b-nair'], ['Dr. Rohith Pillai', 'dr-rohith-pillai'], ['Dr. Roshna Ramachandran', 'dr-roshna-ramachandran'],
    ['Dr. Sajitha Surendran', 'dr-sajitha-surendran'], ['Dr. Saranya Rajendran', 'dr-saranya-rajendran'], ['Dr. Shine Shukoor', 'dr-shine-shukoor'],
    ['Dr. Shirley Joan Fernandez', 'dr-shirley-joan-fernandez'], ['Dr. Shivji Ramachandra Hedgon', 'dr-shivji-ramachandra-hedgon'],
    ['Dr. Sindhu Karthika Ammini', 'dr-sindhu-karthika-ammini'], ['Dr. Smitha Pratheesh', 'dr-smitha-pratheesh'],
    ['Dr. Smitha Surendran', 'dr-smitha-surendran'], ['Dr. Sooraj Menon R', 'dr-sooraj-menon-r'], ['Dr. Tehmina Asif', 'dr-tehmina-asif'],
    ['Dr. Vinay Raj', 'dr-vinay-raj'],
    // The Kochi studio shoot (Nov 2026), on the same blue as Cherthala.
    ['Dr. Afshana', 'dr-afshana'], ['Dr. Reema Poyil', 'dr-reema-poyil'], ['Dr. Akhil', 'dr-akhil'],
    ['Dr. Swetha', 'dr-swetha'], ['Dr. Mary Veena', 'dr-mary-veena'],
  ],
  kollam: [
    ['Dr. Reshmy R Pillai', 'reshmy-r-pillai'], ['Dr. Praveen Krishna K P', 'praveen-krishna-k-p'], ['Dr. Manju V K', 'manju-v-k'],
    ['Dr. Jilu Fathima Y', 'jilu-fathima-y'], ['Dr. Beegam Raheena', 'beegam-raheena'], ['Dr. Shalini Mahapatra', 'shalini-mahapatra'],
    ['Dr. Deepthi Prem', 'deepthi-prem'], ['Dr. Shoji', 'shoji'], ['Dr. Hira', 'hira'],
  ],
};

// "Brigadier (Dr.) A P Radhakrishnan" -> ["a", "p", "radhakrishnan"]
const words = (name) => String(name || '').toLowerCase()
  .replace(/brigadier|\(dr\.?\)|\bdr\b\.?/g, ' ')
  .replace(/[^a-z\s]/g, ' ').split(/\s+/).filter(Boolean);
const key = (name) => words(name).join('');
const centresOf = (doc) => String(doc.location || '').toLowerCase().replace(/\bcochin\b/g, 'kochi')
  .split(',').map((s) => s.trim()).filter(Boolean);

// How sure a photo's name is of a doctor's name, from 0 (no) to 3 (exact):
// 3 the same name ("Dr Jeevan Raj CN" / "Dr. Jeevan Raj C N"); 2 the same
// first and last name ("Kevin George" / "Kevin Antony George"); 1 one name
// within the other, or a first-name-only photo ("Remya" / "Remya R").
function closeness(photoName, doctorName) {
  const a = words(photoName), b = words(doctorName);
  if (!a.length || !b.length) return 0;
  if (a.join('') === b.join('')) return 3;
  if (a.length > 1 && b.length > 1 && a[0] === b[0] && a.at(-1) === b.at(-1)) return 2;
  const [short, long] = a.length <= b.length ? [a, b] : [b, a];
  if (short[0] === long[0] && short.every((w) => long.includes(w))) return 1;
  return 0;
}

// The photo for one doctor: the closest name at their own hospital, provided
// no other doctor there is as close; failing that, a photo of exactly the
// same full name at another Kinder hospital (a doctor who works at two).
export function studioPhotoFor(doc, doctors = [doc]) {
  const atCentre = (d, centre) => centresOf(d).some((c) => c.includes(centre));
  for (const centre of Object.keys(CENTRES)) {
    if (!atCentre(doc, centre)) continue;
    const here = doctors.filter((d) => atCentre(d, centre));
    let best = null;
    for (const [name, file] of CENTRES[centre]) {
      const score = closeness(name, doc.name);
      if (!score || (best && best.score >= score)) continue;
      // another doctor here who fits this photo as well makes it a guess
      if (here.some((d) => d !== doc && closeness(name, d.name) >= score)) continue;
      best = { score, src: `${DIR}/${centre}/${file}.webp` };
    }
    if (best) return best.src;
  }
  if (words(doc.name).length < 2) return null;
  const elsewhere = Object.entries(CENTRES).flatMap(([centre, list]) =>
    list.filter(([name]) => closeness(name, doc.name) === 3).map(([, file]) => `${DIR}/${centre}/${file}.webp`));
  return elsewhere.length === 1 ? elsewhere[0] : null;
}

// A photo chosen for the doctor in the admin (the backend notes when) is
// newer than the portraits the site carries, so it is kept as it is.
export const photoChosenInAdmin = (doc) => Boolean(doc?.photoSetAt && String(doc.imageUrl || '').trim());

export function withStudioPhotos(doctors = []) {
  return doctors.map((doc) => {
    if (photoChosenInAdmin(doc)) return doc;
    const photo = studioPhotoFor(doc, doctors);
    return photo ? { ...doc, imageUrl: photo } : doc;
  });
}

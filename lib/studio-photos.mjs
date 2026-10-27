// Doctor portraits on the Kinder studio-blue backdrop, the look of the latest
// Cherthala photo shoot. The Kochi and Kollam portraits (shot on grey and on
// plain light backgrounds) have had their backgrounds replaced with the same
// blue, so every doctor card across the site matches. Each doctor is matched
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

export function studioPhotoFor(doc, doctors = [doc]) {
  for (const centre of Object.keys(CENTRES)) {
    if (!centresOf(doc).some((c) => c.includes(centre))) continue;
    const here = doctors.filter((d) => centresOf(d).some((c) => c.includes(centre)));
    for (const [name, file] of CENTRES[centre]) {
      const exact = here.filter((d) => key(d.name) === key(name));
      const match = exact.length === 1 ? exact[0]
        : words(name).length === 1 && here.filter((d) => words(d.name)[0] === words(name)[0]).length === 1
          ? here.find((d) => words(d.name)[0] === words(name)[0]) : null;
      if (match === doc) return `${DIR}/${centre}/${file}.webp`;
    }
  }
  return null;
}

export function withStudioPhotos(doctors = []) {
  return doctors.map((doc) => {
    const photo = studioPhotoFor(doc, doctors);
    return photo ? { ...doc, imageUrl: photo } : doc;
  });
}

export function careSections(text = '') {
  return String(text).split(/\n(?=## )/).filter((s) => s.trim()).map((block, i) => {
    const heading = block.match(/^## (.+)\n?/);
    return { id: `care-section-${i}`, title: heading?.[1] || 'Overview', body: heading ? block.slice(heading[0].length).trim() : block.trim() };
  });
}
export function careFaqs(section) {
  if (!/frequently asked questions/i.test(section.title)) return [];
  return section.body.split(/(?:^|\n)### /).filter((s) => s.trim()).map((block) => {
    const [question, ...answer] = block.split('\n');
    return { question: question.trim(), answer: answer.join('\n').trim() };
  }).filter((item) => item.question && item.answer);
}

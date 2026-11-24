export const journeyChapters = [
  {
    name: 'Explore',
    title: 'Open up the possibilities.',
    copy: 'Ask questions. Try different directions. Find what is worth solving.',
  },
  {
    name: 'Organise',
    title: 'Find the connections.',
    copy: 'Group the ideas, make sense of the patterns and choose a clear direction.',
  },
  {
    name: 'Create',
    title: 'Make something useful.',
    copy: 'Turn the thinking into a product, a workflow or a better experience.',
  },
];

export function getJourneyPose(index: number, stage: number, radius: number) {
  const angle = (index * Math.PI) / 6;
  if (stage === 0) {
    return {
      x: Math.sin(index * 2.4) * radius,
      y: Math.cos(index * 2.4) * radius * 0.78,
      rotation: index * 37,
      width: 30 + (index % 3) * 8,
      height: 30 + (index % 2) * 16,
      borderRadius: index % 3 === 0 ? '50%' : '12%',
      backgroundColor: ['#f00000', '#bd8617', '#a9481e'][index % 3],
    };
  }
  if (stage === 1) {
    const group = Math.floor(index / 4);
    const slot = index % 4;
    return {
      x: (group - 1) * radius * 0.9 + ((slot % 2) - 0.5) * 30,
      y: (Math.floor(slot / 2) - 0.5) * 30 + (group === 1 ? 35 : -25),
      rotation: 0,
      width: 24,
      height: 24,
      borderRadius: '20%',
      backgroundColor: ['#f00000', '#bd8617', '#a9481e'][group],
    };
  }
  return {
    x: Math.sin(angle) * radius * 0.34,
    y: Math.cos(angle) * radius * 0.34,
    rotation: -index * 30,
    width: radius * 0.25,
    height: radius * 0.85,
    borderRadius: '50%',
    backgroundColor: '#f00000',
  };
}

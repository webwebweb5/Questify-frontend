import { _mock } from './_mock';

// ----------------------------------------------------------------------

const classroomTitle = [
  'Introduction to Computer Science',
  'Data Structures and Algorithms',
  'Computer Organization and Architecture',
  'Operating Systems',
  'Databases',
  'Software Engineering',
  'Networks',
  'Artificial Intelligence',
  'Machine Learning',
  'Human-Computer Interaction',
  'Cybersecurity',
  'Compiler Design',
];

export const JOB_EXPERIENCE_OPTIONS = [
  { value: '1st year', label: '1st year' },
  { value: '2nd year', label: '2nd year' },
  { value: '3rd year', label: '3rd year' },
  { value: '4th year', label: '4th year' },
];

export const _classroom = [...Array(12)].map((_, index) => {
  const experience =
    JOB_EXPERIENCE_OPTIONS.map((option) => option.label)[index] || JOB_EXPERIENCE_OPTIONS[1].label;

  return {
    id: _mock.id(index),
    experience,
    title: classroomTitle[index],
    description: 'This is classroom description...',
    createdAt: _mock.time(index),
  };
});

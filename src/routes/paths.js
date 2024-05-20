// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: '/',
    classroom: '/classroom',
  },
  // CLASSROOM
  classroom: {
    root: '/classroom',
    new: '/classroom/new',
    edit: (id) => `/classroom/edit/${id}`,
    details: (id) => `/classroom/${id}`,
    general: (id) => `/classroom/${id}/general`,
    assignment: (id) => `/classroom/${id}/assignment`,
    assignmentNew: (id) => `/classroom/${id}/assignment/new`,
    assignmentEdit: (cid, aid) => `/classroom/${cid}/assignment/edit/${aid}`,
    assignmentId: (cid, aid) => `/classroom/${cid}/assignment/${aid}`,
    assignmentLabEdit: (cid, aid, lid) => `/classroom/${cid}/assignment/${aid}/edit/${lid}`,
    LabNew: (cid, aid) => `/classroom/${cid}/assignment/${aid}/new`,
    file: (id) => `/classroom/${id}/file`,
    members: (id) => `/classroom/${id}/members`,
    grade: (id) => `/classroom/${id}/grade`,
  },
};

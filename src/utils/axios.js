import axios from 'axios';

import { BACKEND_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: BACKEND_API });

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken'); // Adjust this to where your token is stored
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// --------------------------Classroom-----------------------------------

export const createClassroom = async (data) => {
  const res = await axiosInstance.post(endpoints.classroom.list, data);
  return res.data;
};

export const updateClassroom = async (classroomId, data) => {
  try {
    const res = await axiosInstance.put(`/api/v1/classroom?classroomId=${classroomId}`, data);
    return res.data;
  } catch (error) {
    console.error('Update Classroom Error:', error);
    throw error;
  }
};

export const deleteClassroom = async (classroomId) => {
  try {
    const res = await axiosInstance.delete(`/api/v1/classroom?classroomId=${classroomId}`);
    return res.data;
  } catch (error) {
    console.error('Delete Classroom Error:', error);
    throw error;
  }
};

export const joinClassroom = async (invitationCode) => {
  const res = await axiosInstance.get(`/api/v1/classroom/join?invitationCode=${invitationCode}`);
  return res.data;
};

export const removeStudentFromClassroom = async (classroomId, studentId) => {
  const res = await axiosInstance.delete(
    `${endpoints.classroom.removeStudent}?classroomId=${classroomId}&studentId=${studentId}`
  );
  return res.data;
};

// --------------------------Assignment----------------------------------

export const getAssignments = async (classroomId) => {
  const res = await axiosInstance.get(`${endpoints.assignment.list}?classroomId=${classroomId}`);
  return res.data;
};

export const createAssignment = async (classroomId, data) => {
  const res = await axiosInstance.post(
    `${endpoints.assignment.create}?classroomId=${classroomId}`,
    data
  );
  return res.data;
};

export const getAssignmentById = async (assignmentId) => {
  const res = await axiosInstance.get(`${endpoints.assignment.edit}?assignmentId=${assignmentId}`);
  return res.data;
};

export const updateAssignment = async (assignmentId, data) => {
  const res = await axiosInstance.put(
    `${endpoints.assignment.update}?assignmentId=${assignmentId}`,
    data
  );
  return res.data;
};

export const deleteAssignment = async (assignmentId) => {
  const res = await axiosInstance.delete(
    `${endpoints.assignment.delete}?assignmentId=${assignmentId}`
  );
  return res.data;
};

// --------------------------Laboratory----------------------------------

export const getLaboratoriesByAssignmentId = async (assignmentId) => {
  const res = await axiosInstance.get(`${endpoints.lab.list}?assignmentId=${assignmentId}`);
  return res.data;
};

export const createLaboratory = async (assignmentId, data) => {
  const res = await axiosInstance.post(`${endpoints.lab.crud}?assignmentId=${assignmentId}`, data);
  return res.data;
};

export const updateLaboratory = async (laboratoryId, data) => {
  const res = await axiosInstance.put(`${endpoints.lab.crud}?laboratoryId=${laboratoryId}`, data);
  return res.data;
};

export const getLaboratoryById = async (laboratoryId) => {
  const res = await axiosInstance.get(`${endpoints.lab.crud}?laboratoryId=${laboratoryId}`);
  return res.data;
};

export const deleteLaboratory = async (laboratoryId) => {
  const res = await axiosInstance.delete(`${endpoints.lab.crud}?laboratoryId=${laboratoryId}`);
  return res.data;
};

export const assignLaboratory = async (assignmentId, studentId, laboratoryId) => {
  const res = await axiosInstance.post(
    `${endpoints.assignment.assign}?assignmentId=${assignmentId}&studentId=${studentId}&laboratoryId=${laboratoryId}`
  );
  return res.data;
};

export const assignLaboratoriesRandomly = async (assignmentId) => {
  const res = await axiosInstance.post(
    `${endpoints.assignment.assignRandom}?assignmentId=${assignmentId}`
  );
  return res.data;
};

export const unassignLaboratory = async (assignmentId, studentId) => {
  const res = await axiosInstance.delete(
    `${endpoints.assignment.assign}?assignmentId=${assignmentId}&studentId=${studentId}`
  );
  return res.data;
};

// --------------------------Submissions---------------------------------

export const getSubmissionsByLaboratoryId = async (laboratoryId) => {
  const res = await axiosInstance.get(`${endpoints.submission.get}?laboratoryId=${laboratoryId}`);
  return res.data;
};

export const updateAndExecuteSubmission = async (laboratoryId, testCaseId, language, code) => {
  await axiosInstance.put(
    `/api/v1/submission?laboratoryId=${laboratoryId}&language=${language}`,
    code,
    {
      headers: {
        'Content-Type': 'text/plain',
      },
    }
  );
  const res = await axiosInstance.post(
    `/api/v1/submission/execute?language=${language}&laboratoryId=${laboratoryId}&testCaseId=${testCaseId}`
  );
  return res.data;
};
// export const updateAndExecuteSubmission = async (laboratoryId, language, code) => {
//   await axiosInstance.put(
//     `/api/v1/submission?laboratoryId=${laboratoryId}&language=${language}`,
//     code,
//     {
//       headers: {
//         'Content-Type': 'text/plain',
//       },
//     }
//   );
//   const res = await axiosInstance.post(
//     `/api/v1/submission/execute?language=${language}&laboratoryId=${laboratoryId}`
//   );
//   return res.data;
// };

// ----------------------------------------------------------------------

export const getStudentsByAssignmentId = async (assignmentId) => {
  const res = await axiosInstance.get(`${endpoints.user.student}?assignmentId=${assignmentId}`);
  return res.data;
};

// ----------------------------------------------------------------------

export const getTestCasesByLaboratoryId = async (laboratoryId) => {
  const res = await axiosInstance.get(`${endpoints.testCase.getAll}?laboratoryId=${laboratoryId}`);
  return res.data;
};

export const createTestCase = async (laboratoryId, testCaseData) => {
  const res = await axiosInstance.post(
    `${endpoints.testCase.create}?laboratoryId=${laboratoryId}`,
    testCaseData
  );
  return res.data;
};

export const deleteAllTestCases = async (laboratoryId) => {
  const res = await axiosInstance.delete(
    `${endpoints.testCase.delAll}?laboratoryId=${laboratoryId}`
  );
  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    me: '/api/auth/me',
    login: '/api/auth/login',
    register: '/api/auth/register',
  },
  classroom: {
    list: '/api/v1/classroom/',
    create: '/api/v1/classroom/',
    details: '/api/v1/classroom',
    removeStudent: '/api/v1/classroom/remove',
  },
  assignment: {
    list: '/api/v1/assignment/classroom',
    create: '/api/v1/assignment',
    edit: '/api/v1/assignment',
    update: '/api/v1/assignment',
    delete: '/api/v1/assignment',
    assign: '/api/v1/assignment/assign-laboratory',
    assignRandom: '/api/v1/assignment/assign-laboratory-random',
  },
  lab: {
    list: '/api/v1/laboratory/assignment',
    crud: '/api/v1/laboratory',
  },
  submission: {
    get: '/api/v1/submission',
    execute: '/api/v1/submission/execute',
  },
  user: {
    student: '/api/v1/student',
  },
  testCase: {
    getAll: '/api/v1/testcase/laboratory',
    create: '/api/v1/testcase',
    delAll: '/api/v1/testcase/all',
  },
};

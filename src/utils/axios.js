import axios from 'axios';

import { BACKEND_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: BACKEND_API });

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
  const res = await axiosInstance.post(`${endpoints.lab.all}?assignmentId=${assignmentId}`, data);
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
  },
  assignment: {
    list: '/api/v1/assignment/classroom',
    create: '/api/v1/assignment',
    edit: '/api/v1/assignment',
    update: '/api/v1/assignment',
    delete: '/api/v1/assignment',
  },
  lab: {
    list: '/api/v1/laboratory/assignment',
    all: '/api/v1/laboratory',
  },
};

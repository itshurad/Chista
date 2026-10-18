"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getCourseApi,
  createCourseApi,
  updateCourseApi,
  deleteCourseApi,
  getCourseByIdApi,
  getCoursesApi,
  getCoursesByMenuApi,
  getSessionsApi,
  getSessionApi,
  createSessionApi,
  deleteSessionApi,
  getCourseSessionsApi,
  registerCourseApi,
} from "@/services/courseService";

// ======================================================
// Query Keys
// ======================================================

export const COURSES_KEY = ["courses"];

export const SESSIONS_KEY = ["sessions"];

// ======================================================
// Courses
// ======================================================

export const useAllCourses = () =>
  useQuery({
    queryKey: COURSES_KEY,
    queryFn: getCoursesApi,
  });

export const useAllCoursesByMenu = (menu) =>
  useQuery({
    queryKey: [...COURSES_KEY, "menu", menu],
    queryFn: () => getCoursesByMenuApi(menu),
    enabled: Boolean(menu),
  });

export const useCourse = (href) =>
  useQuery({
    queryKey: [...COURSES_KEY, "single", href],
    queryFn: () => getCourseApi(href),
    enabled: Boolean(href),
  });

export const useCourseByID = (id) =>
  useQuery({
    queryKey: [...COURSES_KEY, "single", id],
    queryFn: () => getCourseByIdApi(id),
    enabled: Boolean(id),
  });

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCourseApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: COURSES_KEY,
      });
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCourseApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: COURSES_KEY,
      });
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCourseApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: COURSES_KEY,
      });
    },
  });
};

// ======================================================
// Sessions
// ======================================================

export const useAllSessions = () =>
  useQuery({
    queryKey: SESSIONS_KEY,
    queryFn: getSessionsApi,
  });

export const useSession = (id) =>
  useQuery({
    queryKey: [...SESSIONS_KEY, "single", id],
    queryFn: () => getSessionApi(id),
    enabled: Boolean(id),
  });

export const useCreateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSessionApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: SESSIONS_KEY,
      });

      queryClient.invalidateQueries({
        queryKey: COURSES_KEY,
      });
    },
  });
};

export const useDeleteSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSessionApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: SESSIONS_KEY,
      });

      queryClient.invalidateQueries({
        queryKey: COURSES_KEY,
      });
    },
  });
};

export const useCourseSessions = ({ courseId, href }) =>
  useQuery({
    queryKey: [...SESSIONS_KEY, "course", courseId, href],

    queryFn: () =>
      getCourseSessionsApi({
        courseId,
        href,
      }),

    enabled: Boolean(courseId && href),
  });

// ======================================================
// Registration
// ======================================================

export const useRegisterCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerCourseApi,

    onSuccess: () => {
      // اطلاعات دوره را دوباره می‌گیرد
      // تا isUserRegisterdToThisCourse آپدیت شود.
      queryClient.invalidateQueries({
        queryKey: COURSES_KEY,
      });
    },
  });
};

import { apiClient } from './api';
import { Subject, Course, Unit, Material } from '../types';

export async function getSubjects(): Promise<Subject[]> {
  return apiClient.get<Subject[]>('/subjects');
}

export async function getCoursesBySubject(subjectId: string): Promise<Course[]> {
  return apiClient.get<Course[]>(`/subjects/${subjectId}/courses`);
}

export async function getUnitsByCourse(courseId: string): Promise<Unit[]> {
  return apiClient.get<Unit[]>(`/courses/${courseId}/units`);
}

export async function getMaterialsByUnit(unitId: string): Promise<Material[]> {
  return apiClient.get<Material[]>(`/units/${unitId}/materials`);
}

export async function getMaterialById(materialId: string): Promise<Material> {
  return apiClient.get<Material>(`/materials/${materialId}`);
} 
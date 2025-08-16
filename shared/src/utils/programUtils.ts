import { Program, ProgramContext } from '../types';
import { ProgramAssignment } from '../types/auth';

/**
 * Convert ProgramAssignment to Program interface
 */
export function programAssignmentToProgram(assignment: ProgramAssignment): ProgramContext {
  return {
    id: assignment.program_id,
    name: assignment.program_name,
    description: undefined, // Not available in ProgramAssignment
    is_active: assignment.is_active,
    organization_id: '', // Not available in ProgramAssignment  
    created_at: assignment.enrolled_at,
    updated_at: assignment.enrolled_at,
    user_role: assignment.role || assignment.role_in_program,
    permissions: [], // TODO: Calculate based on role
  };
}

/**
 * Convert Program to ProgramAssignment interface (for compatibility)
 */
export function programToProgramAssignment(program: Program, userRole: string): ProgramAssignment {
  return {
    program_id: program.id,
    program_name: program.name,
    role: userRole as any, // Cast to UserRole enum
    role_in_program: userRole as any, // Legacy compatibility
    is_active: program.is_active,
    enrolled_at: program.created_at,
    assigned_at: program.created_at, // Legacy compatibility
  };
}

/**
 * Check if user has permission in current program context
 */
export function hasPermissionInProgram(
  programContext: ProgramContext | null,
  permission: string
): boolean {
  if (!programContext) return false;
  return programContext.permissions?.includes(permission) ?? false;
}

/**
 * Check if user has specific role in current program
 */
export function hasRoleInProgram(
  programContext: ProgramContext | null,
  role: string
): boolean {
  if (!programContext) return false;
  return programContext.user_role === role;
}

/**
 * Get role hierarchy level (higher number = more permissions)
 */
export function getRoleLevel(role: string): number {
  const roleLevels: Record<string, number> = {
    super_admin: 100,
    program_admin: 80,
    program_coordinator: 60,
    tutor: 40,
    parent: 20,
    student: 10,
  };
  
  return roleLevels[role] ?? 0;
}

/**
 * Check if user role has at least the required level
 */
export function hasMinimumRoleLevel(
  userRole: string | undefined,
  requiredRole: string
): boolean {
  if (!userRole) return false;
  return getRoleLevel(userRole) >= getRoleLevel(requiredRole);
}
import { Injectable } from '@nestjs/common';
import { AbilityBuilder, PureAbility } from '@casl/ability';
import {
  createPrismaAbility,
  accessibleBy,
  PrismaQuery,
  Subjects,
} from '@casl/prisma';
import type {
  User,
  Employee,
  Note,
  Team,
  Department,
} from 'src/generated/prisma/client';

export enum Actions {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type AppSubjects =
  | 'all'
  | Subjects<{
      User: User;
      Employee: Employee;
      Note: Note;
      Team: Team;
      Department: Department;
    }>;

export type AppAbility = PureAbility<[Actions, AppSubjects], PrismaQuery>;

export type UserContext = {
  id: number;
  role: 'CTO' | 'TM' | 'RM' | 'Employee';
  departmentId?: number;
  managedDepartmentIds?: number[];
};

@Injectable()
export class AbilityFactory {
  defineAbility(user: UserContext): AppAbility {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createPrismaAbility,
    );

    /**
     * CTO
     * - Full access to all resources with no restrictions
     * - Can create, read, update, and delete all records
     * - Can see and edit all fields including salary
     * - Can read admin-only notes
     */
    if (user.role === 'CTO') {
      can(Actions.Manage, 'all'); // using wild card
      return build();
    }

    // Salary field is restricted to CTO only - apply to all non-CTO roles
    cannot(Actions.Read, 'Employee', ['salary']);
    cannot(Actions.Update, 'Employee', ['salary']);

    /**
     * TM (Team Manager)
     * - Manages one or more departments (via managedDepartmentIds)
     * - Can read all employees and teams within assigned departments
     * - Can update employee records including assigning/changing roles within managed departments
     * - Can create notes on employees in managed departments
     * - Can read all notes including admin-only notes (isAdminOnly: true)
     * - Can manage (CRUD) Department and Team models for managed departments
     * - Can edit own name and careerStartDate
     * - Cannot see or edit salary field of any employee (including self)
     */
    if (user.role === 'TM' && user.managedDepartmentIds) {
      // Can read all employees in managed departments
      can(Actions.Read, 'Employee', {
        departmentId: { in: user.managedDepartmentIds },
      });

      // Can update employees in managed departments (except salary)
      can(
        Actions.Update,
        'Employee',
        [
          'name',
          'careerStartDate',
          'email',
          'role',
          'departmentId',
          'reportingManagerId',
        ],
        { departmentId: { in: user.managedDepartmentIds } },
      );

      // Can create notes on employees in managed departments
      can(Actions.Create, 'Note', {
        employeeId: { in: user.managedDepartmentIds },
      });

      // Can read all notes (including admin-only) for employees in managed departments
      can(Actions.Read, 'Note', {
        employee: { is: { departmentId: { in: user.managedDepartmentIds } } },
      });

      // Can manage Department and Team models for managed departments
      can(Actions.Manage, 'Department', {
        id: { in: user.managedDepartmentIds },
      });
      can(Actions.Manage, 'Team', {
        departmentId: { in: user.managedDepartmentIds },
      });

      // Can read and update own profile (name and careerStartDate)
      can(Actions.Read, 'Employee', { id: user.id });
      can(Actions.Update, 'Employee', ['name', 'careerStartDate'], {
        id: user.id,
      });

      return build();
    }

    /**
     * RM (Reporting Manager)
     * - Manages employees who report directly to them (reportingManagerId === user.id)
     * - Can read basic info of direct reports
     * - Can read the role field of direct reports but cannot edit it
     * - Can update direct reports' basic fields (name, email, careerStartDate, departmentId, reportingManagerId)
     * - Can create notes on direct reports
     * - Can read notes on direct reports except admin-only notes (isAdminOnly: true)
     * - Can read own profile and edit own name and careerStartDate
     * - Cannot see or edit salary field of anyone (including self)
     * - Cannot see role field of anyone (including self)
     * - Cannot edit role field of direct reports
     */
    if (user.role === 'RM') {
      // Can read employees who report to them
      can(Actions.Read, 'Employee', { reportingManagerId: user.id });

      // Can update basic fields of direct reports (not salary or role)
      can(
        Actions.Update,
        'Employee',
        [
          'name',
          'careerStartDate',
          'email',
          'departmentId',
          'reportingManagerId',
        ],
        { reportingManagerId: user.id },
      );

      // Explicitly cannot update role field of direct reports
      cannot(Actions.Update, 'Employee', ['role']);

      // Can create notes on direct reports
      can(Actions.Create, 'Note', {
        employee: { is: { reportingManagerId: user.id } },
      });

      // Can read notes on direct reports (except admin-only)
      can(Actions.Read, 'Note', {
        employee: { is: { reportingManagerId: user.id } },
      });
      cannot(Actions.Read, 'Note', { isAdminOnly: true });

      // Can read own profile (all fields except salary)
      // can(Actions.Read, 'Employee', { id: user.id });

      // Can update own name and careerStartDate
      can(Actions.Update, 'Employee', ['name', 'careerStartDate'], {
        id: user.id,
      });

      return build();
    }

    /**
     * Employee
     * - Can only access their own profile data
     * - Can read own employee record
     * - Can update only own name and careerStartDate
     * - Can read own notes
     * - Cannot see salary field (including own)
     * - Cannot see role field (including own)
     * - Cannot read admin-only notes (isAdminOnly: true)
     * - No access to other employees' data
     */
    if (user.role === 'Employee') {
      // Can read own employee record
      can(Actions.Read, 'Employee', { id: user.id });

      // Can update own name and careerStartDate only
      can(Actions.Update, 'Employee', ['name', 'careerStartDate'], {
        id: user.id,
      });

      // Cannot read salary or role fields
      cannot(Actions.Read, 'Employee', ['salary', 'role']);

      // Can read own notes
      can(Actions.Read, 'Note', { employeeId: user.id });

      // Cannot read admin-only notes
      cannot(Actions.Read, 'Note', { isAdminOnly: true });

      return build();
    }

    return build();
  }

  getAccessibleWhere<T extends AppSubjects>(
    ability: AppAbility,
    model: Exclude<T, 'all'>,
  ): PrismaQuery {
    // Returns Prisma WhereInput for accessible records
    const accessible = accessibleBy(ability) as any;
    return accessible[model as string] as PrismaQuery;
  }
}

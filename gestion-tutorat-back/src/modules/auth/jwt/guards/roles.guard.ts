import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    console.log(user);
    console.log('Role:', user?.role);
    console.log('RolesGuard → Required:', requiredRoles);
console.log('RolesGuard → User role:', user?.role);

    return requiredRoles.includes(user?.role);
  }
}

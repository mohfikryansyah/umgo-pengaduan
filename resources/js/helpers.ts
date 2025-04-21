import { User } from "./types";

// export function hasRole(user: User, role: string): boolean {
//     return user.roles.includes(role);
// }

export function hasRole(user: User, roles: string[]) {
    return user.roles.some(r => roles.includes(r));
}

export const limitText = (text: string, limit: number = 100): string => {
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };
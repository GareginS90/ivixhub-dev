"use server";

import { revalidatePath } from "next/cache";
import {
  adminFetch,
  type AdminUser,
  type UserGender,
  type UserRole
} from "@/lib/admin-api";

export type CreateUserInput = {
  email: string;
  fullName: string;
  username: string;
  birthDate: string;
  gender: UserGender;
  phone: string;
  password: string;
  role: UserRole;
  active: boolean;
};

export type CreateUserResult =
  | {
      success: true;
      userId: number;
    }
  | {
      success: false;
      message: string;
    };

const USER_ROLES: UserRole[] = [
  "CLIENT",
  "PSYCHOLOGIST",
  "ADMIN"
];

const USER_GENDERS: UserGender[] = [
  "MALE",
  "FEMALE",
  "UNSPECIFIED"
];

export async function createUser(
  input: CreateUserInput
): Promise<CreateUserResult> {
  try {
    const email = input.email.trim().toLowerCase();
    const fullName = input.fullName.trim();
    const username = input.username.trim().toLowerCase();
    const birthDate = input.birthDate.trim();
    const phone = input.phone.trim();

    if (!email) {
      return {
        success: false,
        message: "Email is required"
      };
    }

    if (!username) {
      return {
        success: false,
        message: "Username is required"
      };
    }

    if (!birthDate) {
      return {
        success: false,
        message: "Birth date is required"
      };
    }

    if (!input.password) {
      return {
        success: false,
        message: "Password is required"
      };
    }

    if (!USER_ROLES.includes(input.role)) {
      return {
        success: false,
        message: "Invalid user role"
      };
    }

    if (!USER_GENDERS.includes(input.gender)) {
      return {
        success: false,
        message: "Invalid gender"
      };
    }

    const user = await adminFetch<AdminUser>(
      "/api/admin/users",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          fullName: fullName || null,
          username,
          birthDate,
          gender: input.gender,
          phone: phone || null,
          password: input.password,
          role: input.role,
          active: input.active
        })
      }
    );

    revalidatePath("/");
    revalidatePath("/users");
    revalidatePath(`/users/${user.id}`);
    revalidatePath("/audit");

    return {
      success: true,
      userId: user.id
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create user"
    };
  }
}

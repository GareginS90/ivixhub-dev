"use server";

import { revalidatePath } from "next/cache";
import {
  adminFetch,
  type AdminUser
} from "@/lib/admin-api";

function validateUserId(userId: number) {
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error("Invalid user ID");
  }
}

function revalidateUserPaths(userId: number) {
  revalidatePath("/");
  revalidatePath("/users");
  revalidatePath(`/users/${userId}`);
  revalidatePath("/audit");
}

export async function activateUser(userId: number) {
  validateUserId(userId);

  await adminFetch<AdminUser>(
    `/api/admin/users/${userId}/activate`,
    {
      method: "POST"
    }
  );

  revalidateUserPaths(userId);
}

export async function deactivateUser(userId: number) {
  validateUserId(userId);

  await adminFetch<AdminUser>(
    `/api/admin/users/${userId}/deactivate`,
    {
      method: "POST"
    }
  );

  revalidateUserPaths(userId);
}

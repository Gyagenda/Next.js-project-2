"use server";

import { createClient } from "@/auth/server";
import { prisma } from "@/db/prisma";

export const handleError = (error: unknown) => {
  console.error(error);
  return { 
    errorMessage: error instanceof Error ? error.message : "An unknown error occurred" 
  };
};

export const loginAction = async (email: string, password: string) => {
  try {
    const { auth } = await createClient();

    const { error } = await auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const logOutAction = async () => {
  try {
    const { auth } = await createClient();

    const { error } = await auth.signOut();
    if (error) throw error;

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const signUpAction = async (email: string, password: string) => {
  try {
    const { auth } = await createClient();

    const { data, error } = await auth.signUp({
      email,
      password,
    });
    if (error) throw error;

    const userId = data.user?.id;
    if (!userId) throw new Error("Error signing up");

    await prisma.user.create({
      data: {
        id: userId,
        email,
      },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};
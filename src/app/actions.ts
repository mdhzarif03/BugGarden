"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma"; // Direct import only
import { revalidatePath } from "next/cache";

export async function recordSubmission(
  challengeId: string,
  passed: boolean,
  solveTimeSec: number,
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const userId = session.user.id;

  // Save submission
  await prisma.submission.create({
    data: {
      userId,
      challengeId,
      status: passed ? "PASSED" : "FAILED",
      solveTime: solveTimeSec,
    },
  });

  if (passed) {
    // Award 50 XP and 15 ELO Points on success
    await prisma.user.update({
      where: { id: userId },
      data: {
        xp: { increment: 50 },
        rating: { increment: 15 },
      },
    });
  }

  revalidatePath("/leaderboard");
  return { success: true };
}

export async function getLeaderboard() {
  return await prisma.user.findMany({
    take: 10,
    orderBy: { rating: "desc" },
    select: { id: true, name: true, image: true, rating: true, xp: true },
  });
}

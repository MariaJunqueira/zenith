/// <reference lib="webworker" />

import { User } from "../../models/user.model";

addEventListener('message', handleUserMessage);

/**
 * Handles the 'message' event, processes user data in chunks.
  * @param data - The data property of the message event, containing users, category, and chunkSize.
 */
function handleUserMessage({ data }: MessageEvent) {
  const { users, category, chunkSize = 200 } = data;
  processUsersInChunks(users, category, chunkSize);
}

/**
 * Processes users in chunks to avoid blocking the UI thread.
 * @param users - The array of users to process.
 * @param category - The key to group users by.
 * @param chunkSize - The size of each chunk to process.
 */
function processUsersInChunks(users: User[], category: keyof User, chunkSize: number = 200): void {
  if (users.length === 0) {
    postMessage({});
    return;
  }

  let groupedUsers: Record<string, User[]> = {};

  const processChunk = (startIndex: number) => {
    const chunk = users.slice(startIndex, startIndex + chunkSize);
    groupedUsers = groupUsersByCategory(chunk, groupedUsers, category);

    if (startIndex + chunkSize < users.length) {
      setTimeout(() => processChunk(startIndex + chunkSize), 0);
    } else {
      postMessage(groupedUsers);
    }
  };

  processChunk(0);
}

/**
 * Groups users by a specified category.
 * @param users - The array of users to group.
 * @param groupedUsers - The object to store grouped users.
 * @param category - The key to group users by.
 * @returns A record of grouped users.
 */
function groupUsersByCategory(users: User[], groupedUsers: Record<string, User[]>, category: keyof User): Record<string, User[]> {
  return users.reduce((acc, user) => {
    const key = user[category] as string;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(user);
    return acc;
  }, groupedUsers);
}

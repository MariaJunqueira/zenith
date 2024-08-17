/// <reference lib="webworker" />

/**
 * Handles the 'message' event, processes generic data in chunks.
 * @param data - The data property of the message event, containing items, category, and chunkSize.
 */
addEventListener('message', handleDataMessage);

function handleDataMessage<T>({ data }: MessageEvent) {
  const { items, category, chunkSize = 200 } = data;
  processItemsInChunks<T>(items, category, chunkSize);
}

/**
 * Processes items in chunks to avoid blocking the UI thread.
 * @param items - The array of items to process.
 * @param category - The key to group items by.
 * @param chunkSize - The size of each chunk to process.
 */
function processItemsInChunks<T>(items: T[], category: keyof T, chunkSize: number = 200): void {
  if (items.length === 0) {
    postMessage({});
    return;
  }

  let groupedItems: Record<string, T[]> = {};

  const processChunk = (startIndex: number) => {
    const chunk = items.slice(startIndex, startIndex + chunkSize);
    groupedItems = groupItemsByCategory<T>(chunk, groupedItems, category);

    if (startIndex + chunkSize < items.length) {
      setTimeout(() => processChunk(startIndex + chunkSize), 0);
    } else {
      postMessage(groupedItems);
    }
  };

  processChunk(0);
}

/**
 * Groups items by a specified category.
 * @param items - The array of items to group.
 * @param groupedItems - The object to store grouped items.
 * @param category - The key to group items by.
 * @returns A record of grouped items.
 */
function groupItemsByCategory<T>(items: T[], groupedItems: Record<string, T[]>, category: keyof T): Record<string, T[]> {
  return items.reduce((acc, item) => {
    const key = item[category] as string;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, groupedItems);
}

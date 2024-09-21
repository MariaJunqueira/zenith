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
function processItemsInChunks<T>(items: T[], category: string, chunkSize: number = 200): void {
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
function groupItemsByCategory<T>(items: T[], groupedItems: Record<string, T[]>, categoryPath: string): Record<string, T[]> {
  // Group the items first
  const grouped = items.reduce((acc, item) => {
    let key: string;

    // Handle special case for grouping by the first letter of the name
    if (categoryPath.includes('name')) {
      const name = getNestedValue(item, categoryPath) as string;
      key = name.charAt(0).toUpperCase(); // Get the first letter and convert it to uppercase
    } else {
      key = getNestedValue(item, categoryPath) as string;
    }

    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, groupedItems);

  // Sort the grouped keys alphabetically
  const sortedGrouped: Record<string, T[]> = {};
  Object.keys(grouped).sort().forEach(key => {
    sortedGrouped[key] = grouped[key];
  });

  return sortedGrouped;
}

/**
 * Utility function to get the value of a nested property from an object.
 * @param obj The object to retrieve the value from.
 * @param path The path to the property, e.g., 'dob.age' or 'nat'.
 * @returns The value of the property at the given path.
 */
function getNestedValue<T>(obj: T, path: string): any {
  return path.split('.').reduce((acc: any, part: string) => {
    if (acc && typeof acc === 'object' && part in acc) {
      return acc[part as keyof typeof acc];
    }
    return undefined;
  }, obj);
}

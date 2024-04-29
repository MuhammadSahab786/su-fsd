import { parseCsvFile, sortFileData, createJsonResponse } from '@/utils';
import path from 'path';

export async function GET(request: Request): Promise<Response> {
  const sortBy = new URL(request.url).searchParams.get('sortBy');

  try {
    const filePath = path.join(process.cwd(), 'data.csv');
    const fileData = await parseCsvFile(filePath);
    const sortedData = sortFileData(fileData, sortBy);
    return createJsonResponse(true, sortedData, 'Data retrieved successfully.');
  } catch (error) {
    console.error(error);
    return createJsonResponse(false, [], 'Failed to read the file.');
  }
}

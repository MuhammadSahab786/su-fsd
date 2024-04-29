import csv from 'csv-parser';
import fs from 'fs';

import { IFilePayload } from '@/interfaces';
import { CREATED_AT, FILE_NAME_ASC, FILE_NAME_DESC } from '@/constants';

async function parseCsvFile(filePath: string): Promise<IFilePayload[]> {
  return new Promise((resolve, reject) => {
    const results: IFilePayload[] = [];
    fs.createReadStream(filePath)
      .pipe(csv({ separator: ';' }))
      .on('data', (data: IFilePayload) =>
        results.push({
          createdAt: Object.values(data)[0],
          fileName: Object.values(data)[1],
        })
      )
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

function sortFileData(
  data: IFilePayload[],
  sortBy?: string | null
): IFilePayload[] {
  switch (sortBy) {
    case CREATED_AT:
      return data.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    case FILE_NAME_ASC:
      return data.sort((a, b) => a.fileName.localeCompare(b.fileName));
    case FILE_NAME_DESC:
      return data.sort((a, b) => b.fileName.localeCompare(a.fileName));
    default:
      return data;
  }
}

function createJsonResponse(
  status: boolean,
  data: IFilePayload[],
  message: string
): Response {
  const responseBody = { status, data, message };
  return new Response(JSON.stringify(responseBody), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export { parseCsvFile, sortFileData, createJsonResponse };

import { IFilePayload } from '@/interfaces';

export default function Table({ data }: { data: IFilePayload[] }) {
  return (
    <div className='w-full mb-8 overflow-hidden rounded-lg shadow-lg'>
      <div className='w-full overflow-x-auto'>
        <table className='w-full'>
          <thead>
            <tr className='text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-600'>
              <th className='px-4 py-3'>Created At</th>
              <th className='px-4 py-3'>File Name</th>
            </tr>
          </thead>
          <tbody className='bg-white'>
            {data.map((item) => (
              <tr
                key={item.createdAt + item.fileName}
                className='text-gray-700'
              >
                <td className='px-4 py-3 text-lg font-semibold border'>
                  {item.createdAt}
                </td>
                <td className='px-4 py-3 text-lg border'>
                  <span className='px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-sm'>
                    {item.fileName}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Error({ error }: { error: string }) {
  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='text-center'>
        <p className='text-2xl text-red-600'>Oops! Something went wrong.</p>
        <p className='text-md mt-4 text-gray-800'>{error}</p>
      </div>
    </div>
  );
}

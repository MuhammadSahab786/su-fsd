import { fetchSortedDataServer } from '@/services/api';
import Container from '@/components/Container';

export default async function Home() {
  const { data } = await fetchSortedDataServer();

  return <Container data={data} />;
}

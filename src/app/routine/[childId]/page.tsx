import { redirect } from 'next/navigation';
export default function RoutinePage() {
  redirect('/');
}
export function generateStaticParams() {
  return [{ childId: 'griff' }, { childId: 'harriet' }, { childId: 'evie' }];
}

import { RouterProvider } from 'react-router';
import { router } from './routes';
import { MobileContainer } from './components/MobileContainer';

export default function App() {
  return (
    <MobileContainer>
      <RouterProvider router={router} />
    </MobileContainer>
  );
}
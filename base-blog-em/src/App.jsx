// QueryClient - manages queries & cache.
// QueryClientProvider - provides cache & client config to children which takes above query client as the value.
import { QueryClient, QueryClientProvider } from 'react-query';

// default react query dev tools
import { ReactQueryDevtools } from 'react-query/devtools';

import { Posts } from './Posts';
import './App.css';

// creating query client
const queryClient = new QueryClient();

function App() {
  return (
    // provide React Query client to App
    // our app has access to Queries & Cache now as well as react query hooks
    <QueryClientProvider client={queryClient}>
      <div className='App'>
        <h1>Blog Posts</h1>
        <Posts />
      </div>

      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;

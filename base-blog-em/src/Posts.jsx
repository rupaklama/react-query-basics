import { useState, useEffect } from 'react';

// useQuery hook to fetch data from the server
// prefetchQuery hook is a method of 'QueryClient' &
// we can get that QueryClient with useQueryClient hook
import { useQuery, useQueryClient } from 'react-query';

import { PostDetail } from './PostDetail';

const maxPostPage = 10;

async function fetchPosts(pageNum) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}`);
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  // accessing query client to use prefetchQuery hook to
  // prefetch the results of a query to be placed into the cache
  const queryClient = useQueryClient();

  // note - useEffect is the best tool to detect any changes on state in the component
  useEffect(() => {
    // not to over fetch data
    if (currentPage < maxPostPage) {
      // note - we will prefetch whatever the next page is
      const nextPage = currentPage + 1;

      // the args in prefetchQuery is very similar to useQuery - Query key dependency array
      // note - the Query Key has to be same one in useQuery - 'posts' since we are caching posts data &
      // this is where react query will be looking to see if there's already a data in the cache
      queryClient.prefetchQuery(['posts', nextPage], () => fetchPosts(nextPage));
    }
  }, [currentPage, queryClient]);

  // useQuery returns an Object with lots of properties
  // first arg - 'posts' is the 'key' to name this current query. It must be unique in our whole app.
  // note - React Query uses the 'key' for cache/stale time. Must be unique in our whole codebase.
  // note - updated query key to be a Dependency Array to create a new query to get fresh data.

  // second arg - is the Async Query Function which fetches the data
  // third arg - is the Option Object & the Option we are going to update is stale time in milliseconds,
  // allowing our posts to be out of date or outdated by 2 secs. Data is not fresh anymore after 2 secs.
  // note - default staleTime is set to 0 to always get a fresh data from the server

  // note - data variable holds the response data from the server
  const { data, isError, error, isLoading } = useQuery(
    ['posts', currentPage],
    () => fetchPosts(currentPage),
    {
      staleTime: 2000,
      // when query key changes to keep the old cached data around,
      // so when somebody goes to the previous page, we still have that data in cache
      keepPreviousData: true,
    }
  );

  // In addition to the boolean - isError,
  // the return also has an 'error' object.

  // if (!data) return <div>Loading...</div>;
  // doing same thing as above with react query
  if (isLoading) return <h3>Loading...</h3>;

  if (isError)
    return (
      <>
        <h3>
          {/* toString() method returns a string representing the specified object */}
          Oops, something went wrong. <p>{error.toString()}</p>{' '}
        </h3>
      </>
    );

  return (
    <>
      <ul>
        {data?.map(post => (
          <li key={post.id} className='post-title' onClick={() => setSelectedPost(post)}>
            {post.title}
          </li>
        ))}
      </ul>

      <div className='pages'>
        <button
          disabled={currentPage <= 1}
          onClick={() => setCurrentPage(previousValue => previousValue - 1)}
        >
          Previous page
        </button>
        <span>Page {currentPage}</span>

        <button
          disabled={currentPage >= maxPostPage}
          onClick={() => setCurrentPage(previousValue => previousValue + 1)}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}

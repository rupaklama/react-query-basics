import { useState } from 'react';

// hook to fetch data from the server
import { useQuery } from 'react-query';

import { PostDetail } from './PostDetail';

const maxPostPage = 10;

async function fetchPosts() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10&_page=0');
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);
  console.log(selectedPost);

  // useQuery returns an Object with lots of properties
  // first arg - 'posts' is the 'key' to name this current query. It must be unique in our whole app.
  // note - React Query uses the 'key' for cache/stale time. Must be unique in our whole codebase.

  // second arg - is the Async Query Function which fetches the data
  // third arg - is the Option Object & the Option we are going to update is stale time in milliseconds,
  // allowing our posts to be out of date or outdated by 2 secs. Data is not fresh anymore after 2 secs.
  // note - default staleTime is set to 0 to always get a fresh data from the server

  // note - data variable holds the response data from the server
  const { data, isError, error, isLoading } = useQuery('posts', fetchPosts, { staleTime: 2000 });
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
        <button disabled onClick={() => {}}>
          Previous page
        </button>
        <span>Page {currentPage + 1}</span>
        <button disabled onClick={() => {}}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}

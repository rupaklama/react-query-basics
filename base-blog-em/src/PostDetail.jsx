import { useQuery } from 'react-query';

async function fetchComments(postId) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
  return response.json();
}

async function deletePost(postId) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/postId/${postId}`, { method: 'DELETE' });
  return response.json();
}

async function updatePost(postId) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/postId/${postId}`, {
    method: 'PATCH',
    data: { title: 'REACT QUERY FOREVER!!!!' },
  });
  return response.json();
}

export function PostDetail({ post }) {
  // An Async Query Function which fetches the data requires parameter - post id
  // therefore, we need to use Anonymous Arrow Function with the param to return a value

  // note - In this way ['query key', post.id], we are treating Query Key as a Dependency Array for the query.
  // Now, when the ‘post.id’ changes in this query key, react query creates a New Query with fresh data &
  // new stale/cache time - completely brand new query on changing the dependency array.
  // This avoids NOT UPDATING related data on render.
  const { data, isLoading, isError, error } = useQuery(['comments', post.id], () => fetchComments(post.id));

  if (isLoading) return <h3>Loading...</h3>;

  if (isError) return <h3>Something went wrong. {error.toString()}</h3>;

  return (
    <>
      <h3 style={{ color: 'blue' }}>{post.title}</h3>
      <button>Delete</button> <button>Update title</button>
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map(comment => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}

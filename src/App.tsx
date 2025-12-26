import { useCallback } from 'react';
import './App.css'
import "./queryStitcher";
import { useFragment } from './useFragment'
import { useMutation } from './useMutation';

const PostItemComponent = ({ postRef }: {
  postRef: string
}) => {
  const data = useFragment(
    {
      name: "PostItem_post",
      fields: ["id", "title", "content"]
  }, {
    __ref: postRef
  })

  const [commit] = useMutation({
    name: "PostItem_post",
    fields: ["id", "title", "content"]
  });

  const onPostUpdate = useCallback(() => {
    commit({
      variables: {
        id: data.id,
        title: data.title + " (updated)"
      }
    })
  }, [commit, data.id])

  return (
    <li key={data.id}>{data.title} - <button onClick={onPostUpdate}>update</button></li>
  )
}

function App() {
  const data = useFragment(
    {
      name: "NewsFeed_viewer",
      fields: ["id", "category", {
        posts: {
          name: "PostItem_post",
          fields: ["id"]
        }
      }]
  },
  { __ref: "viewer-1" }
  )

  return (
    <>
      <h1>Relay mini</h1>
      <div className="card">
        <p>
          Relay mini implementation for the sake of learning :)
        </p>
      </div>
      <div className="posts">
        <ul>
        {data.posts?.map((post) => <PostItemComponent key={post.id} postRef={post.id} />)}
      </ul>
      </div>
    </>
  )
}

export default App

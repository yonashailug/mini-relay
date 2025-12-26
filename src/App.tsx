import './App.css'
import "./queryStitcher";
import { useFragment } from './hooks/useFragment'
import { PostItem } from './components/PostItem';

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
      <h2>Mini Relay implementation</h2>
      <div className="posts">
        <ul>
        {data.posts?.map((post) => <PostItem key={post.id} postRef={post} />)}
      </ul>
      </div>
    </>
  )
}

export default App

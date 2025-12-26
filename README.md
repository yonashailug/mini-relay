# Relay-Mini

A lightweight, educational implementation of the Relay architectural pattern. This project demonstrates how to build a declarative, fragment-based data layer for React applications using GraphQL principles.

Learn about Relay [here](https://relay.dev/docs/)

## Core features

- Normalized Store: A centralized, flat-map data store that ensures "Single Source of Truth."
- Data Masking: Components can only access the data they specifically requested in their Fragments.
- Query Stitching: Automatically aggregates child component data needs into a single parent request.
- Publisher/Subscriber: "Point-to-point" UI updates—only components whose data has changed will re-render.
- Optimistic UI & Rollback: Instant UI feedback with the ability to revert to a previous state if a mutation fails.

## API reference

`createFragment(config)`

Defines the data requirements for a component.

```js
const PostFragment = createFragment({
  name: "PostItem_post",
  fields: ["id", "title", "content"]
});
```


`useFragment(fragment, reference)`

The primary hook for reading data. It subscribes the component to the store and returns masked data.

```js
const data = useFragment(PostFragment, props.postRef);
```

`useMutation(fragment)`

Handles data updates. Returns a commit function and an inFlight (loading) boolean.

```js
const [commit, inFlight] = useMutation(PostFragment);

const onUpdate = () => {
  commit({
    variables: { id: "1", title: "New Title" },
    optimisticResponse: { id: "1", title: "New Title 2" }
  });
};
```

## Example usage
1. The child (PostItem)
```js
const PostItem = ({ postRef }) => {
  const data = useFragment(PostFragment, { __ref: postRef.id });
  const [commit, inFlight] = useMutation(PostFragment);

  return (
    <li style={{ opacity: inFlight ? 0.5 : 1 }}>
      {data.title}
      <button onClick={() => commit({ variables: { id: data.id, title: "Updated!" } })}>
        Update
      </button>
    </li>
  );
};
```

2. The parent (NewsFeed)
```js
const NewsFeed = () => {
  const data = useFragment(FeedFragment, { __ref: "viewer-1" });

  return (
    <ul>
      {data.posts.map(post => (
        <PostItem key={post.id} postRef={post} />
      ))}
    </ul>
  );
};
```

## Why Relay?
- Co-location: Data needs live inside the component file.
- Efficiency: One network request for the entire page, but only tiny re-renders in the UI.
- Predictability: Data masking prevents "hidden dependencies" where a component breaks because a parent stopped fetching a certain field.

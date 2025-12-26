import { useCallback } from "react";

import { useFragment } from "../hooks/useFragment";
import { useMutation } from "../hooks/useMutation";

export const PostItem = ({ postRef }) => {
    const data = useFragment(
      {
        name: "PostItem_post",
        fields: ["id", "title", "content"]
    }, {
      __ref: postRef.id
    })
  
    const [commit, inFlight] = useMutation({
      name: "PostItem_post",
      fields: ["id", "title", "content"]
    });
  
    const onPostUpdate = useCallback(() => {
      commit({
        variables: {
          id: data.id,
          title: data.title + " (updated)"
        },
        optimisticResponse: {
          id: data.id,
          title: data.title + " (optimistically updated)"
        }
      })
    }, [commit, data.id])
  
    const text = inFlight ? "working...": "Update"
  
    return (
      <li key={data.id}>{data.title} - <button disabled={inFlight} onClick={onPostUpdate}>{text}</button></li>
    )
}
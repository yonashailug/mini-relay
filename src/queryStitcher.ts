import { createFragment, type Fragment } from "./fragment";
import { store } from "./store";

export function generateQuery(rootField: string, fragments: Fragment[]): string {

    const processFields = (fields: (string | { [key: string]: Fragment })[]) => {
        let queryStr = "";
        fields.forEach(field => {
            if (typeof field === 'string') {
                queryStr += `${field} `;
            } else {
                for (const [key, subFragment] of Object.entries(field)) {
                    queryStr += `${key} { ${processFields(subFragment.fields)} } `;
                }
            }
        });

        return queryStr;
    };

    let finalFields = "";
    fragments.forEach(frag => {
        finalFields += processFields(frag.fields);
    });

    return `query { ${rootField} { ${finalFields.trim()} } }`;
}

// Child Fragment: Defines what a single Post looks like
const PostFragment = createFragment({
    name: "PostItem_post",
    fields: ["id", "title", "content"]
});

// Parent Fragment: Defines the Feed and includes the Post pointer
const FeedFragment = createFragment({
    name: "NewsFeed_viewer",
    fields: [
        "id",
        "category",
        { posts: PostFragment }
    ]
});

const query = generateQuery("viewer", [FeedFragment]);
console.log("Generated Query:", query);

// 1. Mock Server Response (Nested)
const rawResponse = {
    id: "viewer-1",
    category: "Tech News",
    posts: [
        { id: "post-101", title: "Relay Internals", content: "Deep dive into stores." },
        { id: "post-102", title: "GraphQL Tips", content: "Use fragments everywhere." }
    ]
};

// 2. Normalize: This turns the nested posts into { __ref: "post-101" }
store.build(rawResponse);

/* Result: { 
  id: "viewer-1", 
  category: "Tech News", 
  posts: [{ __ref: "post-101" }, { __ref: "post-102" }] 
}
*/

/* Output:
  query { 
    viewer { 
      id category posts { id title content } 
    } 
  }
*/
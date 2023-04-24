
const Posts = ({posts}) => {
    return (
        <div>
            <table>
                <thead>
                    <h3>Created Posts:</h3>
                    <tr>
                        <th>Creator ID</th>
                        <th>Creator Name</th>
                        <th>Group ID</th>
                        <th>Visibility</th>
                        <th>Title</th>
                        <th>Content</th>
                        <th>Created At</th>
                        <th>Image URL</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map(post =>
                        <tr key={post.id}>
                            <td>{post.creator_id}</td>
                            <td>{post.creator_name}</td>
                            <td>{post.group_id}</td>
                            <td>{post.visibility}</td>
                            <td>{post.title}</td>
                            <td>{post.content}</td>
                            <td>{post.created_at}</td>
                            <td>{post.img_url}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default Posts

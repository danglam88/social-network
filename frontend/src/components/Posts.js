import Comments from './Comments.js'
import CommentForm from './CommentForm.js'

const Post = ({ post }) => {
    return (
        <tr>
            <td>{post.creator_id}</td>
            <td>{post.creator_name}</td>
            <td>{post.group_id}</td>
            <td>{post.visibility}</td>
            <td>{post.title}</td>
            <td>{post.content}</td>
            <td>{post.created_at}</td>
            <td>{post.img_url}</td>
            <Comments post={post.id}/>
            <CommentForm post={post.id}/>
        </tr>
    )
}

const Posts = ({posts}) => {

    <h3>Created Posts:</h3>
    
    return (
        <div>
            <table>
                <thead>
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
                    {posts && posts.map(post =>
                        <Post post={post} key={post.id} />
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default Posts

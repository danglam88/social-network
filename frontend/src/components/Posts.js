import React, { useState, useEffect } from 'react'
import postsService from "../services/PostsService"

const Posts = (props) => {
    const postUrl = 'http://localhost:8080/post?creator_id=' + props.creatorId
    const [posts, setPosts] = useState([])

    useEffect(() => {
        postsService.posts(postUrl)
            .then(response => {
                setPosts(response.data)
            })
    }, [])

    return (
        <div>
            <table>
                <thead>
                    <h2>Created Posts:</h2>
                    <tr>
                        <th>Creator ID</th>
                        <th>Creator Name</th>
                        <th>Visibility</th>
                        <th>Title</th>
                        <th>Content</th>
                        <th>Created At</th>
                        <th>Image URL</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map(post =>
                        <tr id={post.id}>
                            <td>{post.creator_id}</td>
                            <td>{post.creator_name}</td>
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

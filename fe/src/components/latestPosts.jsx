import React, {useEffect, useState} from 'react';
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic.css"

const LatestPost = () => {

    const [currentPage, setCurrentPage] = useState(1)
    const [post, setPost] = useState([])


    const getPosts = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/posts?page=${currentPage}`)
            const data = await response.json()
            setPost(data)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        getPosts()
    }, [currentPage])

    console.log(post)

    const handlePagination = (value) => {
        setCurrentPage(value)
    }

    return (
        <div>

            {post && post.posts?.map((post, i) => {
                return (
                    <li key={i}>{post.title}</li>
                )
            })}

            <div>
                <ResponsivePagination current={currentPage} total={post && post.totalPages} onPageChange={handlePagination}/>
            </div>
        </div>
    );
};

export default LatestPost;

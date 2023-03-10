import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function List() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    await axios.get(`http://localhost/api/posts`).then(({ data }) => {
      setPosts(data);
    });
  };

  const deletePost = async (id) => {
    const isConfirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      return result.isConfirmed;
    });

    if (!isConfirm) {
      return;
    }

    await axios
      .delete(`http://localhost/api/posts/${id}`)
      .then(({ data }) => {
        Swal.fire({
          icon: "success",
          text: data.message,
        });
        fetchPosts();
      })
      .catch(({ response: { data } }) => {
        Swal.fire({
          text: data.message,
          icon: "error",
        });
      });
  };

  return (
    <div className="container">
      <div className="w-screen">
        <div className="shadow overflow-hidden border-b border-gray-200">
          <table className="w-full bg-white">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="w-1/3 text-center py-3 px-4 uppercase font-semibold text-sm">
                  제목
                </th>
                <th className="w-1/3 text-center py-3 px-4 uppercase font-semibold text-sm">
                  내용
                </th>
                <th className="w-1/3 text-center py-3 px-4 uppercase font-semibold text-sm">
                  수정 / 삭제
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
                {posts.length > 0 &&
                  posts.map((row, key) => (
                    <tr key={key} className="transition duration-300 ease-in-out bg-white border-b hover:bg-gray-100">
                      <td className="w-1/3 text-center py-3 px-4">{row.title}</td>
                      <td className="w-1/3 text-center py-3 px-4">{row.description}</td>
                      <td className="w-1/3 text-center">
                        <Link
                          to={`/post/edit/${row.id}`}
                          className="px-4 py-2 text-base font-semibold text-center text-white transition duration-200 ease-in bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 "
                        >
                          수정
                        </Link>
                        <button
                          className="items-center px-4 py-2 text-base font-semibold text-center text-white transition duration-200 ease-in bg-red-600 rounded-lg shadow-md hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 "
                          onClick={() => deletePost(row.id)}
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="col-12">
        <Link
          className="w-full px-4 py-2 text-base font-semibold text-center text-white transition duration-200 ease-in bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 "
          to={"/post/create"}
        >
          글 쓰기
        </Link>
      </div>
    </div>
  );
}

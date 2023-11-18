import { useEffect, useState } from "react";
import { UserDetailsApi } from "../services/Api";
import NavBar from "../components/NavBar";
import { logout, isAuthenticated } from "../services/Auth";
import { useNavigate, Navigate } from "react-router-dom";
import axios from "axios"; 

export default function DashboardPage() {
    const navigate = useNavigate();

    const [user, setUser] = useState({ name: "", email: "", localId: "" });
    const [searchQuery, setSearchQuery] = useState("");
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        if (isAuthenticated()) {
            UserDetailsApi().then((response) => {
                setUser({
                    name: response.data.users[0].displayName,
                    email: response.data.users[0].email,
                    localId: response.data.users[0].localId,
                });
            });
        }
    }, []);

    const logoutUser = () => {
        logout();
        navigate("/login");
    };
    
    const handleSearch = () => {
        console.log(searchQuery);
        axios.post('http://localhost:5000/search', {
            search_query: searchQuery
        })
        .then(response => {

            setVideos(response.data);
            console.log(videos)
        })
        .catch(error => {
            console.error('Error fetching videos:', error);
        });
    };
    if (!isAuthenticated()) {
        return <Navigate to="/login" />;
    }

    return (
        <div>
            <NavBar logoutUser={logoutUser} />
            <main role="main" className="container mt-5" id="mn">
                <div className="container">
                    <div className="text-center mt-5">
                        <label>
                            Search: <input
                                name="myInput"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </label>
                        <button type="submit" onClick={handleSearch}>Submit</button>
                    </div>
                </div>
                
                <table border="2">
      <thead>
        <tr>
          <th>Title</th>
          <th>Views</th>
          <th>Likes</th>
          <th>Comments</th>
          <th>TotalCount</th>
         
          <th>Bad comments</th>
          <th>Good comments</th>
          <th>Watch Video</th>
        </tr>
      </thead>
      <tbody>
    {videos.map((video, index) => (
        <tr key={index}>
            <td>{video.title}</td>
            <td>{video.views}</td>
            <td>{video.likes}</td>
            <td>{video.comments}</td>
            <td>{video.total_count}</td>
            <td>{video.complement_percentage}%</td>
            <td>{video.threshold_percentage}%</td>
            <td><a href={video.url}>Watch Video</a></td>
        </tr>
    ))}
</tbody>
    </table>
            </main>
        </div>
    );
}

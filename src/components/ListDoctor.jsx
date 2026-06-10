import React, { useEffect, useState } from 'react'
import '../css/listDoctor.css'
import { NavLink } from 'react-router-dom'
import { FaCalendar, FaSearch } from 'react-icons/fa'
import axios from 'axios'
import { useUserContext } from '../context/userContext.jsx'
import toast from 'react-hot-toast'

function ListDoctor() {

    const [doctor, setDoctor] = useState([])
    const [searchTerm, setSearchTerm] = useState("");
    const { user } = useUserContext()

    async function handle_remove(id) {
        try {
            const res = await axios.delete(`https://clear-vision-backend.onrender.com/removeDoctor?id=${id}`);

            if (res.data.success) {
                toast.success(res.data.message);

                // ✅ REMOVE doctor instantly from UI
                setDoctor((prev) => prev.filter((doc) => doc.id !== id));
            } else {
                toast.error(res.data.error);
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {

        window.scrollTo(0, 0)

    }, [])


    // Fetch doctors from the backend
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get(
                    `https://clear-vision-backend.onrender.com/doctorsSearch?search=${searchTerm}`
                );
                setDoctor(response.data.data);

            } catch (error) {
                console.error("Error fetching doctors:", error);
            }
        };

        fetchDoctors();
    }, [searchTerm]); // Refetch doctors when search term changes



    return (
        <>

            <div className='doc-heading'>

                <h1 style={{ margin: '5rem 0rem' }}>Our Medical <span style={{ color: 'skyblue' }}>Professionals</span> </h1>

            </div>

            <div className='search-container'>
                <FaSearch style={{ marginRight: '2rem' }} />&nbsp;
                <input type="search" placeholder='Search doctors by name...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>


            <div className='doc-container'>

                {doctor.map((doc, index) => (

                    <div className='doc-box' key={index} style={{ height: '60rem' }}>

                        <img src={doc.profilePicture} alt="" />

                        <div className='content'>

                            <h1>{doc.doctorName}
                            </h1>
                            <p>{doc.doctorQualification}</p>
                            <p>{doc.aboutDoctor}</p>


                            <div className='button-container'>

                                {user?.role === "admin" ? <NavLink to={`/edit-doctor/${doc.id}`} style={{ padding: '1rem 3rem' }} className='btnEdit'>Edit</NavLink> : ""}
                                {user?.role === "admin" ? <button onClick={() => handle_remove(doc.id)} className='btnRemove'>Remove</button> : ""}

                            </div>

                        </div>

                    </div>

                ))}

            </div>


        </>
    )
}

export default ListDoctor

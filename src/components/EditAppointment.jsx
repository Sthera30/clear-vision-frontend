import React, { useEffect, useState } from 'react'
import '../css/updateAppointment.css'
import axios from 'axios';
import toast from 'react-hot-toast';
import { NavLink, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/userContext.jsx';

function EditAppointment() {

    const [data, setData] = useState({ appointmentDate: '', appointmentTime: '', appointmentType: '', reasonForVisit: '' })
    const [docTime, setDocTime] = useState([])
    const [dateTime, setDateTime] = useState([])

    const { user } = useUserContext()

    const { id } = useParams()

    const navigate = useNavigate();

    async function handle_fetch_appointment_by_id(id) {


        try {

            const res = await axios.get(`http://localhost:5000/getAppointmentById?id=${id}`)

            if (res.data.success) {
                setData(res.data.data.appointment)
                handle_fetch_appointment_availability_time_by_doc_name(res.data.data.appointment?.doctorName)
                handle_fetch_appointment_availability_date_by_doc_name(res.data.data.appointment?.doctorName)
            }

            else {
                toast.error(res.data.error)
            }

        } catch (error) {
            console.log(error);
        }

    }

    async function handle_fetch_appointment_availability_time_by_doc_name(doctorName) {

        try {

            const res = await axios.get(`http://localhost:5000/getDocAvailabilityTimeByDocName?doctorName=${doctorName}`)

            if (res.data.success) {
                setDocTime(res.data.data.docTimeSlot)
            }

            else {
                toast.error(res.data.error)
            }

        } catch (error) {
            console.log(error);
        }

    }

    async function handle_fetch_appointment_availability_date_by_doc_name(doctorName) {

        try {

            const res = await axios.get(`http://localhost:5000/getDoctorAvailabilityByName?doctorName=${doctorName}`)

            if (res.data.success) {
                setDateTime(res.data.data.doctorAvailability)
            }

            else {
                toast.error(res.data.error)
            }

        } catch (error) {
            console.log(error);

        }

    }

    async function handle_submit(e) {

        e.preventDefault()

        const { appointmentDate, appointmentTime } = data

        const formattedDate = new Date(appointmentDate)
            .toISOString()
            .split('T')[0];

        try {

            const res = await axios.put(`http://localhost:5000/updateAppointment/${id}`, {
                appointmentDate: formattedDate,
                appointmentTime,
                appointmentType: data?.appointmentType,
                reasonForVisit: data?.reasonForVisit
            })
            if (res.data.success) {
                toast.success(res.data.message)
                navigate("/my-appointments")

            }

            else {
                toast.error(res.data.error)
            }

        } catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {

        handle_fetch_appointment_by_id(id)

    }, [id])


    useEffect(() => {

        window.scrollTo(0, 0)

    }, [])

    return (
        <>

            <div className='editAppointment-container'>

                <h1>Reschedule Appointment</h1>

                <div className='editAppointment-inner'>

                    <h2>Current Appointment</h2>

                    <div className='current-appointment-container'>

                        <div className='appointment-row'>
                            <p className='label'>Reason For Visit:</p>
                            <p className='value'>{data?.reasonForVisit}</p>
                        </div>

                        <div className='appointment-row'>
                            <p className='label'>Doctor Name:</p>
                            <p className='value'>{data?.doctorName}</p>
                        </div>

                        <div className='appointment-row'>
                            <p className='label'>Appointment Date:</p>
                            <p className='value'>
                                {new Date(data?.appointmentDate).toLocaleDateString('en-US', {
                                    day: '2-digit',
                                    weekday: 'long',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>

                        <div className='appointment-row'>
                            <p className='label'>Appointment Time:</p>
                            <p className='value'>{data?.appointmentTime}</p>
                        </div>

                        <div className='appointment-row'>
                            <p className='label'>Appointment Type:</p>
                            <p className='value'>{data?.appointmentType}</p>
                        </div>

                    </div>

                    <form onSubmit={handle_submit}>

                        <label>New Date</label>

                        <select value={data?.appointmentDate} onChange={(e) => setData({ ...data, appointmentDate: e.target.value })}>

                            <option disabled>Select one</option>

                            {dateTime.map((appDate_, index) => (

                                <option key={index} value={new Date(appDate_?.Date).toISOString().split('T')[0]}>{new Date(appDate_?.Date).toLocaleDateString('en-US', {
                                    day: '2-digit',
                                    weekday: 'long',
                                    month: 'long',
                                    year: 'numeric'
                                })}</option>

                            ))}

                        </select>

                        <label>New Time</label>

                        <select value={data?.appointmentTime} onChange={(e) => setData({ ...data, appointmentTime: e.target.value })}>

                            {docTime.map((docTime_, index) => (

                                <option key={index}>{docTime_?.timeSlot}</option>

                            ))}

                        </select>

                        <div className='button-update-container'>

                            <NavLink to={`/my-appointments`} className='btnCancel'>Cancel</NavLink>
                            <button className='btnUpdateAppointment'>Update Appointment</button>

                        </div>

                    </form>

                </div>

            </div>

        </>
    )
}

export default EditAppointment

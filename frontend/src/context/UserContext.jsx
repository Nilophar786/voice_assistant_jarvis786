import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'
export const userDataContext=createContext()
function UserContext({children}) {
    const serverUrl="https://chatbot-voice-assistant-backend.onrender.com"
    const [userData,setUserData]=useState(null)
    const [frontendImage,setFrontendImage]=useState(null)
    const [backendImage,setBackendImage]=useState(null)
    const [selectedImage,setSelectedImage]=useState(null)
    const [tasks,setTasks]=useState([])
    const [notes,setNotes]=useState([])

    const handleCurrentUser=async ()=>{
        console.log("handleCurrentUser called");
        try {
            const result=await axios.get(`${serverUrl}/api/user/current`,{withCredentials:true})
            console.log("handleCurrentUser result:", result.data);
            setUserData(result.data)
            if(result.data.tasks) setTasks(result.data.tasks)
            if(result.data.notes) setNotes(result.data.notes)
        } catch (error) {
            console.log("handleCurrentUser error:", error)
            if (error.response && error.response.status === 400) {
                setUserData(null)
            }
        }
    }

    const getGeminiResponse=async (command)=>{
        console.log("getGeminiResponse called with command:", command);
        try {
          const result=await axios.post(`${serverUrl}/api/user/asktoassistant`,{command},{withCredentials:true})
          console.log("getGeminiResponse result:", result.data);
          return result.data
        } catch (error) {
          console.log("getGeminiResponse error:", error)
          return null;
        }
    }

    // New API methods for AI features
    const solveMath = async (expression) => {
        try {
            const result = await axios.post(`${serverUrl}/api/user/solve-math`, { expression }, { withCredentials: true });
            return result.data;
        } catch (error) {
            console.error("solveMath error:", error);
            return null;
        }
    };

    const convertCurrency = async (amount, from, to) => {
        try {
            const result = await axios.post(`${serverUrl}/api/user/convert-currency`, { amount, from, to }, { withCredentials: true });
            return result.data;
        } catch (error) {
            console.error("convertCurrency error:", error);
            return null;
        }
    };

    const searchWeb = async (query) => {
        try {
            const result = await axios.post(`${serverUrl}/api/user/search-web`, { query }, { withCredentials: true });
            return result.data;
        } catch (error) {
            console.error("searchWeb error:", error);
            return null;
        }
    };

    const getWikipediaSummary = async (query) => {
        try {
            const result = await axios.post(`${serverUrl}/api/user/wikipedia`, { query }, { withCredentials: true });
            return result.data;
        } catch (error) {
            console.error("getWikipediaSummary error:", error);
            return null;
        }
    };

    const getWeather = async (city) => {
        try {
            const result = await axios.post(`${serverUrl}/api/user/weather`, { city }, { withCredentials: true });
            return result.data;
        } catch (error) {
            console.error("getWeather error:", error);
            return null;
        }
    };

    const getJoke = async () => {
        try {
            const result = await axios.post(`${serverUrl}/api/user/joke`, {}, { withCredentials: true });
            return result.data;
        } catch (error) {
            console.error("getJoke error:", error);
            return null;
        }
    };

    const getQuote = async () => {
        try {
            const result = await axios.post(`${serverUrl}/api/user/quote`, {}, { withCredentials: true });
            return result.data;
        } catch (error) {
            console.error("getQuote error:", error);
            return null;
        }
    };

    // Productivity methods
    const addTask = async (task) => {
        try {
            const result = await axios.post(`${serverUrl}/api/user/tasks/add`, { task }, { withCredentials: true });
            setTasks(prev => [...prev, result.data]);
            return result.data;
        } catch (error) {
            console.error("addTask error:", error);
            return null;
        }
    };

    const getTasks = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/user/tasks`, { withCredentials: true });
            setTasks(result.data);
            return result.data;
        } catch (error) {
            console.error("getTasks error:", error);
            return [];
        }
    };

    const deleteTask = async (taskId) => {
        try {
            await axios.post(`${serverUrl}/api/user/tasks/delete`, { taskId }, { withCredentials: true });
            setTasks(prev => prev.filter(task => task._id !== taskId));
            return true;
        } catch (error) {
            console.error("deleteTask error:", error);
            return false;
        }
    };

    const addNote = async (note) => {
        try {
            const result = await axios.post(`${serverUrl}/api/user/notes/add`, { note }, { withCredentials: true });
            setNotes(prev => [...prev, result.data]);
            return result.data;
        } catch (error) {
            console.error("addNote error:", error);
            return null;
        }
    };

    const getNotes = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/user/notes`, { withCredentials: true });
            setNotes(result.data);
            return result.data;
        } catch (error) {
            console.error("getNotes error:", error);
            return [];
        }
    };

    useEffect(()=>{
        handleCurrentUser()
    },[])

    const value={
        serverUrl,
        userData,
        setUserData,
        backendImage,
        setBackendImage,
        frontendImage,
        setFrontendImage,
        selectedImage,
        setSelectedImage,
        tasks,
        setTasks,
        notes,
        setNotes,
        getGeminiResponse,
        handleCurrentUser,
        solveMath,
        convertCurrency,
        searchWeb,
        getWikipediaSummary,
        getWeather,
        getJoke,
        getQuote,
        addTask,
        getTasks,
        deleteTask,
        addNote,
        getNotes
    }
  return (
    <div>
    <userDataContext.Provider value={value}>
      {children}
      </userDataContext.Provider>
    </div>
  )
}

export default UserContext

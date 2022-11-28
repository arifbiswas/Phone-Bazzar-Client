import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useContext } from 'react';
import toast from 'react-hot-toast';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../../ContextApi/AuthProvider';
import PageLoading from '../../../Shared/PageLoading/PageLoading';


const Dashboard = () => {
    const navigate = useNavigate()
    const {user,loading , setLoading} = useContext(AuthContext);
    // const [keepUser , setKeepUser] = useState({})
    // console.log(user);

    if(!user.userRole && !user.verifiedUser){
      setLoading(true)
      axios.get(`http://localhost:5000/dbUser?email=${user?.email}`).then(res => {
        // console.log(res.data);
        user.userRole = res.data.role ;
        user.verifiedUser = res.data.verified ;
        // setKeepUser({userRole : res.data.role ,verifiedUser : res.data.verified})
        setLoading(false)
      //   console.log( res.data);
    }).catch(e=>{
        console.log(e)
        setLoading(false)
    
        
    })
    }
    const {data : unverifiedUsers,refetch} = useQuery({
        queryKey : ["unverifiedUsers"],
        queryFn : ()=>axios.get("http://localhost:5000/unverified").then(res=>{
            // console.log(res.data);
            if(!res.data){
              navigate("/")
            }
            setLoading(false)
            return res.data;
        }).catch(e =>{
          
            console.log(e);
        })
    })
   
    
    
    const handleVerified =(id)=>{
        // console.log(id);
        setLoading(true)
        axios.patch(`http://localhost:5000/verified/${id}`).then(res => {
            // console.log(res.data);
            if(res.data){
                toast.success("Verified")
                refetch()
                setLoading(false)
            }
        }).catch(e =>{
            console.log(e);
        })
    }
    const handleDelete =(id)=>{
      setLoading(true)
        // console.log(id);
        const confirm = window.confirm("Are you 'Delete' this User ? remember one think if you delete this User can not undo")
        if(confirm){
          axios.delete(`http://localhost:5000/users/${id}`).then(res => {
            console.log(res.data);
            refetch()
            if(res.data.deletedCount > 0){
                toast.success("Deleted")
                setLoading(false)
            }
        }).catch(e =>{
            console.log(e);
        })
        }else{
          setLoading(false)
        }
    }

    if(loading){
        return <PageLoading></PageLoading>
    }

    // console.log(keepUser);

    return (
        <div className="">
            {
                user?.userRole === "admin" && <div className='mx-5'>
                
        <h1 className="text-3xl my-5 font-bold text-primary mx-3">Unverified Users</h1>
        <div>
          <div className="w-full shadow-md sm:rounded-lg overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 ">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
                <tr>
                  
                  <th scope="col" className="w-24 p-5 h-16 ">
                    User Name
                  </th>
               
                  <th scope="col" className="w-24 p-5 h-16 ">
                    User Email
                  </th>
                  <th scope="col" className="w-24 p-5 h-16 ">
                    User Role
                  </th>
                  <th scope="col" className="w-24 p-5 h-16 ">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {unverifiedUsers &&
                  unverifiedUsers.map((user) => (
                    <tr key={user._id} className="bg-white border-b  ">
                      <th
                        scope="row"
                        className="w-24 p-5 h-16  font-medium text-gray-900 whitespace-nowrap "
                      >
                        {user?.name}
                      </th>
                      <td className="w-24 p-5 h-16 "> {user?.email}</td>
                      <td className="w-24 p-5 h-16 "> {user?.role}</td>
                    
                     
                      <td className="flex w-24 p-5 h-16 ">
                        {
                          user?.verified ? "Verified" :<button onClick={()=>handleVerified(user._id)} className="btn btn-sm btn-primary">
                          Verify
                        </button>
                        }
                        <button onClick={()=>handleDelete(user._id)} className='btn btn-sm btn-error ml-2'>Delete</button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        </div>}

        {
            user?.userRole === "buyer" && <Navigate to="/dashboard/myBooked"></Navigate>
        }
        {
            user?.userRole === "seller" && <Navigate to="/dashboard/myProducts"></Navigate>
        }

      </div>
    );
};

export default Dashboard;
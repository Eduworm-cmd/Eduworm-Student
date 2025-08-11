import { apiService } from "./apiService"

export const authApi = {
    login : (credentials) => {
        return apiService.post('superStudent/student-login', credentials);
    }
}

export const getStudentById =(id)=>{
    return apiService.get(`superStudent/ById/${id}`);
}
export const getEvents =(id)=>{
    return apiService.get(`event/${id}`);
}

export const classByBranch  = (branchId) =>{
   return apiService.get(`class/${branchId}`);
}
export const allTimeTable  = (branchId,classId) =>{   
   return apiService.get(`timetable/${branchId}/${classId}`);
}

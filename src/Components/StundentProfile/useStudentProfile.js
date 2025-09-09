import { useEffect, useState } from "react";
import { apiService } from "../../api/apiService";

export const useStudentProfile = (student) => {
    const [attendanceData, setAttendanceData] = useState(null);
    const [loading, setLoading] = useState(true);

    const studentId = student?._id;
    const branchId = student?.schoolBranch?._id;

    const fetchStudentAttendance = async () => {
        if (!studentId || !branchId) {
            return;
        }


        try {
            const response = await apiService.get(
                `superStudent/attendance-all/branch/${branchId}/student/${studentId}/year/2025`
            );

            if (response.success) {
                setAttendanceData(response?.data?.attendanceStats || null);
            }
        } catch (error) {
            console.error("Error fetching attendance:", error);
        } finally {
        }
    };

    useEffect(() => {
        fetchStudentAttendance();
    }, [studentId, branchId]);

    return { loading, setLoading, attendanceData, refresh: fetchStudentAttendance };
};

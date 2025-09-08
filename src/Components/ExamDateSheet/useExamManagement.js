import { useCallback, useEffect, useState } from "react";
import { getStudentById } from "../../api/AllApis";
import { apiService } from "../../api/apiService";

export const useExamManagement = (user) => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchExams = useCallback(async () => {
        if (!user?.studentId) return;

        try {
            setLoading(true);
            setError(null);

            const classRes = await getStudentById(user.studentId);
            const classId = classRes?.data?.student?.class?._id;

            if (!classId) {
                throw new Error("Class ID not found");
            }

            const examRes = await apiService.get(
                `/datesheet/${user.branchId}/${classId}`
            );
            setExams(examRes.data?.data || []);
        } catch (err) {
            console.error("Error fetching exams:", err);
            setError(err.message || "Failed to load exam data");
        } finally {
            setLoading(false);
        }
    }, [user?.studentId, user?.branchId]);

    useEffect(() => {
        fetchExams();
    }, [fetchExams]);

    return { exams, loading, error, refetch: fetchExams };
};


export const useReminderSystem = () => {
    const [reminders, setReminders] = useState([]);

    const setReminder = useCallback(async (examData, reminderDate) => {
        try {
            const reminder = {
                id: Date.now(),
                examId: examData._id,
                subject: examData.subject,
                examDate: examData.date,
                reminderDate: reminderDate,
                createdAt: new Date(),
                status: "active",
            };

            setReminders((prev) => [...prev, reminder]);

            console.log("Reminder set:", reminder);

            return { success: true, reminder };
        } catch (error) {
            console.error("Error setting reminder:", error);
            return { success: false, error: error.message };
        }
    }, []);

    const removeReminder = useCallback((reminderId) => {
        setReminders((prev) => prev.filter((r) => r.id !== reminderId));
    }, []);

    return {
        reminders,
        setReminder,
        removeReminder,
    };
};


export const useCalendarLogic = (examDate) => {

    const [selectedReminderDate, setSelectedReminderDate] = useState(null);

    const generateCalendarDays = useCallback(
        (calendarDate, examDate) => {
            if (!examDate) return [];

            const exam = new Date(examDate);
            const today = new Date();

            const normalizeDate = (date) =>
                new Date(date.getFullYear(), date.getMonth(), date.getDate());

            const normalizedToday = normalizeDate(today);
            const normalizedExamDate = normalizeDate(exam);

            const year = calendarDate.getFullYear();
            const month = calendarDate.getMonth();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const firstDay = new Date(year, month, 1).getDay();

            const days = [];

            for (let i = 0; i < firstDay; i++) {
                days.push({
                    day: null,
                    disabled: true,
                    isToday: false,
                    isExamDate: false,
                    isSelected: false,
                });
            }

            for (let day = 1; day <= daysInMonth; day++) {
                const currentDate = new Date(year, month, day);
                const normalizedCurrent = normalizeDate(currentDate);

                const isToday =
                    normalizedCurrent.getTime() === normalizedToday.getTime();
                const isExamDate =
                    normalizedCurrent.getTime() === normalizedExamDate.getTime();
                const isSelected =
                    selectedReminderDate &&
                    normalizedCurrent.getTime() ===
                    normalizeDate(selectedReminderDate).getTime();

                const isSelectable =
                    normalizedCurrent >= normalizedToday &&
                    normalizedCurrent <= normalizedExamDate;

                days.push({
                    day,
                    disabled: !isSelectable,
                    isToday,
                    isExamDate,
                    isSelected,
                    date: new Date(year, month, day),
                });
            }

            return days;
        },
        [selectedReminderDate]
    );

    const selectDate = useCallback((day, disabled, date) => {
        if (disabled || !day || !date) return;

        setSelectedReminderDate(new Date(date));
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedReminderDate(null);
    }, []);

    return {
        selectedReminderDate,
        generateCalendarDays,
        selectDate,
        clearSelection,
    };
};
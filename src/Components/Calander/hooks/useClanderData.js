import { useState, useEffect, useRef, useCallback } from 'react';
import { apiService } from '../../../api/apiService';

export const useCalendarData = (branchId) => {
  const [calendarData, setCalendarData] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [initialLoading, setInitialLoading] = useState(true);
  const [monthLoading, setMonthLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const calendarCache = useRef(new Map());
  const isFirstLoad = useRef(true);

  const fetchCalendarData = useCallback(async (date = currentDate) => {
    try {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const cacheKey = `${year}-${month}`;

      if (calendarCache.current.has(cacheKey)) {
        setCalendarData(calendarCache.current.get(cacheKey));
        if (isFirstLoad.current) {
          setInitialLoading(false);
          isFirstLoad.current = false;
        }
        setMonthLoading(false);
        return;
      }

      // Set appropriate loading state
      if (isFirstLoad.current) {
        setInitialLoading(true);
      } else {
        setMonthLoading(true);
      }
      
      setError(null);

      const response = await apiService.get(
        `attendance/calendar/${branchId}/${year}/${month}`,
      );

      // Cache the response
      calendarCache.current.set(cacheKey, response.data);
      setCalendarData(response.data);
      
    } catch (err) {
      setError('Failed to load calendar data');
      console.error('Calendar API Error:', err);
    } finally {
      if (isFirstLoad.current) {
        setInitialLoading(false);
        isFirstLoad.current = false;
      }
      setMonthLoading(false);
    }
  }, [branchId, currentDate]);

  const navigateMonth = useCallback((direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
    
    fetchCalendarData(newDate);
  }, [currentDate, fetchCalendarData]);

  const retry = useCallback(() => {
    fetchCalendarData();
  }, [fetchCalendarData]);

  const clearCache = useCallback(() => {
    calendarCache.current.clear();
  }, []);

  const getCachedMonths = useCallback(() => {
    return Array.from(calendarCache.current.keys());
  }, []);

  useEffect(() => {
    if (branchId) {
      fetchCalendarData();
    }
  }, [branchId, fetchCalendarData]);

  const getDaysUntilHoliday = useCallback((dateStr) => {
    const holidayDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = holidayDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, []);

  const formatDate = useCallback((dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  const getHolidays = useCallback((currentSchoolId) => {
    if (!calendarData) return [];
    
    return (calendarData?.calendar || [])
      .filter(
        (day) =>
          day.isHoliday &&
          (!day.holidayInfo?.schoolId ||
            day.holidayInfo?.schoolId === currentSchoolId),
      )
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [calendarData]);

  const getUpcomingHolidays = useCallback((currentSchoolId) => {
    const holidays = getHolidays(currentSchoolId);
    return holidays.filter(
      (holiday) => getDaysUntilHoliday(holiday.date) > 0
    );
  }, [getHolidays, getDaysUntilHoliday]);

  const getStats = useCallback((currentSchoolId) => {
    return {
      totalHolidays: calendarData?.monthInfo?.holidays || 0,
      totalDays: calendarData?.monthInfo?.totalDays || 0,
      upcomingHolidays: getUpcomingHolidays(currentSchoolId).length,
    };
  }, [calendarData, getUpcomingHolidays]);

  const preloadAdjacentMonths = useCallback(async () => {
    const prevMonth = new Date(currentDate);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const prevKey = `${prevMonth.getFullYear()}-${prevMonth.getMonth() + 1}`;
    if (!calendarCache.current.has(prevKey)) {
      try {
        const prevResponse = await apiService.get(
          `attendance/calendar/${branchId}/${prevMonth.getFullYear()}/${prevMonth.getMonth() + 1}`,
        );
        calendarCache.current.set(prevKey, prevResponse.data);
      } catch (err) {
        console.warn('Failed to preload previous month:', err);
      }
    }

    const nextKey = `${nextMonth.getFullYear()}-${nextMonth.getMonth() + 1}`;
    if (!calendarCache.current.has(nextKey)) {
      try {
        const nextResponse = await apiService.get(
          `attendance/calendar/${branchId}/${nextMonth.getFullYear()}/${nextMonth.getMonth() + 1}`,
        );
        calendarCache.current.set(nextKey, nextResponse.data);
      } catch (err) {
        console.warn('Failed to preload next month:', err);
      }
    }
  }, [branchId, currentDate]);

  useEffect(() => {
    if (calendarData && !monthLoading && !initialLoading) {
      const timer = setTimeout(preloadAdjacentMonths, 1000);
      return () => clearTimeout(timer);
    }
  }, [calendarData, monthLoading, initialLoading, preloadAdjacentMonths]);

  return {
    // State
    calendarData,
    currentDate,
    initialLoading,
    monthLoading,
    error,
    
    // Actions
    navigateMonth,
    retry,
    clearCache,
    setCurrentDate,
    
    // Utilities
    getDaysUntilHoliday,
    formatDate,
    getHolidays,
    getUpcomingHolidays,
    getStats,
    getCachedMonths,
    
    // Cache info
    cacheSize: calendarCache.current.size,
    isCached: (date) => {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const cacheKey = `${year}-${month}`;
      return calendarCache.current.has(cacheKey);
    }
  };
};
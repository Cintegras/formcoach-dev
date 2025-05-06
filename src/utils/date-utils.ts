/**
 * Utility functions for date operations
 */

/**
 * Calculate age from birthdate
 * @param birthdate - Birthdate as string or Date object
 * @returns Age in years
 */
export const calculateAge = (birthdate: string | Date): number => {
    const birth = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
};
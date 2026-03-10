export * from './types'
export { salonReducer } from './reducer'
export { getSalon, getSalonSaga } from './getSalon'
export { createSalon, createSalonSaga } from './createSalon'
export { getCategories, getCategoriesSaga } from './getCategories'
export { updateSalonProfile, updateOperatingHours, updateSalonProfileSaga, updateOperatingHoursSaga } from './updateProfile'
export { salonSaga } from './salonSaga'

// Clear actions
export const clearSuccess = () => ({ type: 'CLEAR_SUCCESS' as const })
export const clearUpdateError = () => ({ type: 'CLEAR_UPDATE_ERROR' as const })
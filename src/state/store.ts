import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { userReducer } from './user'
import { salonReducer } from './salon'
import { staffReducer } from './staff'
import { serviceReducer } from './service'
import { branchReducer } from './branch'
import { appointmentReducer } from './appointment'
import { vacancyReducer } from './vacancies'
import { settingsReducer } from './settings/reducer'
import { billingReducer } from './billing'
import { feedReducer } from './feed'
import { storyReducer } from './story'
import { promotionReducer } from './promotion'
import { authReducer } from './auth/auth.reducer'
import { rootSaga } from './rootSaga'
import type { UserState, UserAction } from './user'
import type { SalonState } from './salon'
import type { StaffState } from './staff'
import type { ServiceState } from './service'
import type { BranchState } from './branch'
import type { AppointmentState } from './appointment'
import type { VacancyState } from './vacancies'
import type { SettingsState } from './settings/types'
import type { BillingState } from './billing'
import type { FeedState } from './feed'
import type { StoryState } from './story'
import type { PromotionState } from './promotion'

export interface RootState {
  auth: import('./auth/types').AuthState
  user: UserState
  salon: SalonState
  staff: StaffState
  service: ServiceState
  branch: BranchState
  appointment: AppointmentState
  vacancies: VacancyState
  settings: SettingsState
  billing: BillingState
  feed: FeedState
  story: StoryState
  promotion: PromotionState
}

// Extend Window interface to include Redux DevTools
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose
    __REDUX_DEVTOOLS_EXTENSION__?: (options?: any) => (next: any) => any
  }
}

const sagaMiddleware = createSagaMiddleware()

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  salon: salonReducer,
  staff: staffReducer,
  service: serviceReducer,
  branch: branchReducer,
  appointment: appointmentReducer,
  vacancies: vacancyReducer,
  settings: settingsReducer,
  billing: billingReducer,
  feed: feedReducer,
  story: storyReducer,
  promotion: promotionReducer,
}) as any

// Use Redux DevTools extension if available in development
const composeEnhancers =
  (typeof window !== 'undefined' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
)

sagaMiddleware.run(rootSaga)

export type AppDispatch = typeof store.dispatch
export default store

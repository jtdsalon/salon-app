import { fork } from 'redux-saga/effects'
import authSaga from './auth/authSaga'
import { userSaga } from './user'
import { salonSaga } from './salon'
import { staffSaga } from './staff'
import { serviceSaga } from './service'
import { branchSaga } from './branch/saga'
import { appointmentSaga } from './appointment'
import { vacancySaga } from './vacancies'
import { settingsSaga } from './settings/settingsSaga'
import { billingSaga } from './billing'
import { feedSaga } from './feed'
import { storySaga } from './story'
import { promotionSaga } from './promotion'

export function* rootSaga() {
  yield fork(authSaga)
  yield fork(userSaga)
  yield fork(salonSaga)
  yield fork(staffSaga)
  yield fork(serviceSaga)
  yield fork(branchSaga)
  yield fork(appointmentSaga)
  yield fork(vacancySaga)
  yield fork(settingsSaga)
  yield fork(billingSaga)
  yield fork(feedSaga)
  yield fork(storySaga)
  yield fork(promotionSaga)
}

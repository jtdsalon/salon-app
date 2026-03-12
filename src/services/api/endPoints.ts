// Auth API Endpoints
export const LOGIN_URL = '/auth/login'
export const REGISTER_URL = '/auth/register'
export const REFRESH_TOKEN_URL = '/auth/refresh'
export const LOGOUT_URL = '/auth/logout'
export const VERIFY_URL = '/auth/verify'
export const FORGOT_PASSWORD_URL = '/auth/forgot-password'
export const RESET_PASSWORD_URL = '/auth/reset-password'
export const SEND_VERIFICATION_EMAIL_URL = '/auth/send-verification-email'

// User API Endpoints
export const SEARCH_USERS_URL = '/users/search'
export const GET_FOLLOWERS_URL = '/users/{userid}/followers'
export const GET_FOLLOWING_URL = '/users/{userid}/following'
export const FOLLOW_USER_URL = '/users/{userid}/follow'
export const UNFOLLOW_USER_URL = '/users/{userid}/follow'
export const GET_USER_URL = '/users/{userid}'
export const ADD_USER_URL = '/users'
export const UPDATE_USER_URL = '/users/{userid}'
export const GET_ALL_USERS_URL = '/users'
export const GET_PAGINATED_USERS_URL = '/users'
export const DELETE_USER_URL = '/users/{userid}'

// Salon API Endpoints
export const GET_SALONS_URL = '/salons'
export const GET_SALON_CATEGORIES_URL = '/salons/categories'
export const GET_SALON_DETAIL_URL = '/salons/{salonId}'
export const FOLLOW_PAGE_URL = '/pages/{pageId}/follow'
export const UNFOLLOW_PAGE_URL = '/pages/{pageId}/follow'
export const GET_SALON_SERVICES_URL = '/services/salon/{salonId}'
export const GET_SALON_REVIEWS_URL = '/reviews/salon/{salonId}'
export const REPLY_TO_REVIEW_URL = '/reviews/{reviewId}/reply'
export const SEARCH_SALONS_URL = '/salons/search'

// Staff API Endpoints
export const GET_STAFF_URL = '/staff/salon/{salonId}'
export const GET_STAFF_BY_ID_URL = '/staff/{id}'
export const GET_STAFF_STATS_URL = '/staff/{id}/stats'
export const CREATE_STAFF_URL = '/staff'
export const UPDATE_STAFF_URL = '/staff/{id}'
export const DELETE_STAFF_URL = '/staff/{id}'

// Service API Endpoints
export const GET_SERVICES_URL = '/services/salon/{salonId}'
export const GET_SERVICE_BY_ID_URL = '/services/{id}'
export const CREATE_SERVICE_URL = '/services'
export const UPDATE_SERVICE_URL = '/services/{id}'
export const DELETE_SERVICE_URL = '/services/{id}'

// Appointment/Booking API Endpoints
export const GET_MY_APPOINTMENTS_URL = '/bookings/my-bookings'
export const GET_SALON_APPOINTMENTS_LIST_URL = '/bookings/salon/{salonId}/list'
export const GET_APPOINTMENT_BY_ID_URL = '/bookings/{id}'
export const GET_SALON_APPOINTMENTS_URL = '/bookings/salon/{salonId}'
export const CREATE_APPOINTMENT_URL = '/bookings'
export const UPDATE_APPOINTMENT_STATUS_URL = '/bookings/{id}/status'
export const CANCEL_APPOINTMENT_URL = '/bookings/{id}/cancel'

// Customer API Endpoints
export const GET_SALON_CUSTOMERS_URL = '/bookings/salon/{salonId}/customers'

// Vacancies API Endpoints
export const GET_VACANCIES_URL = '/vacancies/salon/{salonId}'
export const GET_VACANCY_BY_ID_URL = '/vacancies/{id}'
export const CREATE_VACANCY_URL = '/vacancies'
export const UPDATE_VACANCY_URL = '/vacancies/{id}'
export const DELETE_VACANCY_URL = '/vacancies/{id}'

// Payment/Billing API Endpoints
export const GET_MY_PAYMENTS_URL = '/payments/my-payments'
export const GET_PAYMENT_BY_ID_URL = '/payments/{id}'
export const CREATE_PAYMENT_URL = '/payments'
export const PROCESS_PAYMENT_URL = '/payments/{id}/process'

// Feed / Posts
export const GET_POSTS_URL = '/posts'
export const GET_FAVOURITES_FEED_URL = '/posts/favourites'
export const GET_PUBLIC_FEED_URL = '/posts/public'
export const GET_POST_URL = '/posts/{postId}'
export const CREATE_POST_URL = '/posts'
export const UPDATE_POST_URL = '/posts/{postId}'
export const DELETE_POST_URL = '/posts/{postId}'
export const UPLOAD_POST_IMAGE_URL = '/posts/upload-image'
export const TOGGLE_POST_LIKE_URL = '/posts/{postId}/like'
export const TOGGLE_POST_SAVE_URL = '/posts/{postId}/save'
export const GET_POST_LIKERS_URL = '/posts/{postId}/likers'
export const GET_POST_COMMENT_LIKERS_URL = '/posts/{postId}/comments/{commentId}/likers'
export const ADD_POST_COMMENT_URL = '/posts/{postId}/comments'
export const UPDATE_POST_COMMENT_URL = '/posts/{postId}/comments/{commentId}'
export const DELETE_POST_COMMENT_URL = '/posts/{postId}/comments/{commentId}'
export const TOGGLE_POST_COMMENT_LIKE_URL = '/posts/{postId}/comments/{commentId}/like'

// Feed Insights / Analytics
export const GET_INSIGHTS_URL = '/posts/insights'

// Analytics / Dashboard
export const GET_DASHBOARD_STATS_URL = '/analytics/salon/{salonId}/dashboard'

// Notifications
export const GET_NOTIFICATIONS_URL = '/notifications'
export const GET_NOTIFICATIONS_UNREAD_COUNT_URL = '/notifications/unread-count'
export const MARK_NOTIFICATION_READ_URL = '/notifications/{id}/read'
export const MARK_ALL_NOTIFICATIONS_READ_URL = '/notifications/read-all'
export const DELETE_NOTIFICATION_URL = '/notifications/{id}'
export const CLEAR_ALL_NOTIFICATIONS_URL = '/notifications'

// Subscriptions
export const GET_SUBSCRIPTION_PLANS_URL = '/subscriptions/plans'
export const GET_SUBSCRIPTION_CURRENT_URL = '/subscriptions/current'
export const CREATE_OR_UPGRADE_SUBSCRIPTION_URL = '/subscriptions'
export const UPDATE_SUBSCRIPTION_URL = '/subscriptions/{id}'
export const GET_SUBSCRIPTION_PAYMENTS_URL = '/subscriptions/payments'
export const DISMISS_SUBSCRIPTION_BANNER_URL = '/subscriptions/notifications/{type}/dismiss'

// Promotions
export const GET_PROMOTIONS_TYPES_URL = '/promotions/types'
export const GET_PROMOTIONS_BY_SALON_URL = '/promotions/salon/{salonId}'
export const GET_PROMOTION_ACTIVE_BY_SALON_URL = '/promotions/salon/{salonId}/active'
export const GET_PROMOTION_BY_ID_URL = '/promotions/{id}'
export const CREATE_PROMOTION_URL = '/promotions'
export const UPDATE_PROMOTION_URL = '/promotions/{id}'
export const DELETE_PROMOTION_URL = '/promotions/{id}'
export const GET_PROMOTION_ANALYTICS_URL = '/promotions/{id}/analytics'
export const GET_SALON_PROMOTION_ANALYTICS_URL = '/promotions/salon/{salonId}/analytics'
export const GET_SALON_PROMOTION_ANALYTICS_DASHBOARD_URL = '/promotions/salon/{salonId}/analytics/dashboard'

// Stories
export const GET_STORIES_URL = '/stories'
export const GET_STORY_URL = '/stories/{storyId}'
export const CREATE_STORY_URL = '/stories'
export const DELETE_STORY_URL = '/stories/{storyId}'
export const UPLOAD_STORY_IMAGE_URL = '/stories/upload-image'

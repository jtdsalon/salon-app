export const FEED_STRINGS = {
  view: {
    style: 'Style',
    lookbook: 'Lookbook',
    subtitle: 'Visual inspiration from our community',
    tabFavorites: 'FAVORITES',
    tabPublic: 'PUBLIC',
    tabInsights: 'INSIGHTS',
    createEntry: 'Create Entry',
    createMasterpiece: 'Create Masterpiece',
    noFavoritesArchived: 'NO FAVORITES ARCHIVED YET.',
    noPublicEntriesFound: 'NO PUBLIC ENTRIES FOUND.',
  },

  postHeader: {
    favourite: ' FAVOURITE',
    public: ' PUBLIC',
    insights: ' INSIGHTS',
    editMasterpiece: 'Edit Masterpiece',
    removeEntry: 'Remove Entry',
    shareAesthetic: 'Share Aesthetic',
    repostAesthetic: 'Repost Aesthetic',
  },

  composer: {
    editEntry: 'Edit Lookbook Entry',
    newEntry: 'New Lookbook Entry',
    update: 'UPDATE',
    publish: 'PUBLISH',
    updateButton: 'Update',
    publishButton: 'Publish',
    captionPlaceholder: 'Describe the aesthetic...',
    finalResult: 'Final Result',
    before: 'Before',
    metamorphosisMode: 'Metamorphosis Mode',
    discard: 'Discard',
  },

  story: {
    glowRituals: 'Glow Rituals',
    addRitual: 'ADD RITUAL',
    shareRitual: 'Share Your Ritual',
    uploading: 'Uploading...',
    tapToAddImage: 'Tap to add image',
    ritualTitle: 'Ritual Title',
    ritualTitlePlaceholder: 'e.g. Morning Glow',
    postRitual: 'POST RITUAL',
  },

  expandableText: {
    less: ' LESS',
    readMore: ' READ MORE',
  },

  comments: {
    joinToContribute: 'JOIN THE ARCHIVE TO CONTRIBUTE.',
    contributePlaceholder: 'Contribute...',
    cancelEdit: 'Cancel Edit',
  },

  actions: {
    glows: 'GLOWS',
    curations: 'CURATIONS',
    reposts: 'REPOSTS',
  },

  common: {
    justNow: 'Just now',
    anonymous: 'Anonymous',
    cancel: 'Cancel',
    repost: 'Repost',
  },

  repost: {
    confirmTitle: 'Repost Aesthetic?',
    confirmDescription: 'This will share this lookbook entry to your feed.',
  },

  insights: {
    totalAudience: 'TOTAL AUDIENCE',
    engagementStatus: 'Healthy',
    avgEngagement: 'AVG ENGAGEMENT',
    growthTrajectory: 'Growth Trajectory',
    dailyReachImpressions: 'Daily reach impressions',
    yieldIncreasingTooltip: 'Yield is increasing consistently',
    chartDays: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    topMasterpieces: 'Top Masterpieces',
    untitled: 'Untitled',
    noMasterpiecesYet: 'No masterpieces yet. Create your first entry to see insights.',
    loading: 'Loading insights...',
    errorLoading: 'Unable to load insights. Please try again.',
    retry: 'Retry',
  },
};

export const FEED_LOCALES: Record<string, typeof FEED_STRINGS> = {
  en: FEED_STRINGS,
};

let currentLocale = 'en';

export function setFeedLocale(locale: string) {
  if (FEED_LOCALES[locale]) currentLocale = locale;
}

export function getFeedStrings(locale?: string) {
  const key = locale || currentLocale || 'en';
  return FEED_LOCALES[key] || FEED_STRINGS;
}

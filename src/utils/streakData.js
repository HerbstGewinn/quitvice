// Mock data for streaks
export const streakTypes = {
  SMOKING: 'smoking',
  DRINKING: 'drinking',
  PORN: 'porn'
};

export const streakGoals = {
  [streakTypes.SMOKING]: [30, 66, 99],
  [streakTypes.DRINKING]: [30, 66, 99],
  [streakTypes.PORN]: [30, 66, 99]
};

export const streakData = {
  [streakTypes.SMOKING]: {
    currentStreak: 18,
    goal: 30,
    backgroundImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxDFku5EC0mxoMYB-z_EEtcsTg3NxBYnHQslokxHrBKQkHhtQ1I1dZ4Zu9HVfYPIONQQtYOanmNKQ3K12GNfNQsLqJntyVVrQy1zsAE9BEJbmB_t5uClTbR3R7FEeY1NTFlCGjfNFVVmqlX6cnlYiVDnyLihL-Dgyp_wEh3tXmLsHBGfUvnShpSLRlp5PnSsqabMHidzk_BraJ16HoRPq6WVL6sGw_ZDhapdff7grIUJMaiElothOzOS_kMBpJ9g4AXpSsmAI_AUw',
    encouragement: "You're doing great! Keep it up.",
    progress: 40,
    attemptHistory: [12, 8, 15, 22, 18]
  },
  [streakTypes.DRINKING]: {
    currentStreak: 22,
    goal: 30,
    backgroundImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCza7q3xZoE8z-E2zYn97U80MCXEwK7oruHwdcVoVjSVm5lqSOsh86jnwAXMtH3aEj_vwXgyg2vkne5r9Hsd5T8sWYKPhI0wHByQVLGeWHZHJJfzLqepxdCC-zdFAAfpf-LGzk_OvHK7CSuhNkts0l5oR9FDNXnPOWgoKnlhwFasswQlDosS-TDw5ZLbSn4yWxGKF2XssgWW0rfibd_eaC7mpykVlVzBaxqod9GFuhOgVxB9G6_yuV92ib1ThZ597uQ__z5WsiFm0Q',
    encouragement: "Almost there! Stay strong.",
    progress: 73,
    attemptHistory: [18, 25, 12, 30, 22]
  },
  [streakTypes.PORN]: {
    currentStreak: 15,
    goal: 30,
    backgroundImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAX-BiGcyeDmWa2tmdC3n1ChbqlnbwFAz3C6YbKUS66vVJ661kZImCiHQCf9n9kmxzDFHYXLOGtg_M60xQGQiRkghckCu4wSsqHbyvdLKvjKm_ndb7d0iLGBGbhkT9ps6ZWkoqljnN7clwU4TaDVmjbFk23oAhqZKRPb97HdIiUJimMnbgIOcE5Aqj5Xnqt9U6xeIitrbVE5qbzlIcM9PteynGHrexbXT3AxyqBHtybTZFBtcGRsGxjnXnnH6bY_MjHjzd450unzA0',
    encouragement: "You're making progress! Keep going.",
    progress: 50,
    attemptHistory: [8, 12, 20, 15, 15]
  }
};

export const motivationalQuotes = [
  {
    text: '"The only way to do great work is to love what you do." - Steve Jobs',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlqF2Byb-ei3zgNu45F_3USYf8G3qm2Pt9sqhsC8HeA-nEA9E0S4-6tE2q855wXKkp9aRrbp59_a11ZHUGK2A0o6d6FegHZZU5OKM6ozYNhv1Rlc4gtkIC9-HWgnpMkB3m0-OyUCgAkwVevOjg1TL8gvJeqqz-5ulC--MObvTHyGBA455XwYxJNnbM9LrZO23wzHoWlFRqwEgr3Pv4iqkpaK7EXpZCeK7YHPc46fl3y-BOQUtm1VZkMLdai-DD9wyl264e5LhZWB8'
  },
  {
    text: '"The mind is everything. What you think you become." - Buddha',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBX3ZwCLie7AhSA42On8_lC3aRsGAZRCNes74qC7EqxtweSsYX5KWftqnFUMPtaP733iao2n498g6I8PYH2_L1OcBaJSu1f8svq9NGLuXNbMwCm6sY47x1OKc-kTtzK3In-tMKSzuLp-Ku6144cwOepqN2YVQPGfqrRyydF23FIiw2e6koGl4-tVPtVw6dCjQ5kQTwkP8ZLer_UlFHvE_BdXM0wQ42udLNGdJjY3MFlCQqTCxsek8I97ig06dAnGNQQJ78NqK4P300'
  },
  {
    text: '"Believe you can and you\'re halfway there." - Theodore Roosevelt',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBzzaurXYcD9ZS40TVKeXz1af8puQuOCu6LjzX7fNskXUEZ12oqN0jPMA3-6yReG9vTdtZOk2YWLOTp0kZ3hnuINNVmlD3Rde2MPdoAripTitQO1fa7HPR6n8z2YD9WE-X7xz-WpyQY2JLWRqaHtKGR7phd7KH-2RLeQKLlrfreU71244B2ZRknfDX3H7dKmCQiW43AyTj-eiIlWP3MpBqOUXfaX212NPJe94LNpY3UqO1E5QFmBQVOSp9nc5g0kQagaDVnQIXMTo'
  }
];

export const getStreakProgress = (current, goal) => {
  return Math.min((current / goal) * 100, 100);
};

export const getEncouragement = (progress) => {
  if (progress >= 80) return "Almost there! Stay strong.";
  if (progress >= 60) return "You're doing great! Keep it up.";
  if (progress >= 40) return "You're making progress! Keep going.";
  if (progress >= 20) return "Every day counts! Stay focused.";
  return "You've got this! Start strong.";
}; 
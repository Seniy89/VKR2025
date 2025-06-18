export const formatDate = (date) => {
  const now = new Date();
  const messageDate = new Date(date);
  const diffTime = Math.abs(now - messageDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffTime / (1000 * 60));

  if (diffDays > 0) {
    return `${diffDays} дн. назад`;
  } else if (diffHours > 0) {
    return `${diffHours} ч. назад`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes} мин. назад`;
  } else {
    return 'только что';
  }
}; 
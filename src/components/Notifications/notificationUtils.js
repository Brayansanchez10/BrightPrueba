// Manejar los colores
export const getNotificationBorderColor = (type) => {
  switch (type) {
    case 'FORUM_ACTIVATED':
      return 'border-green-500';
    case 'FORUM_DESACTIVATED':
      return 'border-red-500';
    case 'COURSE_CREATED':
      return 'border-green-500';
    case 'COURSE_DELETED':
      return 'border-red-500';
    case 'RESOURCE_CREATED':
      return 'border-green-500';
    case 'COURSE_COMPLETED':
      return 'border-green-700';
    case 'ANSWER_CREATED':
      return 'border-blue-600';
    case 'APPLICATION':
      return 'border-blue-600';
    case 'ACCEPTED':
      return 'border-green-500'; 
    case 'FRIENDS':
      return 'border-orange-500'; 
    default:
      return 'border-gray-500';
  }
};

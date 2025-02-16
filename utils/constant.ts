export const constantData = {
  errorNotificationStyle(){
    return {
      background: 'bg-white dark:bg-white',
      title: 'text-sm font-medium text-red-500',
      description: 'mt-1 text-sm leading-4 text-gray-600 dark:text-gray-600'
    }
  },
  warningNotificationStyle() {
    return {
        "background": "bg-yellow-50 dark:bg-yellow-50",
        "title": "text-sm font-medium text-yellow-500 dark:text-yellow-500",
        "description": "mt-1 text-sm leading-4 text-gray-600 dark:text-gray-600",

    };
  },
  successNotificationStyle(){
    return {
      background: 'bg-white dark:bg-white',
      title: 'text-sm font-medium text-green-500',
      description: 'mt-1 text-sm leading-4 text-gray-600 dark:text-gray-600'
    }
  }
}

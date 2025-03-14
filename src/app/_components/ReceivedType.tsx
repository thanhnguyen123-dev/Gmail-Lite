import React from 'react'

type ReceivedType = {
  receivedType: string;
}

const receivedTypes = [
  {
    type: 'INBOX',
    color: 'bg-blue-500',
  },
  {
    type: 'SENT',
    color: 'bg-green-500',
  },
  {
    type: 'DRAFT',
    color: 'bg-yellow-500',
  },
  {
    type: 'SPAM',
    color: 'bg-red-500',
  },
  {
    type: 'TRASH',
    color: 'bg-gray-500',
  },
  {
    type: 'IMPORTANT',
    color: 'bg-purple-500',
  },
  {
    type: 'STARRED',
    color: 'bg-orange-500',
  },
  {
    type: 'UNREAD',
    color: 'bg-gray-500',
  },
  {
    type: 'CATEGORY_UPDATES',
    color: 'bg-pink-500',
  },
  {
    type: 'CATEGORY_PERSONAL',
    color: 'bg-red-500',
  },
  {
    type: 'CATEGORY_PROMOTIONS',
    color: 'bg-orange-500',
  },
  {
    type: 'CATEGORY_SOCIAL',
    color: 'bg-purple-500',
  },
]
const ReceivedType = ({ receivedType }: ReceivedType) => {
  return (
    <div className={`flex rounded-lg p-2 ${receivedTypes.find(type => type.type === receivedType)?.color}`}>
      <span className="text-white text-xs font-normal">{receivedType}</span>
    </div>
  );
}

export default ReceivedType;
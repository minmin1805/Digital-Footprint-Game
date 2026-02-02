import React from 'react'

import person1 from '../assets/GamePage/FriendIcons/person1.png'
import person2 from '../assets/GamePage/FriendIcons/person2.png'
import person3 from '../assets/GamePage/FriendIcons/person3.png'
import person4 from '../assets/GamePage/FriendIcons/person4.png'
import person5 from '../assets/GamePage/FriendIcons/person5.png'
import person6 from '../assets/GamePage/FriendIcons/person6.png'


function FriendSection() {

    const friendsInfo = [
        {
            id: 1,
            name: "jess",
            image: person1,
        },
        {
            id: 2,
            name: "t_om",
            image: person2,
        },
        {
            id: 3,
            name: "kindlnd",
            image: person3,
        },
        {
            id: 4,
            name: "mary_trg",
            image: person4,
        },
        {
            id: 5,
            name: "vivet",
            image: person5,
        },
        {
            id: 6,
            name: "jacksmith_",
            image: person6,
        }
    ]
  return (
    <div className='flex items-center justify-between gap-3'>
        {friendsInfo.map((eachFriend) => {
            return (
                <div key={eachFriend.id} className='flex flex-col items-center justify-center gap-1'>
                    <img src={eachFriend.image} alt={eachFriend.name} className='w-14 h-14 rounded-full border-2 border-gray-300 shrink-0' />
                    <p className='text-sm'>{eachFriend.name}</p>
                </div>
            )
        })}
    </div>
  )
}

export default FriendSection
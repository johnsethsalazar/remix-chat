import axios from "axios"
import { useEffect, useState } from "react"

interface Message {
  _id: string,
  content: string
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([])
  // Function that will trigger everytime the page is reloaded
  const getAllMessages = async () => {
    try{
      const response = await axios.get<Message[]>('https://cors-anywhere.herokuapp.com/https://remix-chat-backend-3h7y.vercel.app/api/getAllMessages')
      setMessages(response.data)
      console.log(response.data)
    }catch(err){
      console.log(err)
    }
  }
  useEffect(() => {
    getAllMessages()
  }, [])

  console.log('messages', messages)
  return <div>Chat</div>
}

export default Chat
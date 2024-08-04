import { Button, Card, Layout, Page, TextField } from "@shopify/polaris";
import axios from "axios";
import { useEffect, useState } from "react";

interface Message {
  _id: string;
  constent: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  // Function that will trigger everytime the page is reloaded
  const getAllMessages = async () => {
    try {
      const response = await axios.get<Message[]>(
        "https://cors-anywhere.herokuapp.com/https://remix-chat-backend-3h7y.vercel.app/api/getAllMessages",
      );
      setMessages(response.data);
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getAllMessages();
  }, []);

  console.log("messages", messages);
  return (
    <Page>
      <Layout>
        <Layout.Section>
          <div>
            <h1>Chat</h1>
            {messages.length > 0 ? (
              <div>
                {messages.map((message: Message) => (
                  <div key={message._id}>
                    <Card>{message.constent}</Card>
                    <br />
                  </div>
                ))}
              </div>
            ) : (
              <h1>No messages found</h1>
            )}
          </div>
        </Layout.Section>
        <Layout.Section>
          <div style={{ position: "fixed", bottom: "0", width: "25em" }}>
            <Card background="bg-surface-secondary">
              <TextField label="" autoComplete="off" />
              <Button>Send</Button>
            </Card>
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Chat;

import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const InboxPage = () => {
  const { selectedUser, setSelectedUserByUsername } = useChatStore();
  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (username) {
      setSelectedUserByUsername(username);
    }
  }, [username, setSelectedUserByUsername]);

  useEffect(() => {
    if (selectedUser && selectedUser.username !== username) {
      navigate(`/inbox/${selectedUser.username}`);
    }
  }, [selectedUser, username, navigate]);

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InboxPage;

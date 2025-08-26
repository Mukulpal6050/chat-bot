import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation, Link } from "react-router-dom";
import api, { setToken, getToken } from "../lib/api.js";

function Sidebar({ conversations, activeId }) {
  const nav = useNavigate();
  const newChat = async () => {
    const { data } = await api.post("/api/conversations", {});
    nav(`/c/${data._id}`);
  };
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <button className="button primary" onClick={newChat}>+ New chat</button>
        <Link className="button" to="/login" onClick={()=>setToken(null)}>Logout</Link>
      </div>
      <div className="convo-list">
        {conversations.map(c => (
          <div key={c._id} className={"convo-item" + (activeId===c._id ? " active": "")} onClick={()=>nav(`/c/${c._id}`)}>
            {c.title}
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatView({ id }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  useEffect(() => {
    let mounted = true;
    api.get(`/api/conversations/${id}`).then(({data})=>{
      if (mounted) setMessages(data.messages || []);
    }).catch(()=>{});
    return ()=>{mounted=false;}
  }, [id]);

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages(m => [...m, { role:"user", content:text }]);
    try {
      const { data } = await api.post(`/api/conversations/${id}/messages`, { content: text });
      setMessages(data.messages);
    } catch (e) {
      setMessages(m => [...m, { role:"assistant", content: "Error sending message." }]);
    }
  };

  return (
    <div className="main">
      <div className="header"><div>Chat</div></div>
      <div className="messages">
        {messages.map((m, i)=> (
          <div key={i} className={"msg " + (m.role==="assistant" ? "assistant": "")}>{m.content}</div>
        ))}
      </div>
      <div className="composer">
        <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Message..." />
        <button className="button primary" onClick={send}>Send</button>
      </div>
    </div>
  );
}

export default function ChatLayout() {
  const [conversations, setConversations] = useState([]);
  const location = useLocation();
  const nav = useNavigate();
  const id = location.pathname.startsWith("/c/") ? location.pathname.split("/c/")[1] : null;

  useEffect(() => {
    if (!getToken()) return;
    api.get("/api/conversations").then(({data}) => {
      setConversations(data);
      if (!id && data.length) {
        nav(`/c/${data[0]._id}`, { replace: true });
      } else if (!id && !data.length) {
        // auto create first conversation
        api.post("/api/conversations", {}).then(({data})=> nav(`/c/${data._id}`, { replace: true }));
      }
    });
  }, [id]);

  return (
    <div className="app">
      <Sidebar conversations={conversations} activeId={id} />
      {id ? <ChatView id={id} /> : <div className="main"><div className="messages" /></div>}
    </div>
  );
}

import React from "react";
import { MindMap, Public, Home, Summary, Quiz, ChatBot, Login, Forgotpassword, Signup} from "./containers/public";
import {Library, OpenMap, OpenQuiz} from "./containers/private";
import { Routes, Route } from "react-router-dom";
import path from "./utils/path";
import { Private, Mapdb} from "./containers/private";

export default function App() {
  return (
    <>
      <div className="">
        <Routes>
          <Route path={path.PUBLIC} element={<Public />}>
            <Route path={path.HOME} element={<Home isLoggedIn={false}/>} />
            <Route path={path.SUMMARY} element={<Summary />} />
            <Route path={path.QUIZ} element={<Quiz />} />
            <Route path={path.MINDMAP} element={<MindMap isLoggedIn={false}/>} />
            <Route path={path.CHATBOT} element={<ChatBot />} />
          </Route>
          <Route path={path.LOGIN} element={<Login/>} /> 
          <Route path={path.FORGOTPW} element={<Forgotpassword/>} />
          <Route path={path.SIGNUP} element={<Signup/>} />
          <Route path="/openMap/:itemId" element={<OpenMap />} />
          <Route path="/openQuiz/:itemId" element={<OpenQuiz />} />
          <Route path={path.PRIVATE} element={<Private/>}>
            <Route path={path.HOME} element={<Home isLoggedIn/>} />
            <Route path={path.SUMMARY} element={<Summary />} />
            <Route path={path.MINDMAP} element={<MindMap isLoggedIn/>} />
            <Route path={path.QUIZ} element={<Quiz isLoggedIn/>} />
            <Route path={path.CHATBOT} element={<ChatBot />} />
            <Route path={path.LIBRARY} element={<Library />} />
          </Route>
          <Route path={path.MAPDB} element={<Mapdb mindmapData={location.state?.mindmapData} />} />
        </Routes>
      </div>
    </>
  );
}
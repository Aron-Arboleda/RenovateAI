import {BrowserRouter, Routes, Route} from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import LeadsDashboard from "./components/LeadsDashboard";
import BookingForm from "./components/BookingForm";
import ChatWidget from "./components/ChatWidget";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/leads"
          element={
            <>
              <LeadsDashboard />
              <ChatWidget />
            </>
          }
        />
        <Route
          path="/book"
          element={
            <>
              <BookingForm />
              <ChatWidget />
            </>
          }
        />
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
              <ChatWidget />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

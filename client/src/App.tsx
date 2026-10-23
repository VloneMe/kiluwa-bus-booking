import { 
  Route, RouterProvider, createBrowserRouter, createRoutesFromElements 
} from "react-router-dom";


import { Home } from "./pages/Home";
import { RootLayout } from "./layout/RootLayout";
import BusBooking from "./components/bus/BusBooking";
import { ContactUs } from "./components/contactus";
import AboutUs from "./components/aboutus";
import NotFoundPage from "./components/error/NotFoundPage";
import ForbiddenPage from "./components/error/ForbiddenPage";
import ServerErrorPage from "./components/error/ServerErrorPage";
// import DownloadTicket from "./components/bus/MyTicket";
import { BusLayout } from "./layout/BusLayout";
import Payment from "./components/bus/TicketsPayment";
import { Ticket } from "./components/bus/Ticket";
import BusBookingById from "./components/bus/BusBookingById";
import TransactionFailed from "./components/bus/TransactionFailed";
import CompleteBooking from "./components/common/SusscessBooking";
// import { Login } from "./components/form/Login";
// import { Register } from "./components/form/Register";
import { Account } from "./components/user/Account";
import ProtectedRoute from "./components/protect";
import { ChangePassword } from "./components/form/ChangePassword";
import { UserLayout } from "./layout/UserLayout";
import { UpdateProfile } from "./components/form/UpdateProfile";


export default function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>

        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />}/>
          {/* <Route path="login" element={<Login />}/> */}
          {/* <Route path="register" element={<Register />}/> */}
          <Route path="aboutus" element={<AboutUs />}/>
          <Route path="myticket" element={<Ticket ticketid={""} non_input={false} />}/>
          <Route path="contactus" element={<ContactUs className={""} />}/>
          <Route path="payments/:id" element={<Payment />}/>
          <Route path="completebooking" element={<CompleteBooking />}/>
          <Route path="transactionfailed" element={<TransactionFailed />}/>

          <Route path="/booking" element={<BusLayout />}>
            <Route index element={<BusBooking />}/>
            <Route path=":id" element={<BusBookingById />}/>
            <Route path=":from/:to/:date" element={<BusBooking />}/>
          </Route>
        </Route>

        <Route path="/myaccount" element={
          <ProtectedRoute>
              <UserLayout />
          </ProtectedRoute>
          }>
          <Route index element={
              <Account />
          }/>

          <Route path="update-profile" element={<UpdateProfile />}/>
          <Route path="change-password" element={<ChangePassword />}/>
        </Route>

        {/* Error Handled  */}
        <Route path="/403" element={<ForbiddenPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="/500" element={<ServerErrorPage />} />
        
        {/* Fallback route for any undefined paths */}
        <Route path="*" element={<NotFoundPage />}/>
      </Route>
    )
  );
  return <RouterProvider router={router}/>;
}